export interface Addon {
  id: string;
  en: string;
  ar: string;
  enSub: string;
  arSub: string;
  price: number;
  unit: 'once' | 'day';
}

export const ADDONS: Addon[] = [
  { id: 'meet', en: 'Airport meet & greet', ar: 'استقبال في المطار', enSub: 'Driver waits with a name board', arSub: 'السائق ينتظرك بلافتة الاسم', price: 25, unit: 'once' },
  { id: 'decor', en: 'Wedding decoration', ar: 'تزيين الأعراس', enSub: 'Flowers and ribbon on the vehicle', arSub: 'ورود وشرائط على السيارة', price: 60, unit: 'once' },
  { id: 'child', en: 'Child seat', ar: 'مقعد أطفال', enSub: 'Fitted and checked before pickup', arSub: 'يُركّب ويُفحص قبل الاستلام', price: 6, unit: 'day' },
  { id: 'fuel', en: 'Full-tank fuel card', ar: 'بطاقة وقود', enSub: 'Reconciled when you return the car', arSub: 'تُحتسب عند إعادة السيارة', price: 15, unit: 'day' },
];

export interface Approver {
  id: string;
  en: string;
  ar: string;
  enRole: string;
  arRole: string;
}

// Bundled offline fallback only — the real, org-scoped list (with real
// backend ids) loads from GET /approvers right after sign-in. These
// placeholder ids never reach the server since submitting a booking
// requires a live connection in the first place.
export const APPROVERS: Approver[] = [
  { id: 'fallback-1', en: 'Mohamed Elhassan', ar: 'محمد الحسن', enRole: 'Operations Manager · approves to $5,000', arRole: 'مدير العمليات · يعتمد حتى ٥٠٠٠ دولار' },
  { id: 'fallback-2', en: 'Sara Abdelrahman', ar: 'سارة عبد الرحمن', enRole: 'Finance Focal Point · approves any amount', arRole: 'المسؤول المالي · يعتمد أي مبلغ' },
  { id: 'fallback-3', en: 'Tarig Ibrahim', ar: 'طارق إبراهيم', enRole: 'Logistics Officer · approves to $1,500', arRole: 'مسؤول اللوجستيات · يعتمد حتى ١٥٠٠ دولار' },
];

export interface PayMethod {
  id: 'invoice' | 'bankak' | 'mbok' | 'cash';
  en: string;
  ar: string;
  enSub: string;
  arSub: string;
  orgOnly?: boolean;
}

export const PAY: PayMethod[] = [
  { id: 'invoice', en: 'Invoice to account', ar: 'فاتورة على الحساب', enSub: '30-day terms on your agreement', arSub: '٣٠ يوماً حسب الاتفاقية', orgOnly: true },
  { id: 'bankak', en: 'Bankak transfer', ar: 'تحويل بنكك', enSub: 'Transfer before pickup', arSub: 'التحويل قبل الاستلام' },
  { id: 'mbok', en: 'mBOK / mobile money', ar: 'أم بوك / محفظة إلكترونية', enSub: 'Instant confirmation', arSub: 'تأكيد فوري' },
  { id: 'cash', en: 'Cash on collection', ar: 'نقداً عند الاستلام', enSub: 'Deposit required at the office', arSub: 'مطلوب عربون في المكتب' },
];
