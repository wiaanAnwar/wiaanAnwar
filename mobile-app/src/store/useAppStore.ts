import { create } from 'zustand';
import { AppState, AccountInfo, PayId } from './types';
import { addDays, today } from '../utils/dates';
import { authService, ApiUser } from '../services/authService';
import { fleetService } from '../services/fleetService';
import { bookingService } from '../services/bookingService';
import { documentsService } from '../services/documentsService';
import { ApiError } from '../services/httpClient';
import { useCatalogStore } from './useCatalogStore';
import { BV_CONTACT } from '../data/account';

const T = today();

const GUEST_ACCOUNT: AccountInfo = {
  name: 'Guest',
  nameAr: 'زائر',
  contractRef: 'PAY AS YOU GO',
  contractRefAr: 'دفع مباشر',
  validUntil: null,
  sdgRate: BV_CONTACT.sdgRate,
};

function accountFromApiUser(user: ApiUser): AccountInfo {
  return {
    name: user.organization?.name ?? user.name,
    nameAr: user.organization?.nameAr ?? user.nameAr ?? user.name,
    contractRef: user.organization?.contractRef ?? 'PAY AS YOU GO',
    contractRefAr: user.organization?.contractRef ?? 'دفع مباشر',
    validUntil: user.organization?.validUntil ?? null,
    sdgRate: user.organization?.sdgRate ?? BV_CONTACT.sdgRate,
  };
}

let toastTimer: ReturnType<typeof setTimeout> | null = null;
let searchTimer: ReturnType<typeof setTimeout> | null = null;

interface AppActions {
  // auth
  setPhone: (v: string) => void;
  setCode: (v: string) => void;
  sendCode: () => void;
  verifyCode: () => void;
  backToPhone: () => void;
  guestMode: () => void;
  signOut: () => void;

  // chrome
  setTab: (tab: AppState['tab']) => void;
  toggleLang: () => void;
  setCurrency: (c: AppState['currency']) => void;
  setOffline: (v: boolean) => void;
  showToast: (msg: string) => void;

  // home
  dismissHero: () => void;
  openTrips: () => void;

  // search
  openSearch: () => void;
  closeSearch: () => void;
  pickCalendarDay: (day: Date) => void;
  setLocIdx: (i: number) => void;
  applySearch: () => void;
  runSearch: () => void;

  // fleet / detail
  setFleetFilter: (f: AppState['fleetFilter']) => void;
  openDetail: (id: string) => void;
  closeDetail: () => void;

  // booking
  startBooking: () => void;
  bookBack: () => void;
  bookNext: () => void;
  setDriver: (on: boolean) => void;
  toggleAddon: (id: string) => void;
  setOrgField: (key: 'org' | 'code2' | 'po', value: string) => void;
  setApproverIdx: (i: number) => void;
  setPayId: (id: PayId) => void;
  whatsappFallback: () => void;
  retrySubmit: () => void;

  // trips
  setTripTab: (t: AppState['tripTab']) => void;
  requestCancel: (ref: string) => void;
  dismissCancel: () => void;
  confirmCancel: () => void;
  amendTrip: (ref: string) => void;
  openDocuments: () => void;
  closeDocuments: () => void;

  // session bootstrap (called from App.tsx)
  restoreSession: () => Promise<void>;
}

export type AppStore = AppState & AppActions;

