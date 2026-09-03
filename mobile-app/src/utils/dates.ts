// Real-date replacement for the prototype's hardcoded "September/October 2026"
// day-index calendar. Everything here works off the device's actual today.

export function startOfDay(d: Date): Date {
  const c = new Date(d);
  c.setHours(0, 0, 0, 0);
  return c;
}

export function today(): Date {
  return startOfDay(new Date());
}

export function addDays(d: Date, n: number): Date {
  const c = new Date(d);
  c.setDate(c.getDate() + n);
  return c;
}

export function diffDays(a: Date, b: Date): number {
  return Math.round((startOfDay(a).getTime() - startOfDay(b).getTime()) / 86400000);
}

export function isSameDay(a: Date, b: Date): boolean {
  return startOfDay(a).getTime() === startOfDay(b).getTime();
}

export function isBefore(a: Date, b: Date): boolean {
  return startOfDay(a).getTime() < startOfDay(b).getTime();
}

const EN_MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const AR_MONTHS = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
const EN_MONTHS_LONG = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export function dateLabel(d: Date, lang: 'en' | 'ar'): string {
  const day = d.getDate();
  const month = lang === 'ar' ? AR_MONTHS[d.getMonth()] : EN_MONTHS_SHORT[d.getMonth()];
  return `${day} ${month}`;
}

export function monthLabel(d: Date, lang: 'en' | 'ar'): string {
  const month = lang === 'ar' ? AR_MONTHS[d.getMonth()] : EN_MONTHS_LONG[d.getMonth()];
  return `${month} ${d.getFullYear()}`;
}

// Sudan/Gulf convention: week starts Saturday. JS getDay() is Sunday=0..Saturday=6.
export function satFirstIndex(d: Date): number {
  return (d.getDay() + 1) % 7;
}

export function nightsLabel(nights: number, lang: 'en' | 'ar', t: { day: string; days: string }): string {
  if (lang === 'ar') return `${nights} ${t.days}`;
  return `${nights} ${nights === 1 ? t.day : t.days}`;
}
