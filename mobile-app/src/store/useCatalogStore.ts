import { create } from 'zustand';
import { Vehicle, VEHICLES } from '../data/vehicles';
import { Location, LOCS } from '../data/locations';
import { Addon, Approver, PayMethod, ADDONS, APPROVERS, PAY } from '../data/addons';
import { fleetService } from '../services/fleetService';
import { referenceService } from '../services/referenceService';

// Seeded with the bundled fallback data so the app is fully usable the
// instant it launches — offline, or before the first fetch resolves — then
// silently upgraded to live backend data when reachable. A failed fetch
// just leaves the bundled catalog in place; it never blocks or errors the
// screen that's reading it.
interface CatalogState {
  vehicles: Vehicle[];
  locations: Location[];
  addons: Addon[];
  approvers: Approver[];
  payMethods: PayMethod[];
  loadPublicCatalog: () => Promise<void>;
  loadPrivateCatalog: () => Promise<void>;
  resetPrivateCatalog: () => void;
}

export const useCatalogStore = create<CatalogState>((set) => ({
  vehicles: VEHICLES,
  locations: LOCS,
  addons: ADDONS,
  approvers: APPROVERS,
  payMethods: PAY,

  loadPublicCatalog: async () => {
    const [vehicles, locations, addons] = await Promise.allSettled([
      fleetService.getVehicles(),
      referenceService.getLocations(),
      referenceService.getAddons(),
    ]);
    set({
      ...(vehicles.status === 'fulfilled' && vehicles.value.length ? { vehicles: vehicles.value } : {}),
      ...(locations.status === 'fulfilled' && locations.value.length ? { locations: locations.value } : {}),
      ...(addons.status === 'fulfilled' && addons.value.length ? { addons: addons.value } : {}),
    });
  },

  loadPrivateCatalog: async () => {
    const [approvers, payMethods] = await Promise.allSettled([referenceService.getApprovers(), referenceService.getPayMethods()]);
    set({
      ...(approvers.status === 'fulfilled' && approvers.value.length ? { approvers: approvers.value } : {}),
      ...(payMethods.status === 'fulfilled' && payMethods.value.length ? { payMethods: payMethods.value } : {}),
    });
  },

  resetPrivateCatalog: () => set({ approvers: APPROVERS, payMethods: PAY }),
}));
