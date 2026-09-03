import { useAppStore } from '../store/useAppStore';
import { formatCash } from './pricing';
import { useI18n } from '../i18n/useI18n';

export function useCash() {
  const currency = useAppStore((s) => s.currency);
  const sdgRate = useAppStore((s) => s.account.sdgRate);
  const { lang } = useI18n();
  return (amountUsd: number) => formatCash(amountUsd, currency, sdgRate, lang);
}
