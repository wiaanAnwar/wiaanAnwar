import { addDays, today } from '../utils/dates';

export type Category = 'SUV' | 'Sedan' | 'Truck' | 'VIP' | 'Van' | 'Bus';
export type Gear = 'Auto' | 'Manual';
export type Fuel = 'Diesel' | 'Petrol';

export interface VehicleUnit {
  plate: string;
  /** null = free right now. Otherwise the date it becomes free. */
  busyUntil: Date | null;
}

export interface Vehicle {
  id: string;
  name: string;
  cat: Category;
  badge: string;
  badgeAr: string;
  seats: number;
  bags: number;
  gear: Gear;
  fuel: Fuel;
  rate: number; // USD/day
  units: VehicleUnit[];
  inc: string[];
  incAr: string[];
}

const T = today();
// Offsets kept close to the source prototype's relative spread (it treated
// day-index ~8 as "today"), just re-anchored to the device's real today.
const busy = (offsetFromToday: number) => addDays(T, offsetFromToday);

export const VEHICLES: Vehicle[] = [
  {
    id: 'prado', name: 'Toyota Land Cruiser Prado', cat: 'SUV', badge: 'SUV / Luxury', badgeAr: 'دفع رباعي / فاخرة',
    seats: 7, bags: 4, gear: 'Auto', fuel: 'Diesel', rate: 150,
    units: [
      { plate: 'KRT 4471', busyUntil: busy(6) },
      { plate: 'KRT 5120', busyUntil: null },
      { plate: 'KRT 6033', busyUntil: null },
      { plate: 'KRT 7781', busyUntil: busy(16) },
    ],
    inc: ['Comprehensive insurance', 'Unlimited mileage', '24/7 roadside assistance', 'Airport delivery available'],
    incAr: ['تأمين شامل', 'مسافة غير محدودة', 'مساعدة على الطريق ٢٤/٧', 'توصيل من المطار عند الطلب'],
  },
  {
    id: 'voleex', name: 'Great Wall Voleex C30', cat: 'Sedan', badge: 'Sedan / Economy', badgeAr: 'سيدان / اقتصادية',
    seats: 5, bags: 2, gear: 'Manual', fuel: 'Petrol', rate: 45,
    units: [
      { plate: 'KRT 2210', busyUntil: null }, { plate: 'KRT 2311', busyUntil: null },
      { plate: 'KRT 2415', busyUntil: null }, { plate: 'KRT 2588', busyUntil: busy(3) },
      { plate: 'KRT 2604', busyUntil: null }, { plate: 'KRT 2790', busyUntil: null },
    ],
    inc: ['Comprehensive insurance', 'Unlimited mileage', 'City driving package'],
    incAr: ['تأمين شامل', 'مسافة غير محدودة', 'باقة القيادة داخل المدينة'],
  },
  {
    id: 'hilux', name: 'Toyota Hilux', cat: 'Truck', badge: 'Truck / Utility', badgeAr: 'بيك أب / خدمات',
    seats: 5, bags: 10, gear: 'Manual', fuel: 'Diesel', rate: 90,
    units: [
      { plate: 'KRT 8801', busyUntil: null }, { plate: 'KRT 8834', busyUntil: null },
      { plate: 'KRT 8902', busyUntil: busy(11) }, { plate: 'KRT 9010', busyUntil: null }, { plate: 'KRT 9155', busyUntil: null },
    ],
    inc: ['Comprehensive insurance', 'Unlimited mileage', 'Load securing kit', 'Off-road ready'],
    incAr: ['تأمين شامل', 'مسافة غير محدودة', 'عدة تثبيت الحمولة', 'جاهزة للطرق الوعرة'],
  },
  {
    id: 'limo', name: 'Luxury Limousine', cat: 'VIP', badge: 'VIP', badgeAr: 'كبار الشخصيات',
    seats: 4, bags: 3, gear: 'Auto', fuel: 'Petrol', rate: 250,
    units: [{ plate: 'KRT 0001', busyUntil: busy(8) }],
    inc: ['Professional chauffeur', 'Comprehensive insurance', 'Bottled water & refreshments', 'Wedding decoration on request'],
    incAr: ['سائق محترف', 'تأمين شامل', 'مياه ومرطبات', 'تزيين الأعراس عند الطلب'],
  },
  {
    id: 'lcv8', name: 'Toyota Land Cruiser V8', cat: 'SUV', badge: 'SUV / Executive', badgeAr: 'دفع رباعي / تنفيذية',
    seats: 7, bags: 5, gear: 'Auto', fuel: 'Petrol', rate: 200,
    units: [
      { plate: 'KRT 3300', busyUntil: null }, { plate: 'KRT 3412', busyUntil: null }, { plate: 'KRT 3577', busyUntil: busy(20) },
    ],
    inc: ['Comprehensive insurance', 'Unlimited mileage', '24/7 roadside assistance', 'Airport meet & greet'],
    incAr: ['تأمين شامل', 'مسافة غير محدودة', 'مساعدة على الطريق ٢٤/٧', 'استقبال في المطار'],
  },
  {
    id: 'hiace', name: 'Toyota Hiace', cat: 'Van', badge: 'Van / Group', badgeAr: 'فان / مجموعات',
    seats: 11, bags: 8, gear: 'Manual', fuel: 'Diesel', rate: 120,
    units: [
      { plate: 'KRT 7010', busyUntil: null }, { plate: 'KRT 7122', busyUntil: null },
      { plate: 'KRT 7288', busyUntil: null }, { plate: 'KRT 7301', busyUntil: busy(23) },
    ],
    inc: ['Driver included', 'Comprehensive insurance', 'A/C throughout'],
    incAr: ['يشمل السائق', 'تأمين شامل', 'تكييف كامل'],
  },
  {
    id: 'coaster', name: 'Toyota Coaster', cat: 'Bus', badge: 'Bus / Group', badgeAr: 'باص / مجموعات',
    seats: 30, bags: 20, gear: 'Manual', fuel: 'Diesel', rate: 200,
    units: [{ plate: 'KRT 5001', busyUntil: null }, { plate: 'KRT 5140', busyUntil: busy(14) }],
    inc: ['Driver included', 'Comprehensive insurance', 'Luggage hold', 'Onboard water'],
    incAr: ['يشمل السائق', 'تأمين شامل', 'حجرة أمتعة', 'مياه على متن الباص'],
  },
  {
    id: 'corolla', name: 'Toyota Corolla', cat: 'Sedan', badge: 'Sedan / Comfort', badgeAr: 'سيدان / مريحة',
    seats: 5, bags: 3, gear: 'Auto', fuel: 'Petrol', rate: 50,
    units: [
      { plate: 'KRT 1102', busyUntil: null }, { plate: 'KRT 1233', busyUntil: null }, { plate: 'KRT 1390', busyUntil: null },
      { plate: 'KRT 1444', busyUntil: null }, { plate: 'KRT 1520', busyUntil: null }, { plate: 'KRT 1666', busyUntil: busy(1) },
      { plate: 'KRT 1777', busyUntil: null },
    ],
    inc: ['Comprehensive insurance', 'Unlimited mileage', 'Economical city runs'],
    incAr: ['تأمين شامل', 'مسافة غير محدودة', 'اقتصادية للتنقل داخل المدينة'],
  },
  {
    id: 'accent', name: 'Hyundai Accent', cat: 'Sedan', badge: 'Sedan / Economy', badgeAr: 'سيدان / اقتصادية',
    seats: 5, bags: 2, gear: 'Manual', fuel: 'Petrol', rate: 40,
    units: [
      { plate: 'KRT 1810', busyUntil: null }, { plate: 'KRT 1822', busyUntil: null },
      { plate: 'KRT 1845', busyUntil: busy(5) }, { plate: 'KRT 1861', busyUntil: null },
    ],
    inc: ['Comprehensive insurance', 'Unlimited mileage', 'Economical city runs'],
    incAr: ['تأمين شامل', 'مسافة غير محدودة', 'اقتصادية للتنقل داخل المدينة'],
  },
  {
    id: 'sorento', name: 'Kia Sorento', cat: 'SUV', badge: 'SUV / Comfort', badgeAr: 'دفع رباعي / مريحة',
    seats: 7, bags: 4, gear: 'Auto', fuel: 'Petrol', rate: 130,
    units: [
      { plate: 'KRT 3910', busyUntil: null }, { plate: 'KRT 3924', busyUntil: busy(9) }, { plate: 'KRT 3947', busyUntil: null },
    ],
    inc: ['Comprehensive insurance', 'Unlimited mileage', '24/7 roadside assistance'],
    incAr: ['تأمين شامل', 'مسافة غير محدودة', 'مساعدة على الطريق ٢٤/٧'],
  },
  {
    id: 'camry', name: 'Toyota Camry', cat: 'VIP', badge: 'VIP Sedan', badgeAr: 'سيدان كبار الشخصيات',
    seats: 5, bags: 3, gear: 'Auto', fuel: 'Petrol', rate: 85,
    units: [
      { plate: 'KRT 0510', busyUntil: null }, { plate: 'KRT 0524', busyUntil: null }, { plate: 'KRT 0538', busyUntil: busy(12) },
    ],
    inc: ['Comprehensive insurance', 'Unlimited mileage', 'Airport meet & greet'],
    incAr: ['تأمين شامل', 'مسافة غير محدودة', 'استقبال في المطار'],
  },
];

export const AR_GEAR: Record<Gear, string> = { Auto: 'أوتوماتيك', Manual: 'عادي' };
export const AR_FUEL: Record<Fuel, string> = { Diesel: 'ديزل', Petrol: 'بنزين' };
