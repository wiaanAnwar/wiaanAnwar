export type Lang = 'en' | 'ar';

export interface Strings {
  signIn: string; signInSub: string; phone: string; sendCode: string; enterCode: string; verify: string; guest: string; changeNumber: string;
  authFooter: string; callNow: string; premium: string; tagline: string; statCars: string; statSupport: string; statYears: string;
  findRide: string; pickupDate: string; returnDate: string; location: string; findVehicles: string;
  onHire: string; driver: string; returns: string; track: string; callDriver: string; callWord: string; waWord: string;
  ourServices: string; whatWeProvide: string;
  accountThisMonth: string; openRequests: string; committed: string; agreement: string; validUntil: string;
  change: string; perDay: string; noResults: string; noResultsSub: string;
  changeDates: string; viewFleet: string; available: string; lastOne: string; unavailable: string; nextFree: string;
  yourBookings: string; trips: string; tActive: string; tUpcoming: string; tPast: string;
  nothingHere: string; nothingHereSub: string;
  account: string; businessHours: string; satThu: string; friday: string; closed: string; signOut: string;
  whenWhere: string; whenWhereSub: string; apply: string;
  included: string; policies: string; cancellation: string; fuelPolicy: string; mileage: string; depositPolicy: string; totalFor: string;
  rentNow: string; notifyMe: string;
  whoDrives: string; chauffeur: string; selfDrive: string; addons: string; billTo: string;
  approver: string; approverSub: string;
  payment: string; depositDue: string; total: string; refNumber: string;
  subtotal: string; vat: string; chauffeurLine: string; extrasLine: string;
  sendRequest: string; sendForApproval: string; continue: string; viewInTrips: string;
  requestSent: string; sentForApproval: string;
  requestSentBody: string; approvalBody: string;
  offline: string; offlineSub: string;
  failed: string; failedSub: string; whatsappFallback: string; retry: string;
  cancelTitle: string; keepBooking: string; confirmCancel: string; cancelPolicy: string;
  amend: string; cancel: string; documents: string;
  stRequested: string; stApproved: string; stConfirmed: string; stOnHire: string; stClosed: string; stCancelled: string;
  stAwaitApproval: string; stAwaitBV: string;
  fullName: string; company: string; org: string; costCentre: string; projectCode: string;
  poRef: string; poRefOpt: string; mobile: string;
  required: string;
  weekdays: readonly string[];
  nav: readonly string[];
  acctTypes: readonly string[];
  months: readonly string[];
  currency: string; language: string; ratesAgreement: string; invoices: string;
  approvers: string; paymentMethods: string; notifications: string; followBv: string;
  day: string; days: string; categoriesFree: string;
  none: string;
}

