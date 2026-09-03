import { Vehicle } from '../data/vehicles';
import { freeUnits, nextFreeDate } from './availability';
import { dateLabel } from './dates';
import { Lang, Strings } from '../i18n/strings';

export interface VehicleRow {
  free: number;
  out: boolean;
  specLine: string;
  availability: string;
  availColor: string;
  dotColor: string;
  ctaLabel: string;
}

export function buildVehicleRow(
  v: Vehicle,
  opts: { pickupDate: Date; nights: number; lang: Lang; isArabic: boolean; t: Strings; cash: (n: number) => string }
): VehicleRow {
  const { pickupDate, lang, isArabic, t } = opts;
  const free = freeUnits(v, pickupDate).length;
  const out = free === 0;
  const specLine = v.seats + (isArabic ? ' مقاعد · ' : ' seats · ') + v.bags + (isArabic ? ' حقائب · ' : ' bags · ') + v.gear;
  const availability = out
    ? `${t.unavailable} · ${t.nextFree} ${dateLabel(nextFreeDate(v), lang)}`
    : free === 1
    ? t.lastOne
    : `${free} ${t.available}`;
  return {
    free,
    out,
    specLine,
    availability,
    availColor: out ? '#B41E1A' : '#5E5E62',
    dotColor: out ? '#DD2A26' : free === 1 ? '#F5B301' : '#188A4E',
    ctaLabel: out ? t.notifyMe : t.rentNow,
  };
}
