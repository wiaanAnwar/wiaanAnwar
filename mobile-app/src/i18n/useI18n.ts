import { useAppStore } from '../store/useAppStore';
import { STR } from './strings';

export function useI18n() {
  const lang = useAppStore((s) => s.lang);
  const isArabic = lang === 'ar';
  return { lang, isArabic, t: STR[lang], dir: isArabic ? ('rtl' as const) : ('ltr' as const) };
}
