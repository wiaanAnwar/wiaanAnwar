import { useAppStore } from '../store/useAppStore';
import { useCatalogStore } from '../store/useCatalogStore';
import { computeBookingCost } from './pricing';
import { useSearchLabels } from './useSearchLabels';
import { freeUnits } from './availability';

export function useSelectedVehicle() {
  const detailId = useAppStore((s) => s.detailId);
  const vehicles = useCatalogStore((s) => s.vehicles);
  return vehicles.find((v) => v.id === detailId) || vehicles[0];
}

/**
 * Best-effort preview of which unit will be assigned — the real assignment
 * happens authoritatively on the server at submit time (see bookingService),
 * so this can occasionally differ if another booking wins the race first.
 */
export function useAssignedUnit() {
  const v = useSelectedVehicle();
  const pickupDate = useAppStore((s) => s.pickupDate);
  return freeUnits(v, pickupDate)[0] || v.units[0];
}

export function useBookingCost() {
  const v = useSelectedVehicle();
  const { nights } = useSearchLabels();
  const driver = useAppStore((s) => s.driver);
  const addons = useAppStore((s) => s.addons);
  const accountType = useAppStore((s) => s.accountType);
  const payId = useAppStore((s) => s.payId);
  const catalogAddons = useCatalogStore((s) => s.addons);
  const isOrg = accountType === 'UN & INGO' || accountType === 'Business';
  const effectivePayId = payId || (isOrg ? 'invoice' : 'bankak');

  const extrasTotal = catalogAddons.reduce((a, x) => (addons[x.id] ? a + (x.unit === 'day' ? x.price * nights : x.price) : a), 0);
  const cost = computeBookingCost({ dailyRate: v.rate, nights, hasDriver: driver, extrasTotal, payMethodId: effectivePayId });
  return { ...cost, effectivePayId, isOrg, nights, vehicle: v };
}
