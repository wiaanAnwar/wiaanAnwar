export interface Location {
  en: string;
  ar: string;
  enSub: string;
  arSub: string;
}

export const LOCS: Location[] = [
  { en: 'BV Khartoum office', ar: 'مكتب BV الخرطوم', enSub: 'Victoria St · Sat–Thu 8:00–18:00', arSub: 'شارع فيكتوريا · السبت–الخميس ٨:٠٠–١٨:٠٠' },
  { en: 'Khartoum International Airport', ar: 'مطار الخرطوم الدولي', enSub: 'Driver meets you on arrival', arSub: 'السائق في انتظارك عند الوصول' },
  { en: 'Delivered to your address', ar: 'التوصيل إلى عنوانك', enSub: 'Within Khartoum · surcharge applies', arSub: 'داخل الخرطوم · رسوم إضافية' },
  { en: 'Bahri branch', ar: 'فرع بحري', enSub: 'By arrangement · 24h notice', arSub: 'بالترتيب المسبق · إشعار ٢٤ ساعة' },
];
