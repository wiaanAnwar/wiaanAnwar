import crypto from 'crypto';
import { env } from './env';

const OTP_LENGTH = 4;
const OTP_TTL_MS = 5 * 60 * 1000; // 5 minutes
const OTP_PEPPER = process.env.OTP_PEPPER ?? env.jwtSecret;

export function generateOtp(): string {
  // crypto.randomInt is CSPRNG-backed — Math.random() must never be used for
  // anything security-sensitive.
  return String(crypto.randomInt(0, 10 ** OTP_LENGTH)).padStart(OTP_LENGTH, '0');
}

/**
 * HMAC (not a bare hash) so a stolen database dump alone isn't enough to
 * brute-force a 4-digit code offline — the attacker also needs OTP_PEPPER.
 */
export function hashOtp(code: string): string {
  return crypto.createHmac('sha256', OTP_PEPPER).update(code).digest('hex');
}

export function otpExpiry(): Date {
  return new Date(Date.now() + OTP_TTL_MS);
}

export function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

/**
 * Stands in for a real SMS provider (Twilio, an SMS gateway, etc). In dev
 * mode the code is logged to the server console only — never returned in
 * an API response — so testing without a provider still doesn't leak the
 * code to anything that isn't the developer's own terminal.
 */
export async function sendOtpSms(phone: string, code: string): Promise<void> {
  if (env.otpDevMode) {
    // eslint-disable-next-line no-console
    console.log(`[DEV OTP] ${phone} -> ${code} (expires in 5 min)`);
    return;
  }
  throw new Error('No SMS provider configured. Wire one up before disabling OTP_DEV_MODE.');
}
