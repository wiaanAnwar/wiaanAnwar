import React from 'react';
import { View, Text } from 'react-native';
import { colors } from '../../theme/colors';
import { textStyle } from '../../theme/text';
import { useI18n } from '../../i18n/useI18n';
import { useAppStore } from '../../store/useAppStore';
import { useBookingCost } from '../../utils/useBookingCost';
import GradientRule from '../../components/GradientRule';

export default function Step6Done() {
  const { t, isArabic } = useI18n();
  const newRef = useAppStore((s) => s.newRef);
  const { isOrg } = useBookingCost();

  return (
    <View style={{ paddingTop: 30, alignItems: 'center' }}>
      <View style={{ width: 58, height: 58, borderRadius: 100, backgroundColor: colors.gold, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ fontSize: 24, color: colors.ink }}>✓</Text>
      </View>
      <Text style={[textStyle({ weight: 700, size: 22, color: colors.ink, isArabic, trackingPx: -0.5, lineHeight: 27 }), { marginTop: 20, textAlign: 'center' }]}>
        {isOrg ? t.sentForApproval : t.requestSent}
      </Text>
      <View style={{ marginTop: 12 }}>
        <GradientRule width={52} height={2} />
      </View>
      <Text style={[textStyle({ weight: 300, size: 12.5, color: colors.slate, isArabic, lineHeight: 20 }), { marginTop: 14, textAlign: 'center' }]}>
        {isOrg ? t.approvalBody : t.requestSentBody}
      </Text>
      <View style={{ backgroundColor: '#fff', borderWidth: 1, borderColor: colors.cardBorder, borderRadius: 8, paddingHorizontal: 18, paddingVertical: 13, marginTop: 20 }}>
        <Text style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 13, letterSpacing: 1, color: colors.ink }}>{newRef}</Text>
      </View>
      <Text style={[textStyle({ weight: 300, size: 10.5, color: colors.slate, isArabic }), { marginTop: 10 }]}>{t.refNumber}</Text>
    </View>
  );
}
