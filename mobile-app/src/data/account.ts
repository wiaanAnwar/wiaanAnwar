export type AccountType = 'UN & INGO' | 'Business' | 'Individual';

// Category copy only — the actual identity (name, org, contract ref) now
// comes from the backend per signed-in user (see store.account), not a
// static table keyed by type.
const TYPE_LABELS: Record<AccountType, { en: string; ar: string }> = {
  'UN & INGO': { en: 'UN & INGO framework client', ar: 'عميل اتفاقية إطارية' },
  Business: { en: 'Corporate account', ar: 'حساب شركات' },
  Individual: { en: 'Individual customer', ar: 'عميل فرد' },
};

export function accountTypeLabel(type: AccountType, isArabic: boolean): string {
  return isArabic ? TYPE_LABELS[type].ar : TYPE_LABELS[type].en;
}

export function initialsOf(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return '';
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}

export const BV_CONTACT = {
  phones: ['0912301407', '0188460022'],
  email: 'mickey5m1@gmail.com',
  addressEn: 'Khartoum (2) Victoria ST (almolazim abdelgader mohamed abas st) 43 House (6) Back Off Canar Building',
  addressAr: 'الخرطوم (٢) شارع فيكتوريا (شارع الملازم عبد القادر محمد عباس) المنزل ٤٣ (٦) خلف مبنى كنار',
  hours: { satThu: '8:00 – 18:00' },
  sdgRate: 2600, // fallback only — real accounts get their org's rate from the backend
};

// From BV's Ministry of Justice Certificate of Registration (No. 65417,
// registered 31 Aug 2015, Khartoum) and company profile — the trading name
// "BV Bavarian Rent a Car" is what the app shows everywhere else; this is
// the legal entity behind it, for the one place a registered business
// discloses that (account footer).
export const BV_LEGAL = {
  entityEn: 'Albavaria Limousine Project',
  entityAr: 'مشروع البافارية ليموزين',
  registrationNo: '65417',
  foundedYear: 2009,
};

// Real, named clients from BV's own company profile and reference list —
// organisation names only. Individual staff contacts at these agencies are
// not included; that's their personal information, not BV's to publish.
export const TRUSTED_BY: string[] = [
  'WFP', 'UNICEF', 'WHO', 'FAO', 'IOM',
  'MSF', 'Save the Children', 'GIZ', 'IRC', 'Oxfam', 'DRC', 'Plan International', 'AAR Japan',
];
