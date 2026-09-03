import { addDays, today } from '../utils/dates';

export type DocumentType = 'invoice' | 'contract';
export type DocumentStatus = 'outstanding' | 'settled' | 'active';

export interface DocumentRecord {
  id: string;
  type: DocumentType;
  ref: string;
  tripRef?: string;
  titleEn: string;
  titleAr: string;
  date: Date;
  amountUsd?: number;
  status: DocumentStatus;
}

const T = today();

// Mock records standing in for what a real backend would serve from
// GET /accounts/:id/documents. Kept in one place so the Account screen's
// summary counts and the Documents list can never drift out of sync.
export const DOCUMENTS: DocumentRecord[] = [
  { id: 'doc-1', type: 'invoice', ref: 'INV-2026-0418', tripRef: 'BV-26-0418', titleEn: 'Toyota Land Cruiser Prado — active hire', titleAr: 'تويوتا لاند كروزر برادو — إيجار جارٍ', date: addDays(T, -1), amountUsd: 1290, status: 'outstanding' },
  { id: 'doc-2', type: 'invoice', ref: 'INV-2026-0402', tripRef: 'BV-26-0402', titleEn: 'Toyota Hilux — awaiting confirmation', titleAr: 'تويوتا هايلكس — بانتظار التأكيد', date: addDays(T, -2), amountUsd: 1450, status: 'outstanding' },
  { id: 'doc-3', type: 'invoice', ref: 'INV-2026-0377', tripRef: 'BV-26-0377', titleEn: 'Toyota Land Cruiser V8 — completed hire', titleAr: 'تويوتا لاند كروزر V8 — إيجار مكتمل', date: addDays(T, -10), amountUsd: 3800, status: 'settled' },
  { id: 'doc-4', type: 'invoice', ref: 'INV-2026-0349', titleEn: 'Toyota Coaster — airport transfer group', titleAr: 'تويوتا كوستر — نقل مجموعة من المطار', date: addDays(T, -34), amountUsd: 620, status: 'settled' },
  { id: 'doc-5', type: 'invoice', ref: 'INV-2026-0301', titleEn: 'Toyota Hiace — monthly account run', titleAr: 'تويوتا هايس — تشغيل شهري للحساب', date: addDays(T, -61), amountUsd: 2160, status: 'settled' },
  { id: 'doc-6', type: 'contract', ref: 'BV-BNT-22', titleEn: 'Framework rate agreement', titleAr: 'اتفاقية الأسعار الإطارية', date: addDays(T, -400), status: 'active' },
];
