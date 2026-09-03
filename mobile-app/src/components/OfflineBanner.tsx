import React from 'react';
import { View, Text } from 'react-native';
import { colors } from '../theme/colors';
import { textStyle } from '../theme/text';
import { useI18n } from '../i18n/useI18n';

export default function OfflineBanner() {
  const { t, isArabic } = useI18n();
  return (
    <View style={{ backgroundColor: colors.red, paddingVertical: 9, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 9 }}>
      <View style={{ width: 6, height: 6, borderRadius: 100, backgroundColor: '#fff' }} />
      <Text style={[textStyle({ weight: 500, size: 11.5, color: '#fff', isArabic }), { flex: 1 }]}>{t.offline}</Text>
      <Text style={textStyle({ weight: 300, size: 10.5, color: 'rgba(255,255,255,.8)', isArabic })}>{t.offlineSub}</Text>
    </View>
  );
}
