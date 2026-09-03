import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { validateBody } from '../lib/validate';
import { generateOtp, hashOtp, otpExpiry, safeEqual, sendOtpSms } from '../lib/otp';
import { signToken } from '../lib/jwt';
import { requireAuth } from '../middleware/auth';
import { serializeUser } from '../lib/serialize';

export const authRouter = Router();

const phoneSchema = z.string().regex(/^0\d{9}$/, 'Expected a 10-digit local number starting with 0');

const sendCodeLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 5, standardHeaders: true, legacyHeaders: false });
const verifyCodeLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 15, standardHeaders: true, legacyHeaders: false });

const MAX_VERIFY_ATTEMPTS = 5;

authRouter.post(
  '/send-code',
  sendCodeLimiter,
  validateBody(z.object({ phone: phoneSchema })),
  async (req, res) => {
    const { phone } = req.body as { phone: string };
    const code = generateOtp();
    await prisma.otpCode.create({
      data: { phone, codeHash: hashOtp(code), expiresAt: otpExpiry() },
    });
    await sendOtpSms(phone, code);
    res.json({ ok: true });
  }
);

authRouter.post(
  '/verify-code',
  verifyCodeLimiter,
  validateBody(z.object({ phone: phoneSchema, code: z.string().length(4) })),
  async (req, res) => {
    const { phone, code } = req.body as { phone: string; code: string };

    const otp = await prisma.otpCode.findFirst({
      where: { phone, consumed: false, expiresAt: { gt: new Date() } },
      orderBy: { createdAt: 'desc' },
    });
    if (!otp) {
      res.status(400).json({ error: 'expired_or_missing', message: 'Request a new code.' });
      return;
    }
    if (otp.attempts >= MAX_VERIFY_ATTEMPTS) {
      await prisma.otpCode.update({ where: { id: otp.id }, data: { consumed: true } });
      res.status(429).json({ error: 'too_many_attempts', message: 'Request a new code.' });
      return;
    }

    const match = safeEqual(hashOtp(code), otp.codeHash);
    if (!match) {
      await prisma.otpCode.update({ where: { id: otp.id }, data: { attempts: { increment: 1 } } });
      res.status(400).json({ error: 'incorrect_code' });
      return;
    }

    await prisma.otpCode.update({ where: { id: otp.id }, data: { consumed: true } });

    // First sign-in for this phone creates a plain individual account —
    // corporate/agency accounts are provisioned by BV, not self-service.
    const user = await prisma.user.upsert({
      where: { phone },
      update: {},
      create: { phone, name: phone, accountType: 'INDIVIDUAL' },
      include: { organization: true },
    });

    const token = signToken(user.id);
    res.json({ token, user: serializeUser(user) });
  }
);

authRouter.get('/me', requireAuth, async (req, res) => {
  const user = await prisma.user.findUniqueOrThrow({
    where: { id: req.user!.id },
    include: { organization: true },
  });
  res.json({ user: serializeUser(user) });
});
