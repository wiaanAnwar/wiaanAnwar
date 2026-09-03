import { AccountType } from '../data/account';
import { Category } from '../data/vehicles';
import { Currency } from '../utils/pricing';
import { Trip, TripGroup } from '../data/trips';
import { DocumentRecord } from '../data/documents';
import { Lang } from '../i18n/strings';

export type AuthStep = 'phone' | 'code';
export type Tab = 'home' | 'fleet' | 'trips' | 'account';
export type FleetFilter = 'All' | Category;
export type PickPhase = 'start' | 'end';
export type PayId = 'invoice' | 'bankak' | 'mbok' | 'cash';

/** Real identity fetched from the backend at sign-in — replaces the old hardcoded ACCOUNT_PROFILES lookup. */
export interface AccountInfo {
  name: string;
  nameAr: string;
  contractRef: string;
  contractRefAr: string;
  validUntil: string | null;
  sdgRate: number;
}

export interface AppState {
  // auth
  authed: boolean;
  authStep: AuthStep;
  phone: string;
  code: string;
  accountType: AccountType;
  account: AccountInfo;

  // chrome
  lang: Lang;
  tab: Tab;
  offline: boolean;
  currency: Currency;

  // home
  heroSeen: boolean;

  // search
  searchOpen: boolean;
  searching: boolean;
  searched: boolean;
  pickupDate: Date;
  returnDate: Date;
  locIdx: number;
  pickPhase: PickPhase;

  // fleet
  fleetFilter: FleetFilter;
  detailId: string | null;
  checkingAvailability: boolean;

  // booking
  booking: boolean;
  step: number; // 1..6
  driver: boolean;
  addons: Record<string, boolean>;
  org: string;
  code2: string;
  po: string;
  touched: boolean;
  approverIdx: number;
  payId: PayId | null;
  submitting: boolean;
  submitFailed: boolean;
  newRef: string | null;

  // trips / documents
  tripTab: TripGroup;
  trips: Trip[];
  documents: DocumentRecord[];
  cancelTarget: string | null;
  documentsOpen: boolean;

  // ephemera
  toast: string | null;
}
