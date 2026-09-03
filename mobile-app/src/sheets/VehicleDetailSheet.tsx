import React from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import { textStyle } from '../theme/text';
import { useI18n } from '../i18n/useI18n';
import { useAppStore } from '../store/useAppStore';
import { useCash } from '../utils/useCash';
import { useSearchLabels } from '../utils/useSearchLabels';
import { AR_GEAR, AR_FUEL } from '../data/vehicles';
import { useCatalogStore } from '../store/useCatalogStore';
import { buildVehicleRow } from '../utils/vehicleRow';
import { PrimaryButton } from '../components/Buttons';
import VehiclePhoto from '../components/VehiclePhoto';
import GradientRule from '../components/GradientRule';

export default function VehicleDetailSheet() {
  const insets = useSafeAreaInsets();
  const { t, lang, isArabic } = useI18n();
  const cash = useCash();
  const { nights } = useSearchLabels();
  const detailId = useAppStore((s) => s.detailId);
  const pickupDate = useAppStore((s) => s.pickupDate);
  const closeDetail = useAppStore((s) => s.closeDetail);
  const startBooking = useAppStore((s) => s.startBooking);
  const checkingAvailability = useAppStore((s) => s.checkingAvailability);
  const accountType = useAppStore((s) => s.accountType);
  const chev = isArabic ? '›' : '‹';

  const vehicles = useCatalogStore((s) => s.vehicles);
  const v = vehicles.find((x) => x.id === detailId);
  if (!v) return null;
  const row = buildVehicleRow(v, { pickupDate, nights, lang, isArabic, t, cash });
  const isOrg = accountType === 'UN & INGO' || accountType === 'Business';

  const specs = [
    { k: isArabic ? 'المقاعد' : 'SEATS', val: String(v.seats) },
    { k: isArabic ? 'الحقائب' : 'BAGS', val: String(v.bags) },
    { k: isArabic ? 'ناقل الحركة' : 'GEARBOX', val: isArabic ? AR_GEAR[v.gear] : v.gear },
    { k: isArabic ? 'الوقود' : 'FUEL', val: isArabic ? AR_FUEL[v.fuel] : v.fuel },
  ];
  const policies = [
    { k: t.cancellation, val: isArabic ? 'مجاناً حتى ٢٤ ساعة قبل الاستلام' : 'Free until 24h before pickup' },
    { k: t.fuelPolicy, val: isArabic ? 'تسليم وإرجاع بخزان ممتلئ' : 'Full to full' },
    { k: t.mileage, val: isArabic ? 'غير محدودة' : 'Unlimited' },
    { k: t.depositPolicy, val: isOrg ? (isArabic ? 'لا يوجد — على الاتفاقية' : 'None — on account') : (isArabic ? '٢٥٪ عند الاستلام' : '25% at pickup') },
  ];
  const included = isArabic ? v.incAr : v.inc;

  return (
    <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: colors.sheetBg, zIndex: 18 }}>
      <ScrollView style={{ flex: 1 }}>
        <View>
          <VehiclePhoto label={v.name.toUpperCase()} dark style={{ height: 250, width: '100%' }} />
          <Pressable
            onPress={closeDetail}
            style={{ position: 'absolute', top: insets.top + 4, [isArabic ? 'right' : 'left']: 14, width: 44, height: 44, borderRadius: 100, backgroundColor: 'rgba(255,255,255,.92)', alignItems: 'center', justifyContent: 'center' }}
          >
            <Text style={{ fontSize: 15, color: colors.ink }}>{chev}</Text>
          </Pressable>
          <View style={{ position: 'absolute', top: insets.top + 4, [isArabic ? 'left' : 'right']: 14, backgroundColor: colors.gold, borderRadius: 100, paddingHorizontal: 12, paddingVertical: 7 }}>
            <Text style={textStyle({ weight: 600, size: 10, color: colors.ink, isArabic })}>{isArabic ? v.badgeAr : v.badge}</Text>
          </View>
        </View>

        <View style={{ padding: 16, paddingTop: 18, paddingBottom: 24 }}>
          <Text style={textStyle({ weight: 700, size: 23, color: colors.ink, isArabic, trackingPx: -0.8, lineHeight: 27 })}>{v.name}</Text>
          <Text style={[textStyle({ weight: 300, size: 12, color: colors.slate, isArabic }), { marginTop: 6 }]}>{row.specLine}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 10 }}>
            <View style={{ width: 6, height: 6, borderRadius: 100, backgroundColor: row.dotColor }} />
            <Text style={textStyle({ weight: 300, size: 10.5, color: row.availColor, isArabic })}>{row.availability}</Text>
          </View>
          <GradientRule width={48} height={2} />

          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 1, backgroundColor: colors.cardBorder2, borderWidth: 1, borderColor: colors.cardBorder2, borderRadius: 10, overflow: 'hidden', marginTop: 18 }}>
            {specs.map((s, i) => (
              <View key={i} style={{ width: '50%', backgroundColor: '#fff', padding: 13, paddingHorizontal: 14 }}>
                <Text style={[textStyle({ weight: 600, size: 8.5, color: '#6E6E72', isArabic, trackingPx: 1.4, uppercase: true }), { marginBottom: 4 }]}>{s.k}</Text>
                <Text style={textStyle({ weight: 500, size: 13, color: colors.ink, isArabic })}>{s.val}</Text>
              </View>
            ))}
          </View>

          <Text style={[textStyle({ weight: 600, size: 14, color: colors.ink, isArabic, trackingPx: -0.3 }), { marginTop: 20, marginBottom: 10 }]}>{t.included}</Text>
          <View style={{ backgroundColor: '#fff', borderWidth: 1, borderColor: colors.cardBorder, borderRadius: 10, overflow: 'hidden' }}>
            {included.map((inc, i) => (
              <View key={i} style={{ flexDirection: 'row', gap: 10, alignItems: 'center', padding: 12, paddingHorizontal: 14, borderBottomWidth: i === included.length - 1 ? 0 : 1, borderBottomColor: colors.hairline }}>
                <View style={{ width: 5, height: 5, backgroundColor: colors.primary, transform: [{ rotate: '45deg' }] }} />
                <Text style={[textStyle({ weight: 300, size: 12.5, color: '#3E3E42', isArabic }), { flex: 1 }]}>{inc}</Text>
              </View>
            ))}
          </View>

          <Text style={[textStyle({ weight: 600, size: 14, color: colors.ink, isArabic, trackingPx: -0.3 }), { marginTop: 20, marginBottom: 10 }]}>{t.policies}</Text>
          <View style={{ backgroundColor: '#fff', borderWidth: 1, borderColor: colors.cardBorder, borderRadius: 10, overflow: 'hidden' }}>
            {policies.map((p, i) => (
              <View key={i} style={{ flexDirection: 'row', gap: 12, padding: 12, paddingHorizontal: 14, alignItems: 'baseline', borderBottomWidth: i === policies.length - 1 ? 0 : 1, borderBottomColor: colors.hairline }}>
                <Text style={[textStyle({ weight: 600, size: 8.5, color: '#6E6E72', isArabic, trackingPx: 1.4, uppercase: true }), { width: 92 }]}>{p.k}</Text>
                <Text style={[textStyle({ weight: 300, size: 12, color: colors.ink, isArabic }), { flex: 1, textAlign: isArabic ? 'left' : 'right' }]}>{p.val}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={{ backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: colors.cardBorder, padding: 16, paddingBottom: insets.bottom + 20, flexDirection: 'row', gap: 12, alignItems: 'center' }}>
        <View>
          <Text style={[textStyle({ weight: 600, size: 8.5, color: '#6E6E72', isArabic, trackingPx: 1.4, uppercase: true })]}>{t.totalFor}</Text>
          <Text style={[textStyle({ weight: 700, size: 18, color: colors.ink, isArabic, trackingPx: -0.4 }), { marginTop: 3 }]}>{cash(v.rate * nights)}</Text>
        </View>
        <PrimaryButton label={row.out ? t.notifyMe : t.rentNow} onPress={startBooking} loading={checkingAvailability} style={{ flex: 1, minHeight: 50 }} />
      </View>
    </View>
  );
}
