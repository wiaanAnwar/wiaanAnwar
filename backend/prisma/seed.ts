// Ports the exact mock catalog from mobile-app/src/data/*.ts so the app's
// behavior doesn't change the moment it starts talking to this backend.
// Three demo phone numbers are seeded so testers can sign in as each account
// type without a real SMS provider — see OTP_DEV_MODE in .env.
import { PrismaClient, AccountType } from '@prisma/client';

const prisma = new PrismaClient();

function addDays(d: Date, n: number): Date {
  const c = new Date(d);
  c.setHours(0, 0, 0, 0);
  c.setDate(c.getDate() + n);
  return c;
}

const T = new Date();
T.setHours(0, 0, 0, 0);
const busy = (offset: number) => addDays(T, offset);

async function main() {
  console.log('Seeding…');

  // ── organizations ──────────────────────────────────────
  const blueNile = await prisma.organization.upsert({
    where: { id: 'org-bnt' },
    update: {},
    create: {
      id: 'org-bnt',
      name: 'Blue Nile Trading Co.',
      nameAr: 'شركة النيل الأزرق التجارية',
      type: AccountType.BUSINESS,
      contractRef: 'BV-BNT-22',
      validUntil: new Date('2026-12-31'),
      sdgRate: 2600,
    },
  });

  // Real, named client from BV's own reference list (not fictional like the
  // rest of this seed's individual contacts) — WFP is BV's longest-standing
  // UN client per the company profile. No personal staff contact info is
  // seeded here; that belongs to the named individual at WFP, not BV.
  const wfp = await prisma.organization.upsert({
    where: { id: 'org-wfp' },
    update: {},
    create: {
      id: 'org-wfp',
      name: 'World Food Programme — Sudan Country Office',
      nameAr: 'برنامج الأغذية العالمي — المكتب القطري السودان',
      type: AccountType.AGENCY,
      contractRef: 'BV-WFP-24',
      validUntil: new Date('2026-12-31'),
      sdgRate: 2600,
    },
  });

  // ── approvers (org-scoped) ──────────────────────────────
  const approverSeed = [
    { name: 'Mohamed Elhassan', nameAr: 'محمد الحسن', role: 'Operations Manager · approves to $5,000', roleAr: 'مدير العمليات · يعتمد حتى ٥٠٠٠ دولار', maxApprovalUsd: 5000 },
    { name: 'Sara Abdelrahman', nameAr: 'سارة عبد الرحمن', role: 'Finance Focal Point · approves any amount', roleAr: 'المسؤول المالي · يعتمد أي مبلغ', maxApprovalUsd: null },
    { name: 'Tarig Ibrahim', nameAr: 'طارق إبراهيم', role: 'Logistics Officer · approves to $1,500', roleAr: 'مسؤول اللوجستيات · يعتمد حتى ١٥٠٠ دولار', maxApprovalUsd: 1500 },
  ];
  for (const org of [blueNile, wfp]) {
    for (const a of approverSeed) {
      const existing = await prisma.approver.findFirst({ where: { organizationId: org.id, name: a.name } });
      if (!existing) await prisma.approver.create({ data: { ...a, organizationId: org.id } });
    }
  }

  // ── demo users (one per account type) ───────────────────
  const individual = await prisma.user.upsert({
    where: { phone: '0900000001' },
    update: {},
    create: { phone: '0900000001', name: 'Amna Idris', nameAr: 'آمنة إدريس', accountType: AccountType.INDIVIDUAL },
  });
  const businessUser = await prisma.user.upsert({
    where: { phone: '0900000002' },
    update: {},
    create: { phone: '0900000002', name: 'Blue Nile Trading Co.', nameAr: 'شركة النيل الأزرق التجارية', accountType: AccountType.BUSINESS, organizationId: blueNile.id },
  });
  const agencyUser = await prisma.user.upsert({
    where: { phone: '0900000003' },
    update: {},
    create: { phone: '0900000003', name: 'World Food Programme — Sudan Country Office', nameAr: 'برنامج الأغذية العالمي — المكتب القطري السودان', accountType: AccountType.AGENCY, organizationId: wfp.id },
  });
  void individual;
  void agencyUser;

  // ── vehicles + units ─────────────────────────────────────
  const vehicleSeed = [
    { id: 'prado', name: 'Toyota Land Cruiser Prado', category: 'SUV', badge: 'SUV / Luxury', badgeAr: 'دفع رباعي / فاخرة', seats: 7, bags: 4, gear: 'Auto', fuel: 'Diesel', dailyRateUsd: 150,
      inc: ['Comprehensive insurance', 'Unlimited mileage', '24/7 roadside assistance', 'Airport delivery available'],
      incAr: ['تأمين شامل', 'مسافة غير محدودة', 'مساعدة على الطريق ٢٤/٧', 'توصيل من المطار عند الطلب'],
      units: [{ plate: 'KRT 4471', busyUntil: busy(6) }, { plate: 'KRT 5120', busyUntil: null }, { plate: 'KRT 6033', busyUntil: null }, { plate: 'KRT 7781', busyUntil: busy(16) }] },
    { id: 'voleex', name: 'Great Wall Voleex C30', category: 'Sedan', badge: 'Sedan / Economy', badgeAr: 'سيدان / اقتصادية', seats: 5, bags: 2, gear: 'Manual', fuel: 'Petrol', dailyRateUsd: 45,
      inc: ['Comprehensive insurance', 'Unlimited mileage', 'City driving package'],
      incAr: ['تأمين شامل', 'مسافة غير محدودة', 'باقة القيادة داخل المدينة'],
      units: [{ plate: 'KRT 2210', busyUntil: null }, { plate: 'KRT 2311', busyUntil: null }, { plate: 'KRT 2415', busyUntil: null }, { plate: 'KRT 2588', busyUntil: busy(3) }, { plate: 'KRT 2604', busyUntil: null }, { plate: 'KRT 2790', busyUntil: null }] },
    { id: 'hilux', name: 'Toyota Hilux', category: 'Truck', badge: 'Truck / Utility', badgeAr: 'بيك أب / خدمات', seats: 5, bags: 10, gear: 'Manual', fuel: 'Diesel', dailyRateUsd: 90,
      inc: ['Comprehensive insurance', 'Unlimited mileage', 'Load securing kit', 'Off-road ready'],
      incAr: ['تأمين شامل', 'مسافة غير محدودة', 'عدة تثبيت الحمولة', 'جاهزة للطرق الوعرة'],
      units: [{ plate: 'KRT 8801', busyUntil: null }, { plate: 'KRT 8834', busyUntil: null }, { plate: 'KRT 8902', busyUntil: busy(11) }, { plate: 'KRT 9010', busyUntil: null }, { plate: 'KRT 9155', busyUntil: null }] },
    { id: 'limo', name: 'Luxury Limousine', category: 'VIP', badge: 'VIP', badgeAr: 'كبار الشخصيات', seats: 4, bags: 3, gear: 'Auto', fuel: 'Petrol', dailyRateUsd: 250,
      inc: ['Professional chauffeur', 'Comprehensive insurance', 'Bottled water & refreshments', 'Wedding decoration on request'],
      incAr: ['سائق محترف', 'تأمين شامل', 'مياه ومرطبات', 'تزيين الأعراس عند الطلب'],
      units: [{ plate: 'KRT 0001', busyUntil: busy(8) }] },
    { id: 'lcv8', name: 'Toyota Land Cruiser V8', category: 'SUV', badge: 'SUV / Executive', badgeAr: 'دفع رباعي / تنفيذية', seats: 7, bags: 5, gear: 'Auto', fuel: 'Petrol', dailyRateUsd: 200,
      inc: ['Comprehensive insurance', 'Unlimited mileage', '24/7 roadside assistance', 'Airport meet & greet'],
      incAr: ['تأمين شامل', 'مسافة غير محدودة', 'مساعدة على الطريق ٢٤/٧', 'استقبال في المطار'],
      units: [{ plate: 'KRT 3300', busyUntil: null }, { plate: 'KRT 3412', busyUntil: null }, { plate: 'KRT 3577', busyUntil: busy(20) }] },
    { id: 'hiace', name: 'Toyota Hiace', category: 'Van', badge: 'Van / Group', badgeAr: 'فان / مجموعات', seats: 11, bags: 8, gear: 'Manual', fuel: 'Diesel', dailyRateUsd: 120,
      inc: ['Driver included', 'Comprehensive insurance', 'A/C throughout'],
      incAr: ['يشمل السائق', 'تأمين شامل', 'تكييف كامل'],
      units: [{ plate: 'KRT 7010', busyUntil: null }, { plate: 'KRT 7122', busyUntil: null }, { plate: 'KRT 7288', busyUntil: null }, { plate: 'KRT 7301', busyUntil: busy(23) }] },
    { id: 'coaster', name: 'Toyota Coaster', category: 'Bus', badge: 'Bus / Group', badgeAr: 'باص / مجموعات', seats: 30, bags: 20, gear: 'Manual', fuel: 'Diesel', dailyRateUsd: 200,
      inc: ['Driver included', 'Comprehensive insurance', 'Luggage hold', 'Onboard water'],
      incAr: ['يشمل السائق', 'تأمين شامل', 'حجرة أمتعة', 'مياه على متن الباص'],
      units: [{ plate: 'KRT 5001', busyUntil: null }, { plate: 'KRT 5140', busyUntil: busy(14) }] },
    { id: 'corolla', name: 'Toyota Corolla', category: 'Sedan', badge: 'Sedan / Comfort', badgeAr: 'سيدان / مريحة', seats: 5, bags: 3, gear: 'Auto', fuel: 'Petrol', dailyRateUsd: 50,
      inc: ['Comprehensive insurance', 'Unlimited mileage', 'Economical city runs'],
      incAr: ['تأمين شامل', 'مسافة غير محدودة', 'اقتصادية للتنقل داخل المدينة'],
      units: [{ plate: 'KRT 1102', busyUntil: null }, { plate: 'KRT 1233', busyUntil: null }, { plate: 'KRT 1390', busyUntil: null }, { plate: 'KRT 1444', busyUntil: null }, { plate: 'KRT 1520', busyUntil: null }, { plate: 'KRT 1666', busyUntil: busy(1) }, { plate: 'KRT 1777', busyUntil: null }] },
    { id: 'accent', name: 'Hyundai Accent', category: 'Sedan', badge: 'Sedan / Economy', badgeAr: 'سيدان / اقتصادية', seats: 5, bags: 2, gear: 'Manual', fuel: 'Petrol', dailyRateUsd: 40,
      inc: ['Comprehensive insurance', 'Unlimited mileage', 'Economical city runs'],
      incAr: ['تأمين شامل', 'مسافة غير محدودة', 'اقتصادية للتنقل داخل المدينة'],
      units: [{ plate: 'KRT 1810', busyUntil: null }, { plate: 'KRT 1822', busyUntil: null }, { plate: 'KRT 1845', busyUntil: busy(5) }, { plate: 'KRT 1861', busyUntil: null }] },
    { id: 'sorento', name: 'Kia Sorento', category: 'SUV', badge: 'SUV / Comfort', badgeAr: 'دفع رباعي / مريحة', seats: 7, bags: 4, gear: 'Auto', fuel: 'Petrol', dailyRateUsd: 130,
      inc: ['Comprehensive insurance', 'Unlimited mileage', '24/7 roadside assistance'],
      incAr: ['تأمين شامل', 'مسافة غير محدودة', 'مساعدة على الطريق ٢٤/٧'],
      units: [{ plate: 'KRT 3910', busyUntil: null }, { plate: 'KRT 3924', busyUntil: busy(9) }, { plate: 'KRT 3947', busyUntil: null }] },
    { id: 'camry', name: 'Toyota Camry', category: 'VIP', badge: 'VIP Sedan', badgeAr: 'سيدان كبار الشخصيات', seats: 5, bags: 3, gear: 'Auto', fuel: 'Petrol', dailyRateUsd: 85,
      inc: ['Comprehensive insurance', 'Unlimited mileage', 'Airport meet & greet'],
      incAr: ['تأمين شامل', 'مسافة غير محدودة', 'استقبال في المطار'],
      units: [{ plate: 'KRT 0510', busyUntil: null }, { plate: 'KRT 0524', busyUntil: null }, { plate: 'KRT 0538', busyUntil: busy(12) }] },
  ];

  for (const v of vehicleSeed) {
    await prisma.vehicle.upsert({
      where: { id: v.id },
      update: {},
      create: {
        id: v.id, name: v.name, category: v.category, badge: v.badge, badgeAr: v.badgeAr,
        seats: v.seats, bags: v.bags, gear: v.gear, fuel: v.fuel, dailyRateUsd: v.dailyRateUsd,
        incEn: JSON.stringify(v.inc), incAr: JSON.stringify(v.incAr),
        units: { create: v.units.map((u) => ({ plate: u.plate, busyUntil: u.busyUntil })) },
      },
    });
  }

  // ── locations ────────────────────────────────────────────
  const locationSeed = [
    { nameEn: 'BV Khartoum office', nameAr: 'مكتب BV الخرطوم', subEn: 'Victoria St · Sat–Thu 8:00–18:00', subAr: 'شارع فيكتوريا · السبت–الخميس ٨:٠٠–١٨:٠٠' },
    { nameEn: 'Khartoum International Airport', nameAr: 'مطار الخرطوم الدولي', subEn: 'Driver meets you on arrival', subAr: 'السائق في انتظارك عند الوصول' },
    { nameEn: 'Delivered to your address', nameAr: 'التوصيل إلى عنوانك', subEn: 'Within Khartoum · surcharge applies', subAr: 'داخل الخرطوم · رسوم إضافية' },
    { nameEn: 'Bahri branch', nameAr: 'فرع بحري', subEn: 'By arrangement · 24h notice', subAr: 'بالترتيب المسبق · إشعار ٢٤ ساعة' },
  ];
  const existingLocs = await prisma.location.count();
  if (existingLocs === 0) await prisma.location.createMany({ data: locationSeed });

  // ── add-ons ──────────────────────────────────────────────
  const addonSeed = [
    { id: 'meet', nameEn: 'Airport meet & greet', nameAr: 'استقبال في المطار', subEn: 'Driver waits with a name board', subAr: 'السائق ينتظرك بلافتة الاسم', priceUsd: 25, unit: 'once' },
    { id: 'decor', nameEn: 'Wedding decoration', nameAr: 'تزيين الأعراس', subEn: 'Flowers and ribbon on the vehicle', subAr: 'ورود وشرائط على السيارة', priceUsd: 60, unit: 'once' },
    { id: 'child', nameEn: 'Child seat', nameAr: 'مقعد أطفال', subEn: 'Fitted and checked before pickup', subAr: 'يُركّب ويُفحص قبل الاستلام', priceUsd: 6, unit: 'day' },
    { id: 'fuel', nameEn: 'Full-tank fuel card', nameAr: 'بطاقة وقود', subEn: 'Reconciled when you return the car', subAr: 'تُحتسب عند إعادة السيارة', priceUsd: 15, unit: 'day' },
  ];
  for (const a of addonSeed) await prisma.addon.upsert({ where: { id: a.id }, update: {}, create: a });

  // ── payment methods ──────────────────────────────────────
  const paySeed = [
    { id: 'invoice', nameEn: 'Invoice to account', nameAr: 'فاتورة على الحساب', subEn: '30-day terms on your agreement', subAr: '٣٠ يوماً حسب الاتفاقية', orgOnly: true },
    { id: 'bankak', nameEn: 'Bankak transfer', nameAr: 'تحويل بنكك', subEn: 'Transfer before pickup', subAr: 'التحويل قبل الاستلام', orgOnly: false },
    { id: 'mbok', nameEn: 'mBOK / mobile money', nameAr: 'أم بوك / محفظة إلكترونية', subEn: 'Instant confirmation', subAr: 'تأكيد فوري', orgOnly: false },
    { id: 'cash', nameEn: 'Cash on collection', nameAr: 'نقداً عند الاستلام', subEn: 'Deposit required at the office', subAr: 'مطلوب عربون في المكتب', orgOnly: false },
  ];
  for (const p of paySeed) await prisma.payMethod.upsert({ where: { id: p.id }, update: {}, create: p });

  // ── documents (Blue Nile Trading org) ────────────────────
  const docSeed = [
    { type: 'invoice', ref: 'INV-2026-0418', bookingRef: 'BV-26-0418', titleEn: 'Toyota Land Cruiser Prado — active hire', titleAr: 'تويوتا لاند كروزر برادو — إيجار جارٍ', date: busy(-1), amountUsd: 1290, status: 'outstanding' },
    { type: 'invoice', ref: 'INV-2026-0402', bookingRef: 'BV-26-0402', titleEn: 'Toyota Hilux — awaiting confirmation', titleAr: 'تويوتا هايلكس — بانتظار التأكيد', date: busy(-2), amountUsd: 1450, status: 'outstanding' },
    { type: 'invoice', ref: 'INV-2026-0377', bookingRef: 'BV-26-0377', titleEn: 'Toyota Land Cruiser V8 — completed hire', titleAr: 'تويوتا لاند كروزر V8 — إيجار مكتمل', date: busy(-10), amountUsd: 3800, status: 'settled' },
    { type: 'invoice', ref: 'INV-2026-0349', titleEn: 'Toyota Coaster — airport transfer group', titleAr: 'تويوتا كوستر — نقل مجموعة من المطار', date: busy(-34), amountUsd: 620, status: 'settled' },
    { type: 'invoice', ref: 'INV-2026-0301', titleEn: 'Toyota Hiace — monthly account run', titleAr: 'تويوتا هايس — تشغيل شهري للحساب', date: busy(-61), amountUsd: 2160, status: 'settled' },
    { type: 'contract', ref: 'BV-BNT-22', titleEn: 'Framework rate agreement', titleAr: 'اتفاقية الأسعار الإطارية', date: busy(-400), status: 'active' },
  ];
  const existingDocs = await prisma.document.count();
  if (existingDocs === 0) {
    await prisma.document.createMany({ data: docSeed.map((d) => ({ ...d, organizationId: blueNile.id })) });
  }

  // ── demo bookings (mirrors the mobile prototype's seed trips) ───
  const prado = await prisma.vehicle.findUniqueOrThrow({ where: { id: 'prado' } });
  const hiace = await prisma.vehicle.findUniqueOrThrow({ where: { id: 'hiace' } });
  const hilux = await prisma.vehicle.findUniqueOrThrow({ where: { id: 'hilux' } });
  const lcv8 = await prisma.vehicle.findUniqueOrThrow({ where: { id: 'lcv8' } });
  const pradoUnit = await prisma.vehicleUnit.findUniqueOrThrow({ where: { plate: 'KRT 4471' } });
  const hiluxUnit = await prisma.vehicleUnit.findUniqueOrThrow({ where: { plate: 'KRT 8902' } });
  const lcv8Unit = await prisma.vehicleUnit.findUniqueOrThrow({ where: { plate: 'KRT 3577' } });

  const bookingSeed = [
    { ref: 'BV-26-0418', vehicleId: prado.id, unitId: pradoUnit.id, pickupDate: busy(-1), returnDate: busy(6), locationId: 1, driver: true, driverName: 'Osman Bashir', stage: 3, needsApproval: true, costTotalUsd: 1290, depositUsd: 0 },
    { ref: 'BV-26-0431', vehicleId: hiace.id, unitId: null, pickupDate: busy(14), returnDate: busy(18), locationId: 2, driver: false, driverName: null, stage: 0, needsApproval: true, costTotalUsd: 720, depositUsd: 0 },
    { ref: 'BV-26-0402', vehicleId: hilux.id, unitId: hiluxUnit.id, pickupDate: busy(23), returnDate: busy(34), locationId: 1, driver: false, driverName: null, stage: 2, needsApproval: true, costTotalUsd: 1450, depositUsd: 0 },
    { ref: 'BV-26-0377', vehicleId: lcv8.id, unitId: lcv8Unit.id, pickupDate: busy(-26), returnDate: busy(-11), locationId: 1, driver: true, driverName: 'Yousif Ali', stage: 4, needsApproval: true, costTotalUsd: 3800, depositUsd: 0 },
  ];
  for (const b of bookingSeed) {
    const existing = await prisma.booking.findUnique({ where: { ref: b.ref } });
    if (!existing) {
      await prisma.booking.create({
        data: {
          ref: b.ref, userId: businessUser.id, vehicleId: b.vehicleId, unitId: b.unitId,
          pickupDate: b.pickupDate, returnDate: b.returnDate, locationId: b.locationId,
          driver: b.driver, driverName: b.driverName, addonsJson: '[]', orgName: 'Blue Nile Trading Co.',
          payMethod: 'invoice', needsApproval: b.needsApproval, stage: b.stage,
          costTotalUsd: b.costTotalUsd, depositUsd: b.depositUsd,
        },
      });
    }
  }

  await prisma.refCounter.upsert({
    where: { id: 'booking_ref' },
    update: {},
    create: { id: 'booking_ref', value: 444 },
  });

  console.log('Seed complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
