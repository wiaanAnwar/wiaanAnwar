import React from 'react';
import { Text, TextStyle } from 'react-native';
import { colors } from '../theme/colors';
import { textStyle } from '../theme/text';
import { useI18n } from '../i18n/useI18n';

// Default tone is a neutral ink kicker, not red — red stays available for the
// rare eyebrow that genuinely needs to read as urgent (none currently do).
export function Eyebrow({ children, tone = 'ink', style }: { children: React.ReactNode; tone?: 'ink' | 'red' | 'gold' | 'white'; style?: TextStyle }) {
  const { isArabic } = useI18n();
  const color = tone === 'red' ? colors.danger : tone === 'gold' ? colors.gold : tone === 'white' ? colors.white : colors.ink;
  return (
    <Text style={[textStyle({ weight: 600, size: 9.5, color, isArabic, trackingPx: 1.8, uppercase: true }), style]}>
      {children}
    </Text>
  );
}

export function MicroLabel({ children, dark = false, style }: { children: React.ReactNode; dark?: boolean; style?: TextStyle }) {
  const { isArabic } = useI18n();
  return (
    <Text
      style={[
        textStyle({ weight: 600, size: 8.5, color: dark ? colors.onDarkFaint : '#6E6E72', isArabic, trackingPx: 1.4, uppercase: true }),
        dark ? { marginBottom: 5 } : { width: 92, marginBottom: 4 },
        style,
      ]}
    >
      {children}
    </Text>
  );
}
