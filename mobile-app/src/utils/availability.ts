import { Vehicle, VehicleUnit } from '../data/vehicles';
import { addDays, isBefore } from './dates';

/** Units of `vehicle` that are free for a hire starting on `pickup`. */
export function freeUnits(vehicle: Vehicle, pickup: Date): VehicleUnit[] {
  return vehicle.units.filter((u) => u.busyUntil === null || isBefore(u.busyUntil, pickup));
}

/**
 * Soonest date *any* unit of `vehicle` frees up, for the "next free" label.
 * Only meaningful when every unit is currently busy (freeUnits === []).
 */
export function nextFreeDate(vehicle: Vehicle): Date {
  const busyOnes = vehicle.units.map((u) => u.busyUntil).filter((d): d is Date => d !== null);
  if (busyOnes.length === 0) return new Date(); // shouldn't happen if truly all-booked
  const earliest = busyOnes.reduce((a, b) => (a.getTime() < b.getTime() ? a : b));
  return addDays(earliest, 1);
}