export const useAppStore = create<AppStore>((set, get) => ({
  authed: false,
  authStep: 'phone',
  phone: '',
  code: '',
  accountType: 'Individual',
  account: GUEST_ACCOUNT,

  lang: 'en',
  tab: 'home',
  offline: false,
  currency: 'USD',

  heroSeen: false,

  searchOpen: false,
  searching: false,
  searched: true,
  pickupDate: addDays(T, 4),
  returnDate: addDays(T, 11),
  locIdx: 0,
  pickPhase: 'start',

  fleetFilter: 'All',
  detailId: null,
  checkingAvailability: false,

  booking: false,
  step: 1,
  driver: true,
  addons: { meet: true, decor: false, child: false, fuel: false },
  org: '',
  code2: '',
  po: '',
  touched: false,
  approverIdx: 0,
  payId: null,
  submitting: false,
  submitFailed: false,
  newRef: null,

  tripTab: 'active',
  trips: [],
  documents: [],
  cancelTarget: null,
  documentsOpen: false,

  toast: null,

  // ── auth ──────────────────────────────────────────────
  setPhone: (v) => set({ phone: v }),
  setCode: (v) => set({ code: v.slice(0, 4) }),
  sendCode: () => {
    const { phone, lang, showToast } = get();
    if (!phone.trim()) {
      showToast(lang === 'ar' ? 'أدخل رقم هاتفك' : 'Enter your mobile number');
      return;
    }
    authService
      .sendCode(phone)
      .then(() => set({ authStep: 'code' }))
      .catch((e) => {
        const msg =
          e instanceof ApiError && e.code === 'validation_error'
            ? lang === 'ar'
              ? 'صيغة الرقم غير صحيحة (مثال: 0912301407)'
              : 'That number looks wrong — try 0912301407 style'
            : lang === 'ar'
            ? 'تعذّر إرسال الرمز، حاول مجدداً'
            : "Couldn't send the code — try again";
        showToast(msg);
      });
  },
  verifyCode: () => {
    const { code, phone, lang, showToast } = get();
    if (code.length < 4) {
      showToast(lang === 'ar' ? 'أدخل الرمز المكوّن من ٤ أرقام' : 'Enter the 4-digit code');
      return;
    }
    authService
      .verifyCode(phone, code)
      .then((result) => {
        if (!result.ok) {
          showToast(lang === 'ar' ? 'رمز غير صحيح' : 'Incorrect code');
          return;
        }
        applySession(set, result.user);
      })
      .catch(() => showToast(lang === 'ar' ? 'تعذّر التحقق، حاول مجدداً' : "Couldn't verify — try again"));
  },
  backToPhone: () => set({ authStep: 'phone', code: '' }),
  guestMode: () => {
    set({ authed: true, accountType: 'Individual', account: GUEST_ACCOUNT, trips: [], documents: [] });
    useCatalogStore.getState().loadPublicCatalog();
  },
  signOut: () => {
    authService.signOut();
    useCatalogStore.getState().resetPrivateCatalog();
    set({
      authed: false,
      authStep: 'phone',
      code: '',
      phone: '',
      tab: 'home',
      accountType: 'Individual',
      account: GUEST_ACCOUNT,
      trips: [],
      documents: [],
    });
  },

  restoreSession: async () => {
    useCatalogStore.getState().loadPublicCatalog();
    try {
      const user = await authService.me();
      applySession(set, user);
    } catch {
      // No stored token, or it's expired/invalid — land on the sign-in screen.
    }
  },

  // ── chrome ────────────────────────────────────────────
  setTab: (tab) => set({ tab, detailId: null, booking: false, searchOpen: false }),
  toggleLang: () => set((s) => ({ lang: s.lang === 'ar' ? 'en' : 'ar' })),
  setCurrency: (currency) => set({ currency }),
  setOffline: (offline) => set({ offline }),
  showToast: (msg) => {
    if (toastTimer) clearTimeout(toastTimer);
    set({ toast: msg });
    toastTimer = setTimeout(() => set({ toast: null }), 2800);
  },

  // ── home ──────────────────────────────────────────────
  dismissHero: () => set({ heroSeen: true }),
  openTrips: () => {
    const { lang, showToast } = get();
    set({ tab: 'trips', tripTab: 'active' });
    showToast(lang === 'ar' ? 'الموقع الحالي: شارع أفريقيا، ٦ كم' : 'Live position: Africa Road, 6 km away');
  },

  // ── search ────────────────────────────────────────────
  openSearch: () => set({ searchOpen: true, pickPhase: 'start' }),
  closeSearch: () => set({ searchOpen: false }),
  pickCalendarDay: (day) => {
    const s = get();
    if (s.pickPhase === 'start' || day.getTime() <= s.pickupDate.getTime()) {
      const nights = Math.max(1, Math.round((s.returnDate.getTime() - s.pickupDate.getTime()) / 86400000));
      const minEnd = addDays(day, 1);
      const preferredEnd = addDays(day, nights);
      set({ pickupDate: day, returnDate: preferredEnd.getTime() > minEnd.getTime() ? preferredEnd : minEnd, pickPhase: 'end' });
    } else {
      set({ returnDate: day, pickPhase: 'start' });
    }
  },
  setLocIdx: (locIdx) => set({ locIdx }),
  applySearch: () => {
    set({ searchOpen: false });
    const s = get();
    if (s.tab !== 'fleet' && !s.booking) s.runSearch();
  },
  runSearch: () => {
    set({ tab: 'fleet', searching: true, searched: false, searchOpen: false });
    if (searchTimer) clearTimeout(searchTimer);
    searchTimer = setTimeout(() => set({ searching: false, searched: true }), 750);
  },

  // ── fleet / detail ────────────────────────────────────
  setFleetFilter: (fleetFilter) => set({ fleetFilter }),
  openDetail: (detailId) => set({ detailId }),
  closeDetail: () => set({ detailId: null }),

  // ── booking ───────────────────────────────────────────
  startBooking: () => {
    const s = get();
    if (s.checkingAvailability || !s.detailId) return;
    const vehicleId = s.detailId;
    set({ checkingAvailability: true });
    fleetService
      .confirmAvailability(vehicleId, s.pickupDate)
      .then(({ available }) => {
        set({ checkingAvailability: false });
        if (!available) {
          get().showToast(get().lang === 'ar' ? 'سنبلغك عند التوفر' : "We'll notify you when it frees up");
          return;
        }
        // Re-check the sheet still points at the same vehicle in case the
        // user navigated away while the availability call was in flight.
        if (get().detailId === vehicleId) set({ booking: true, step: 1, touched: false });
      })
      .catch(() => {
        set({ checkingAvailability: false });
        get().showToast(get().lang === 'ar' ? 'تعذّر التحقق من التوفر' : "Couldn't confirm availability — try again");
      });
  },
  bookBack: () =>
    set((s) => (s.step === 1 || s.step === 6 ? { booking: false, step: 1 } : { step: s.step - 1 })),
  bookNext: () => {
    const s = get();
    if (s.submitting) return;
    if (s.step === 3) {
      const missing = (['org', 'code2'] as const).filter((k) => !String(s[k]).trim());
      if (missing.length) {
        set({ touched: true });
        return;
      }
    }
    if (s.step === 5) {
      submitBookingInternal(set, get);
      return;
    }
    if (s.step === 6) {
      set({ booking: false, step: 1, detailId: null, tab: 'trips', tripTab: 'upcoming' });
      return;
    }
    set({ step: s.step + 1 });
  },
  setDriver: (driver) => set({ driver }),
  toggleAddon: (id) => set((s) => ({ addons: { ...s.addons, [id]: !s.addons[id] } })),
  setOrgField: (key, value) => set({ [key]: value } as Pick<AppState, 'org' | 'code2' | 'po'>),
  setApproverIdx: (approverIdx) => set({ approverIdx }),
  setPayId: (payId) => set({ payId }),
  whatsappFallback: () => {
    const { lang, showToast } = get();
    set({ submitFailed: false });
    showToast(lang === 'ar' ? 'فتح واتساب مع مكتب BV' : 'Opening WhatsApp to BV dispatch');
  },
  retrySubmit: () => submitBookingInternal(set, get),

  // ── trips ─────────────────────────────────────────────
  setTripTab: (tripTab) => set({ tripTab }),
  requestCancel: (ref) => set({ cancelTarget: ref }),
  dismissCancel: () => set({ cancelTarget: null }),
  confirmCancel: () => {
    const { cancelTarget, lang, showToast } = get();
    if (!cancelTarget) return;
    bookingService
      .cancelTrip(cancelTarget)
      .then(() => {
        const s = get();
        set({
          trips: s.trips.map((tr) => (tr.ref === cancelTarget ? { ...tr, cancelled: true, group: 'past' as const } : tr)),
          cancelTarget: null,
          tripTab: 'past',
        });
        showToast(lang === 'ar' ? 'أُلغي الحجز' : 'Booking cancelled');
      })
      .catch(() => showToast(lang === 'ar' ? 'تعذّر الإلغاء، حاول مجدداً' : "Couldn't cancel — try again"));
  },
  amendTrip: (ref) => {
    const s = get();
    const tr = s.trips.find((t) => t.ref === ref);
    if (!tr) return;
    set({
      pickupDate: tr.from.getTime() > T.getTime() ? tr.from : s.pickupDate,
      returnDate: tr.to.getTime() > T.getTime() ? tr.to : s.returnDate,
      searchOpen: true,
    });
  },
  openDocuments: () => set({ documentsOpen: true }),
  closeDocuments: () => set({ documentsOpen: false }),
}));

