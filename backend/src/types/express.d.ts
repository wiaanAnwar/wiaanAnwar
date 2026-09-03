import { AccountType } from '@prisma/client';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        phone: string;
        name: string;
        nameAr: string | null;
        accountType: AccountType;
        organizationId: string | null;
      };
    }
  }
}

export {};
