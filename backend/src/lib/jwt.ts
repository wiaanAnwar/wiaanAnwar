import jwt from 'jsonwebtoken';
import { env } from './env';

export interface JwtPayload {
  sub: string; // user id
}

const EXPIRES_IN = '30d';

export function signToken(userId: string): string {
  return jwt.sign({ sub: userId } satisfies JwtPayload, env.jwtSecret, { expiresIn: EXPIRES_IN });
}

export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, env.jwtSecret) as JwtPayload;
}
