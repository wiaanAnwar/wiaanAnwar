// BV Bavarian Rent A Car brand palette.
//
// Role-based, not just a color list: `primary` is the workhorse for CTAs,
// selection and progress; `red` is reserved for genuine alerts, destructive
// actions and status that must read as urgent. The original prototype used
// red for both — a generic-CTA-vs-alert-hierarchy conflict flagged in the
// product review — so the split below is a deliberate correction, not a
// rebrand. Gold stays the premium accent; red+gold together remain BV's
// signature gradient rule for decorative dividers.
export const colors = {
  // brand
  black: '#0B0B0C',
  blackPanel: '#1A1A1C',
  primary: '#1A1A1C', // premium charcoal — default CTA / selection color
  gold: '#F5B301',
  goldTint: '#FFF3D6', // pale gold fill for date-range / selected-range backgrounds
  red: '#DD2A26', // reserved: alerts, destructive actions, unavailable status
  redDark: '#8C1815',

  // surfaces
  white: '#fff',
  sheetBg: '#F7F7F7',
  cardBorder: '#EAEAEA',
  cardBorder2: '#E6E6E6',
  chipBorder: '#E0E0E0',
  inputBorder: '#D8D8DA',
  dashedBorder: '#D6D6D6',
  hairline: '#F1F1F1',
  trackGrey: '#E4E4E4',
  dotBorder: '#DADADA',

  // text (light surfaces)
  ink: '#131315',
  slate: '#5E5E62',
  slateMid: '#6E6E72',
  slateLight: '#8A8A8E',

  // text (dark surfaces)
  onDarkMuted: '#8E8E93',
  onDarkFaint: '#9B9B9F',
  onDarkSoft: '#B4B4B8',
  onDarkSofter: '#A8A8AC',

  // status
  success: '#188A4E',
  danger: '#C41F1B',
  dangerDeep: '#B41E1A',
  dangerBg: '#FFF1F0',
  dangerBgBorder: '#F3C6C4',
  rangeBg: '#FDECEB',
  rangeText: '#B41E1A',
  coral: '#FF6B67',

  // skeleton
  skeleton1: '#E8E8E8',
  skeleton2: '#EFEFEF',
  skeleton3: '#E3E3E3',
  skeleton4: '#EDEDED',

  overlay: 'rgba(0,0,0,.55)',
} as const;

export type ColorKey = keyof typeof colors;
