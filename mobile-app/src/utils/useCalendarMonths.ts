import { useMemo } from 'react';
import { monthLabel, satFirstIndex, today } from './dates';
import { useI18n } from '../i18n/useI18n';

export interface CalendarDay {
  date: Date;
  day: number;
  isPast: boolean;
}

export interface CalendarMonth {
  label: string;
  cells: (CalendarDay | null)[];
}

/** Current month + next month, Saturday-first weeks, matching STR.weekdays order. */
export function useCalendarMonths(): CalendarMonth[] {
  const { lang } = useI18n();
  return useMemo(() => {
    const t = today();
    const months: CalendarMonth[] = [];
    for (let m = 0; m < 2; m++) {
      const first = new Date(t.getFullYear(), t.getMonth() + m, 1);
      const daysInMonth = new Date(t.getFullYear(), t.getMonth() + m + 1, 0).getDate();
      const lead = satFirstIndex(first);
      const cells: (CalendarDay | null)[] = [];
      for (let i = 0; i < lead; i++) cells.push(null);
      for (let d = 1; d <= daysInMonth; d++) {
        const date = new Date(t.getFullYear(), t.getMonth() + m, d);
        cells.push({ date, day: d, isPast: date.getTime() < t.getTime() });
      }
      months.push({ label: monthLabel(first, lang), cells });
    }
    return months;
  }, [lang]);
}
