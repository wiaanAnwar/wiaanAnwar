import { TextStyle } from 'react-native';
import { fontFamily, tracking, Weight } from './typography';

export function textStyle(opts: {
  weight: Weight;
  size: number;
  color: string;
  isArabic: boolean;
  trackingPx?: number;
  lineHeight?: number;
  uppercase?: boolean;
}): TextStyle {
  const s: TextStyle = {
    fontFamily: fontFamily(opts.weight, opts.isArabic),
    fontSize: opts.size,
    color: opts.color,
  };
  if (opts.trackingPx !== undefined) s.letterSpacing = tracking(opts.trackingPx, opts.isArabic);
  if (opts.lineHeight !== undefined) s.lineHeight = opts.lineHeight;
  if (opts.uppercase && !opts.isArabic) s.textTransform = 'uppercase';
  return s;
}
