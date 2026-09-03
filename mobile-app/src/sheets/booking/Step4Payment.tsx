import React from 'react';
import { View, Text } from 'react-native';
import { colors } from '../../theme/colors';
import { textStyle } from '../../theme/text';
import { useI18n } from '../../i18n/useI18n';
import { useAppStore } from '../../store/useAppStore';
import { useCash } from '../../utils/useCash';
import { useBookingCost } from '../../utils/useBookingCost';
import { useCatalogStore } from '../../store/useCatalogStore';
import { Eyebrow } from '../../components/Labels';
import RadioRow from '../../components/RadioRow';

export default function Step4Payment() {
  const { t, isArabic } = useI18n();
  const cash = useCash();
  const setPayId = useAppStore((s) => s.setPayId);
  const PAY = useCatalogStore((s) => s.payMethods);
  const { deposit, effectivePayId, isOrg } = useBookingCost();
  const methods = PAY.filter((p) => !p.orgOnly || isOrg);

  return (
    <View style={{ gap: 18 }}>
      <View>
        <Eyebrow>{t.payment}</Eyebrow>
        <View style={{ backgroundColor: '#fff', borderWidth: 1, borderColor: colors.cardBorder, borderRadius: 10, overflow: 'hidden', marginTop: 10 }}>
          {methods.map((p, i) => (
            <RadioRow
              key={p.id}
              title={isArabic ? p.ar : p.en}
              sub={isArabic ? p.arSub : p.enSub}
              selected={p.id === effectivePayId}
              onPress={() => setPayId(p.id)}
              last={i === methods.length - 1}
            />
          ))}
        </View>
      </View>
      <View style={{ backgroundColor: '#fff', borderWidth: 1, borderColor: colors.cardBorder, borderRadius: 10, padding: 15 }}>
        <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
          <Text style={[textStyle({ weight: 500, size: 12.5, color: colors.ink, isArabic }), { flex: 1 }]}>{t.depositDue}</Text>
          <Text style={textStyle({ weight: 700, size: 16, color: colors.ink, isArabic, trackingPx: -0.4 })}>{deposit === 0 ? t.none : cash(deposit)}</Text>
        </View>
        <Text style={[textStyle({ weight: 300, size: 11, color: colors.slate, isArabic, lineHeight: 17 }), { marginTop: 8 }]}>
          {deposit === 0
            ? isArabic
              ? 'الحجوزات على الاتفاقية لا تتطلب عربوناً؛ تُفوتر بشروط ٣٠ يوماً.'
              : "Hires on your agreement need no deposit — invoiced on 30-day terms."
            : isArabic
            ? '٢٥٪ من الإجمالي عند الاستلام، ويُخصم من الفاتورة النهائية.'
            : '25% of the total at pickup, credited against the final invoice.'}
        </Text>
      </View>
    </View>
  );
}
