export type Currency = 'USD' | 'SDG';

export function formatCash(amountUsd: number, currency: Currency, sdgRate: number, lang: 'en' | 'ar'): string {
  if (currency === 'SDG') {
    const v = Math.round(amountUsd * sdgRate).toLocaleString('en-US');
    return v + (lang === 'ar' ? ' ج.س' : ' SDG');
  }
  return '$' + Math.round(amountUsd).toLocaleString('en-US');
}

export interface BookingCost {
  base: number;
  driverFee: number;
  extras: number;
  subtotal: number;
  vat: number;
  total: number;
  deposit: number;
}

const VAT_RATE = 0.17;
const CHAUFFEUR_RATE_PER_DAY = 40;
const DEPOSIT_RATE = 0.25;

export function computeBookingCost(opts: {
  dailyRate: number;
  nights: number;
  hasDriver: boolean;
  extrasTotal: number;
  payMethodId: string;
}): BookingCost {
  const base = opts.dailyRate * opts.nights;
  const driverFee = opts.hasDriver ? CHAUFFEUR_RATE_PER_DAY * opts.nights : 0;
  const subtotal = base + driverFee + opts.extrasTotal;
  const vat = Math.round(subtotal * VAT_RATE);
  const total = subtotal + vat;
  const deposit = opts.payMethodId === 'invoice' ? 0 : Math.round(total * DEPOSIT_RATE);
  return { base, driverFee, extras: opts.extrasTotal, subtotal, vat, total, deposit };
}
