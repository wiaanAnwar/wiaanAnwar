import { VehicleUnit } from '@prisma/client';

/** Units genuinely free for a hire starting on `pickup`. */
export function freeUnits(units: VehicleUnit[], pickup: Date): VehicleUnit[] {
  return units.filter((u) => u.busyUntil === null || u.busyUntil.getTime() < pickup.getTime());
}

/** Soonest date any unit frees up — only meaningful when every unit is currently busy. */
export function nextFreeDate(units: VehicleUnit[]): Date {
  const busyOnes = units.map((u) => u.busyUntil).filter((d): d is Date => d !== null);
  if (busyOnes.length === 0) return new Date();
  const earliest = busyOnes.reduce((a, b) => (a.getTime() < b.getTime() ? a : b));
  const next = new Date(earliest);
  next.setDate(next.getDate() + 1);
  return next;
}
