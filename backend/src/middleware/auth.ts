import { RequestHandler } from 'express';
import { verifyToken } from '../lib/jwt';
import { prisma } from '../lib/prisma';

/**
 * Requires a valid bearer token and attaches the current user, re-fetched
 * from the database on every request rather than trusted from the JWT
 * payload — so a changed or deactivated account takes effect immediately
 * instead of waiting out a 30-day token's lifetime.
 */
export const requireAuth: RequestHandler = async (req, res, next) => {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'unauthorized' });
    return;
  }
  try {
    const { sub } = verifyToken(header.slice('Bearer '.length));
    const user = await prisma.user.findUnique({ where: { id: sub } });
    if (!user) {
      res.status(401).json({ error: 'unauthorized' });
      return;
    }
    req.user = {
      id: user.id,
      phone: user.phone,
      name: user.name,
      nameAr: user.nameAr,
      accountType: user.accountType,
      organizationId: user.organizationId,
    };
    next();
  } catch {
    res.status(401).json({ error: 'unauthorized' });
  }
};
