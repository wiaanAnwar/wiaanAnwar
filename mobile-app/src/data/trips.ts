import { addDays, today } from '../utils/dates';

export const STAGES = ['requested', 'approved', 'confirmed', 'onhire', 'closed'] as const;
export type Stage = 0 | 1 | 2 | 3 | 4;
export type TripGroup = 'active' | 'upcoming' | 'past';

export interface Trip {
  ref: string;
  stage: Stage;
  vehicle: string;
  plate: string;
  from: Date;
  to: Date;
  locIdx: number;
  driverName: string | null;
  group: TripGroup;
  needsApproval?: boolean;
  cancelled?: boolean;
}

const T = today();

export const SEED_TRIPS: Trip[] = [
  { ref: 'BV-26-0418', stage: 3, vehicle: 'Toyota Land Cruiser Prado', plate: 'KRT 4471', from: addDays(T, -1), to: addDays(T, 6), locIdx: 0, driverName: 'Osman Bashir', group: 'active' },
  { ref: 'BV-26-0431', stage: 0, vehicle: 'Toyota Hiace', plate: '—', from: addDays(T, 14), to: addDays(T, 18), locIdx: 1, driverName: null, group: 'upcoming' },
  { ref: 'BV-26-0402', stage: 2, vehicle: 'Toyota Hilux', plate: 'KRT 8902', from: addDays(T, 23), to: addDays(T, 34), locIdx: 0, driverName: null, group: 'upcoming' },
  { ref: 'BV-26-0377', stage: 4, vehicle: 'Toyota Land Cruiser V8', plate: 'KRT 3577', from: addDays(T, -26), to: addDays(T, -11), locIdx: 0, driverName: 'Yousif Ali', group: 'past' },
];
