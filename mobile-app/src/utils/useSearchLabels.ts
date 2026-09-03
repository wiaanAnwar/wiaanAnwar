import { useAppStore } from '../store/useAppStore';
import { useCatalogStore } from '../store/useCatalogStore';
import { useI18n } from '../i18n/useI18n';
import { dateLabel, nightsLabel } from './dates';

export function useSearchLabels() {
  const { lang, isArabic, t } = useI18n();
  const pickupDate = useAppStore((s) => s.pickupDate);
  const returnDate = useAppStore((s) => s.returnDate);
  const locIdx = useAppStore((s) => s.locIdx);
  const locations = useCatalogStore((s) => s.locations);

  const nights = Math.max(1, Math.round((returnDate.getTime() - pickupDate.getTime()) / 86400000));
  const startLabel = dateLabel(pickupDate, lang);
  const endLabel = dateLabel(returnDate, lang);
  const rangeLabel = `${startLabel} → ${endLabel}`;
  const loc = locations[locIdx] ?? locations[0];
  const locationLabel = isArabic ? loc.ar : loc.en;
  const nightsLine = nightsLabel(nights, lang, t);

  return { nights, startLabel, endLabel, rangeLabel, locationLabel, nightsLine };
}
