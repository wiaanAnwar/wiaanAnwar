import { apiRequest } from './httpClient';
import { Trip, TripGroup, Stage } from '../data/trips';

export interface BookingPayload {
  vehicleId: string;
  pickupDate: Date;
  returnDate: Date;
  locationId: number;
  driver: boolean;
  addonIds: string[];
  orgName?: string;
  costCentre?: string;
  poRef?: string;
  payMethod: 'invoice' | 'bankak' | 'mbok' | 'cash';
  approverId?: string;
}

interface ApiBooking {
  ref: string;
  stage: number;
  cancelled: boolean;
  needsApproval: boolean;
  vehicle: string;
  plate: string;
  driver: boolean;
  driverName: string | null;
  pickupDate: string;
  returnDate: string;
  locationId: number;
  costTotalUsd: number;
  depositUsd: number;
}

function tripGroup(b: ApiBooking): TripGroup {
  if (b.cancelled) return 'past';
  const now = Date.now();
  if (b.stage >= 4 || new Date(b.returnDate).getTime() < now) return 'past';
  if (new Date(b.pickupDate).getTime() <= now && b.stage < 4) return 'active';
  return 'upcoming';
}

function toTrip(b: ApiBooking): Trip {
  return {
    ref: b.ref,
    stage: b.stage as Stage,
    vehicle: b.vehicle,
    plate: b.plate,
    from: new Date(b.pickupDate),
    to: new Date(b.returnDate),
    locIdx: b.locationId - 1, // backend locations are 1-indexed
    driverName: b.driverName,
    group: tripGroup(b),
    needsApproval: b.needsApproval,
    cancelled: b.cancelled,
  };
}

export const bookingService = {
  // Throws NetworkError (unreachable) or ApiError (reached but rejected —
  // e.g. code 'unavailable' when the availability race is lost between
  // browse and submit). Callers must distinguish the two: one means retry
  // is reasonable, the other means show different vehicles.
  async submitBooking(payload: BookingPayload): Promise<{ trip: Trip }> {
    const { booking } = await apiRequest<{ booking: ApiBooking }>('/bookings', {
      method: 'POST',
      body: {
        vehicleId: payload.vehicleId,
        pickupDate: payload.pickupDate.toISOString(),
        returnDate: payload.returnDate.toISOString(),
        locationId: payload.locationId + 1, // mobile LOCS is 0-indexed
        driver: payload.driver,
        addonIds: payload.addonIds,
        orgName: payload.orgName,
        costCentre: payload.costCentre,
        poRef: payload.poRef,
        payMethod: payload.payMethod,
        approverId: payload.approverId,
      },
    });
    return { trip: toTrip(booking) };
  },

  async listTrips(): Promise<Trip[]> {
    const { bookings } = await apiRequest<{ bookings: ApiBooking[] }>('/bookings');
    return bookings.map(toTrip);
  },

  async cancelTrip(ref: string): Promise<void> {
    await apiRequest(`/bookings/${ref}/cancel`, { method: 'POST' });
  },
};
