import { apiRequest } from './httpClient';
import { Vehicle } from '../data/vehicles';

export interface AvailabilityResult {
  available: boolean;
  freeCount: number;
  nextFree: string | null;
}

interface ApiVehicle {
  id: string;
  name: string;
  category: string;
  badge: string;
  badgeAr: string;
  seats: number;
  bags: number;
  gear: string;
  fuel: string;
  dailyRateUsd: number;
  included: string[];
  includedAr: string[];
  units: { id: string; plate: string; busyUntil: string | null }[];
}

function toVehicle(v: ApiVehicle): Vehicle {
  return {
    id: v.id,
    name: v.name,
    cat: v.category as Vehicle['cat'],
    badge: v.badge,
    badgeAr: v.badgeAr,
    seats: v.seats,
    bags: v.bags,
    gear: v.gear as Vehicle['gear'],
    fuel: v.fuel as Vehicle['fuel'],
    rate: v.dailyRateUsd,
    units: v.units.map((u) => ({ plate: u.plate, busyUntil: u.busyUntil ? new Date(u.busyUntil) : null })),
    inc: v.included,
    incAr: v.includedAr,
  };
}

export const fleetService = {
  /** Full catalog — call once and cache; not per-render. */
  async getVehicles(): Promise<Vehicle[]> {
    const { vehicles } = await apiRequest<{ vehicles: ApiVehicle[] }>('/fleet', { auth: false });
    return vehicles.map(toVehicle);
  },

  /**
   * Authoritative availability check for one vehicle on one date — called
   * at the moment a booking is started. Never trust the fleet list's dot
   * by the time the user taps it; time has passed and the DB may have
   * changed.
   */
  async confirmAvailability(vehicleId: string, pickupDate: Date): Promise<AvailabilityResult> {
    return apiRequest(`/fleet/${vehicleId}/availability?pickupDate=${encodeURIComponent(pickupDate.toISOString())}`, { auth: false });
  },
};
