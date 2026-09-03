import { PrismaClient } from '@prisma/client';

// Single shared client — Prisma pools connections internally, a new
// PrismaClient per request would exhaust connections under load.
export const prisma = new PrismaClient();
