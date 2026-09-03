import { AccountType, Organization, User, Vehicle, VehicleUnit, Booking, Document as DocRow } from '@prisma/client';

// Maps the Prisma enum onto the exact string union the mobile app already
// uses (AccountType in mobile-app/src/data/account.ts), so the client needs
// no translation layer.
export function accountTypeLabel(t: AccountType): 'Individual' | 'Business' | 'UN & INGO' {
  if (t === 'BUSINESS') return 'Business';
  if (t === 'AGENCY') return 'UN & INGO';
  return 'Individual';
}

export function serializeUser(user: User & { organization?: Organization | null }) {
  return {
    id: user.id,
    phone: user.phone,
    name: user.name,
    nameAr: user.nameAr,
    accountType: accountTypeLabel(user.accountType),
    organization: user.organization
      ? {
          id: user.organization.id,
          name: user.organization.name,
          nameAr: user.organization.nameAr,
          contractRef: user.organization.contractRef,
          validUntil: user.organization.validUntil,
          sdgRate: user.organization.sdgRate,
        }
      : null,
  };
}

export function serializeVehicle(v: Vehicle & { units?: VehicleUnit[] }) {
  return {
    id: v.id,
    name: v.name,
    category: v.category,
    badge: v.badge,
    badgeAr: v.badgeAr,
    seats: v.seats,
    bags: v.bags,
    gear: v.gear,
    fuel: v.fuel,
    dailyRateUsd: v.dailyRateUsd,
    included: JSON.parse(v.incEn) as string[],
    includedAr: JSON.parse(v.incAr) as string[],
    units: v.units?.map((u) => ({ id: u.id, plate: u.plate, busyUntil: u.busyUntil })) ?? undefined,
  };
}

export function serializeBooking(b: Booking & { vehicle?: Vehicle; unit?: VehicleUnit | null }) {
  return {
    ref: b.ref,
    stage: b.stage,
    cancelled: b.cancelled,
    needsApproval: b.needsApproval,
    vehicle: b.vehicle?.name ?? b.vehicleId,
    plate: b.unit?.plate ?? '—',
    driver: b.driver,
    driverName: b.driverName,
    pickupDate: b.pickupDate,
    returnDate: b.returnDate,
    locationId: b.locationId,
    payMethod: b.payMethod,
    costTotalUsd: b.costTotalUsd,
    depositUsd: b.depositUsd,
    createdAt: b.createdAt,
  };
}

export function serializeDocument(d: DocRow) {
  return {
    id: d.id,
    type: d.type,
    ref: d.ref,
    bookingRef: d.bookingRef,
    titleEn: d.titleEn,
    titleAr: d.titleAr,
    date: d.date,
    amountUsd: d.amountUsd,
    status: d.status,
  };
}