function applySession(set: (partial: Partial<AppStore>) => void, user: ApiUser) {
  set({ authed: true, accountType: user.accountType, account: accountFromApiUser(user) });
  useCatalogStore.getState().loadPublicCatalog();
  useCatalogStore.getState().loadPrivateCatalog();
  bookingService
    .listTrips()
    .then((trips) => useAppStore.setState({ trips }))
    .catch(() => {});
  documentsService
    .listDocuments()
    .then((documents) => useAppStore.setState({ documents }))
    .catch(() => {});
}

function submitBookingInternal(
  set: (partial: Partial<AppStore> | ((s: AppStore) => Partial<AppStore>)) => void,
  get: () => AppStore
) {
  set({ submitting: true, submitFailed: false });
  const s = get();
  const catalog = useCatalogStore.getState();
  const vehicle = catalog.vehicles.find((x) => x.id === s.detailId) ?? catalog.vehicles[0];
  const addonIds = Object.keys(s.addons).filter((id) => s.addons[id]);
  const isOrg = s.accountType === 'UN & INGO' || s.accountType === 'Business';
  const approver = isOrg ? catalog.approvers[s.approverIdx] : undefined;
  const payId = s.payId || (isOrg ? 'invoice' : 'bankak');

  bookingService
    .submitBooking({
      vehicleId: vehicle.id,
      pickupDate: s.pickupDate,
      returnDate: s.returnDate,
      locationId: s.locIdx,
      driver: s.driver,
      addonIds,
      orgName: s.org || undefined,
      costCentre: s.code2 || undefined,
      poRef: s.po || undefined,
      payMethod: payId,
      approverId: approver?.id,
    })
    .then(({ trip }) => {
      set({ submitting: false, submitFailed: false, step: 6, newRef: trip.ref, trips: [trip, ...get().trips] });
      documentsService
        .listDocuments()
        .then((documents) => set({ documents }))
        .catch(() => {});
    })
    .catch((e) => {
      if (e instanceof ApiError && e.code === 'unavailable') {
        set({ submitting: false, submitFailed: false });
        get().showToast(get().lang === 'ar' ? 'حُجزت هذه السيارة للتو — جرّب أخرى' : 'That vehicle was just booked — try another');
        return;
      }
      set({ submitting: false, submitFailed: true });
    });
}