export const STR: Record<Lang, Strings> = {
  en: {
    signIn: 'Sign in', signInSub: 'Book, track and manage your hires', phone: 'Mobile number', sendCode: 'Send code',
    enterCode: 'Verification code', verify: 'Verify and continue', guest: 'Continue as guest', changeNumber: 'Change number',
    authFooter: "By continuing you accept BV's rental terms and privacy policy.",
    callNow: 'Call Now', premium: 'PREMIUM CAR RENTAL', tagline: 'Suit all your needs & exceed every expectation.',
    statCars: 'PREMIUM CARS', statSupport: 'SUPPORT', statYears: 'YEARS',
    findRide: 'FIND YOUR RIDE', pickupDate: 'PICKUP', returnDate: 'RETURN', location: 'LOCATION', findVehicles: 'Find Vehicles',
    onHire: 'ON HIRE NOW', driver: 'DRIVER', returns: 'RETURNS', track: 'Track', callDriver: 'Call driver', callWord: 'Call', waWord: 'WhatsApp',
    ourServices: 'OUR SERVICES', whatWeProvide: 'What We Provide',
    accountThisMonth: 'YOUR ACCOUNT THIS MONTH', openRequests: 'Open requests', committed: 'Committed spend', agreement: 'Agreement', validUntil: 'Valid until',
    change: 'Change', perDay: '/day', noResults: 'Nothing free for those dates', noResultsSub: 'Try a shorter hire, a different category, or move the pickup date.',
    changeDates: 'Change dates', viewFleet: 'View Fleet ›', available: 'available', lastOne: 'Last one for these dates', unavailable: 'Booked out', nextFree: 'Next free',
    yourBookings: 'YOUR BOOKINGS', trips: 'Trips', tActive: 'Active', tUpcoming: 'Upcoming', tPast: 'Past',
    nothingHere: 'Nothing here yet', nothingHereSub: 'Requests you send will sit here while BV confirms the vehicle.',
    account: 'Account', businessHours: 'Business Hours', satThu: 'Saturday – Thursday', friday: 'Friday', closed: 'Closed', signOut: 'Sign out',
    whenWhere: 'When and where', whenWhereSub: 'Pick your dates, then the collection point', apply: 'Apply',
    included: 'Included', policies: 'Policies', cancellation: 'Cancellation', fuelPolicy: 'Fuel', mileage: 'Mileage', depositPolicy: 'Deposit', totalFor: 'TOTAL',
    rentNow: 'Rent Now', notifyMe: 'Notify me',
    whoDrives: 'WHO DRIVES', chauffeur: 'BV chauffeur', selfDrive: 'Self-drive', addons: 'EXTRAS', billTo: 'BILL THIS HIRE TO',
    approver: 'SEND TO APPROVER', approverSub: "Corporate and agency hires need internal sign-off before BV sees them.",
    payment: 'HOW YOU PAY', depositDue: 'Deposit due at pickup', total: 'Estimated total', refNumber: 'Reference number',
    subtotal: 'Subtotal', vat: 'VAT (17%)', chauffeurLine: 'Chauffeur', extrasLine: 'Extras',
    sendRequest: 'Send Booking Request', sendForApproval: 'Send for Approval', continue: 'Continue', viewInTrips: 'View in Trips',
    requestSent: 'Request sent', sentForApproval: 'Sent for approval',
    requestSentBody: "BV has your request and will confirm the vehicle and price within 2 working hours. You'll get a push and an email.",
    approvalBody: 'Your approver has been notified. Once they sign off, the request goes straight to BV dispatch.',
    offline: 'You are offline', offlineSub: 'Showing saved data',
    failed: "Couldn't reach BV", failedSub: "Your connection dropped. Nothing was lost — retry, or send this request over WhatsApp instead.",
    whatsappFallback: 'Send over WhatsApp', retry: 'Retry',
    cancelTitle: 'Cancel this booking?', keepBooking: 'Keep it', confirmCancel: 'Cancel booking',
    cancelPolicy: "Free until 24 hours before pickup. After that, one day's rate is charged.",
    amend: 'Amend', cancel: 'Cancel', documents: 'Documents',
    stRequested: 'Requested', stApproved: 'Approved', stConfirmed: 'Confirmed', stOnHire: 'On hire', stClosed: 'Closed', stCancelled: 'Cancelled',
    stAwaitApproval: 'Awaiting approval', stAwaitBV: 'Awaiting BV',
    fullName: 'FULL NAME', company: 'COMPANY NAME', org: 'ORGANISATION / AGENCY', costCentre: 'COST CENTRE', projectCode: 'PROJECT / WBS CODE',
    poRef: 'PO REFERENCE', poRefOpt: 'PO REFERENCE (OPTIONAL)', mobile: 'MOBILE NUMBER',
    required: 'Required before BV can take this booking.',
    weekdays: ['SA', 'SU', 'MO', 'TU', 'WE', 'TH', 'FR'],
    nav: ['HOME', 'FLEET', 'TRIPS', 'ACCOUNT'],
    acctTypes: ['UN & INGO', 'Business', 'Individual'],
    months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    currency: 'Currency', language: 'Language', ratesAgreement: 'Rates & agreement', invoices: 'Invoices & statements',
    approvers: 'Approvers', paymentMethods: 'Payment methods', notifications: 'Notifications', followBv: 'Follow BV',
    day: 'day', days: 'days', categoriesFree: 'categories free',
    none: 'None',
  },
  ar: {
    signIn: 'تسجيل الدخول', signInSub: 'احجز وتابع وأدر إيجاراتك', phone: 'رقم الهاتف', sendCode: 'إرسال الرمز',
    enterCode: 'رمز التحقق', verify: 'تحقق ومتابعة', guest: 'المتابعة كزائر', changeNumber: 'تغيير الرقم',
    authFooter: 'بالمتابعة فإنك توافق على شروط الإيجار وسياسة الخصوصية.',
    callNow: 'اتصل', premium: 'تأجير سيارات فاخرة', tagline: 'نلبي كل احتياجاتك ونتجاوز توقعاتك.',
    statCars: 'سيارة فاخرة', statSupport: 'دعم', statYears: 'سنوات',
    findRide: 'ابحث عن سيارتك', pickupDate: 'الاستلام', returnDate: 'الإرجاع', location: 'الموقع', findVehicles: 'ابحث عن السيارات',
    onHire: 'قيد الإيجار الآن', driver: 'السائق', returns: 'الإرجاع', track: 'تتبع', callDriver: 'اتصل بالسائق', callWord: 'اتصال', waWord: 'واتساب',
    ourServices: 'خدماتنا', whatWeProvide: 'ما نقدمه',
    accountThisMonth: 'حسابك هذا الشهر', openRequests: 'طلبات مفتوحة', committed: 'الإنفاق الملتزم', agreement: 'الاتفاقية', validUntil: 'سارية حتى',
    change: 'تغيير', perDay: '/يوم', noResults: 'لا توجد سيارات في هذه التواريخ', noResultsSub: 'جرّب مدة أقصر أو فئة أخرى أو غيّر تاريخ الاستلام.',
    changeDates: 'تغيير التواريخ', viewFleet: 'عرض الأسطول', available: 'متاحة', lastOne: 'الأخيرة في هذه التواريخ', unavailable: 'محجوزة بالكامل', nextFree: 'أقرب توفر',
    yourBookings: 'حجوزاتك', trips: 'الرحلات', tActive: 'جارية', tUpcoming: 'قادمة', tPast: 'سابقة',
    nothingHere: 'لا يوجد شيء بعد', nothingHereSub: 'ستظهر طلباتك هنا ريثما تؤكد BV السيارة.',
    account: 'الحساب', businessHours: 'ساعات العمل', satThu: 'السبت – الخميس', friday: 'الجمعة', closed: 'مغلق', signOut: 'تسجيل الخروج',
    whenWhere: 'متى وأين', whenWhereSub: 'اختر التواريخ ثم نقطة الاستلام', apply: 'تطبيق',
    included: 'يشمل', policies: 'السياسات', cancellation: 'الإلغاء', fuelPolicy: 'الوقود', mileage: 'المسافة', depositPolicy: 'العربون', totalFor: 'الإجمالي',
    rentNow: 'احجز الآن', notifyMe: 'أبلغني عند التوفر',
    whoDrives: 'من يقود', chauffeur: 'سائق BV', selfDrive: 'قيادة ذاتية', addons: 'إضافات', billTo: 'الفوترة على',
    approver: 'إرسال للاعتماد', approverSub: 'حجوزات الشركات والمنظمات تحتاج اعتماداً داخلياً قبل وصولها إلى BV.',
    payment: 'طريقة الدفع', depositDue: 'العربون عند الاستلام', total: 'الإجمالي التقديري', refNumber: 'الرقم المرجعي',
    subtotal: 'المجموع الفرعي', vat: 'ضريبة القيمة المضافة (١٧٪)', chauffeurLine: 'السائق', extrasLine: 'الإضافات',
    sendRequest: 'إرسال طلب الحجز', sendForApproval: 'إرسال للاعتماد', continue: 'متابعة', viewInTrips: 'عرض في الرحلات',
    requestSent: 'تم إرسال الطلب', sentForApproval: 'أُرسل للاعتماد',
    requestSentBody: 'وصل طلبك إلى BV وسيتم تأكيد السيارة والسعر خلال ساعتي عمل. ستصلك رسالة وبريد إلكتروني.',
    approvalBody: 'تم إشعار المعتمِد. بمجرد الموافقة يصل الطلب مباشرة إلى قسم الحركة في BV.',
    offline: 'أنت غير متصل', offlineSub: 'عرض البيانات المحفوظة',
    failed: 'تعذّر الوصول إلى BV', failedSub: 'انقطع الاتصال ولم يضع شيء. أعد المحاولة أو أرسل الطلب عبر واتساب.',
    whatsappFallback: 'الإرسال عبر واتساب', retry: 'إعادة المحاولة',
    cancelTitle: 'إلغاء هذا الحجز؟', keepBooking: 'الاحتفاظ به', confirmCancel: 'إلغاء الحجز',
    cancelPolicy: 'مجاناً حتى ٢٤ ساعة قبل الاستلام، وبعدها تُحتسب أجرة يوم واحد.',
    amend: 'تعديل', cancel: 'إلغاء', documents: 'المستندات',
    stRequested: 'مطلوب', stApproved: 'معتمد', stConfirmed: 'مؤكد', stOnHire: 'قيد الإيجار', stClosed: 'منتهٍ', stCancelled: 'ملغى',
    stAwaitApproval: 'بانتظار الاعتماد', stAwaitBV: 'بانتظار BV',
    fullName: 'الاسم الكامل', company: 'اسم الشركة', org: 'المنظمة / الوكالة', costCentre: 'مركز التكلفة', projectCode: 'رمز المشروع',
    poRef: 'رقم أمر الشراء', poRefOpt: 'رقم أمر الشراء (اختياري)', mobile: 'رقم الهاتف',
    required: 'مطلوب قبل أن تتمكن BV من قبول الحجز.',
    weekdays: ['سب', 'أح', 'إث', 'ثل', 'أر', 'خم', 'جم'],
    nav: ['الرئيسية', 'الأسطول', 'الرحلات', 'الحساب'],
    acctTypes: ['أمم ومنظمات', 'شركات', 'أفراد'],
    months: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'],
    currency: 'العملة', language: 'اللغة', ratesAgreement: 'الأسعار والاتفاقية', invoices: 'الفواتير والكشوفات',
    approvers: 'المعتمِدون', paymentMethods: 'طرق الدفع', notifications: 'الإشعارات', followBv: 'تابعنا',
    day: 'يوم', days: 'أيام', categoriesFree: 'فئة متاحة',
    none: 'لا شيء',
  },
};
