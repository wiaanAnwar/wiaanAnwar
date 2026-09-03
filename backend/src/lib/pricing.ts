const VAT_RATE = 0.17;
const CHAUFFEUR_RATE_PER_DAY = 40;
const DEPOSIT_RATE = 0.25;

export interface BookingCost {
  base: number;
  driverFee: number;
  extras: number;
  subtotal: number;
  vat: number;
  total: number;
  deposit: number;
}

export function computeBookingCost(opts: {
  dailyRateUsd: number;
  nights: number;
  hasDriver: boolean;
  extrasTotalUsd: number;
  payMethodId: string;
}): BookingCost {
  const base = opts.dailyRateUsd * opts.nights;
  const driverFee = opts.hasDriver ? CHAUFFEUR_RATE_PER_DAY * opts.nights : 0;
  const subtotal = base + driverFee + opts.extrasTotalUsd;
  const vat = Math.round(subtotal * VAT_RATE);
  const total = subtotal + vat;
  const deposit = opts.payMethodId === 'invoice' ? 0 : Math.round(total * DEPOSIT_RATE);
  return { base, driverFee, extras: opts.extrasTotalUsd, subtotal, vat, total, deposit };
}

export function nightsBetween(pickup: Date, ret: Date): number {
  return Math.max(1, Math.round((ret.getTime() - pickup.getTime()) / 86400000));
}
