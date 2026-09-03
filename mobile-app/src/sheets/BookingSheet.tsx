import React from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import { textStyle } from '../theme/text';
import { useI18n } from '../i18n/useI18n';
import { useAppStore } from '../store/useAppStore';
import { useSearchLabels } from '../utils/useSearchLabels';
import { useSelectedVehicle } from '../utils/useBookingCost';
import { PrimaryButton } from '../components/Buttons';
import Step1Dates from './booking/Step1Dates';
import Step2Driver from './booking/Step2Driver';
import Step3Billing from './booking/Step3Billing';
import Step4Payment from './booking/Step4Payment';
import Step5Review from './booking/Step5Review';
import Step6Done from './booking/Step6Done';

export default function BookingSheet() {
  const insets = useSafeAreaInsets();
  const { t, isArabic } = useI18n();
  const step = useAppStore((s) => s.step);
  const bookBack = useAppStore((s) => s.bookBack);
  const bookNext = useAppStore((s) => s.bookNext);
  const submitting = useAppStore((s) => s.submitting);
  const touched = useAppStore((s) => s.touched);
  const org = useAppStore((s) => s.org);
  const code2 = useAppStore((s) => s.code2);
  const accountType = useAppStore((s) => s.accountType);
  const { rangeLabel, locationLabel, nightsLine } = useSearchLabels();
  const v = useSelectedVehicle();
  const chev = isArabic ? '›' : '‹';

  const isOrg = accountType === 'UN & INGO' || accountType === 'Business';
  const missing = [!org.trim(), !code2.trim()].some(Boolean);
  const blocked = step === 3 && missing;

  const stepTitles = [
    isArabic ? 'التواريخ والموقع' : 'Dates and location',
    isArabic ? 'السائق والإضافات' : 'Driver and extras',
    isArabic ? 'جهة الفوترة' : 'Who we bill',
    isArabic ? 'الدفع' : 'Payment',
    isArabic ? 'مراجعة الحجز' : 'Review your booking',
    isArabic ? 'تم' : 'Confirmed',
  ];
  const stepCaps = [
    `${rangeLabel} · ${locationLabel}`,
    isArabic ? 'سائق BV أو قيادة ذاتية' : 'Chauffeur or self-drive, plus extras',
    isArabic ? 'البيانات التي تحتاجها BV للفاتورة' : 'Details BV needs to raise the invoice',
    isArabic ? 'كيف تريد الدفع' : 'How you want to settle this hire',
    isArabic ? 'راجع كل شيء قبل الإرسال' : 'Check everything before you send it',
    `${v.name} · ${nightsLine}`,
  ];

  const primaryLabel = submitting
    ? isArabic
      ? 'جارٍ الإرسال…'
      : 'Sending…'
    : step === 5
    ? isOrg
      ? t.sendForApproval
      : t.sendRequest
    : step === 6
    ? t.viewInTrips
    : t.continue;

  return (
    <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: colors.sheetBg, zIndex: 22 }}>
      <View style={{ backgroundColor: colors.black, paddingTop: insets.top + 10, paddingHorizontal: 16 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 11, paddingBottom: 12 }}>
          <Pressable onPress={bookBack} style={{ width: 44, height: 44, borderRadius: 100, borderWidth: 1, borderColor: 'rgba(255,255,255,.22)', alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ color: '#fff', fontSize: 15 }}>{chev}</Text>
          </Pressable>
          <View style={{ flex: 1 }}>
            <Text style={textStyle({ weight: 600, size: 14, color: '#fff', isArabic, trackingPx: -0.3 })}>{stepTitles[step - 1]}</Text>
            <Text numberOfLines={1} style={[textStyle({ weight: 300, size: 10.5, color: colors.onDarkSoft, isArabic }), { marginTop: 2 }]}>{stepCaps[step - 1]}</Text>
          </View>
          <Text style={textStyle({ weight: 500, size: 10, color: colors.gold, isArabic, trackingPx: 1 })}>
            {step < 6 ? (isArabic ? `${step}/٥` : `STEP ${step}/5`) : isArabic ? 'تم' : 'DONE'}
          </Text>
        </View>
        <View style={{ flexDirection: 'row', gap: 4, paddingBottom: 12 }}>
          {[1, 2, 3, 4, 5].map((n) => (
            <View key={n} style={{ flex: 1, height: 3, backgroundColor: n <= step ? (n === step ? colors.gold : '#fff') : 'rgba(255,255,255,.15)' }} />
          ))}
        </View>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, paddingTop: 18 }} keyboardShouldPersistTaps="handled">
        {step === 1 && <Step1Dates />}
        {step === 2 && <Step2Driver />}
        {step === 3 && <Step3Billing />}
        {step === 4 && <Step4Payment />}
        {step === 5 && <Step5Review />}
        {step === 6 && <Step6Done />}
      </ScrollView>

      <View style={{ backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: colors.cardBorder, padding: 16, paddingBottom: insets.bottom + 20 }}>
        <PrimaryButton label={primaryLabel} onPress={bookNext} loading={submitting} disabled={blocked && touched} />
        {blocked && touched && (
          <Text style={[textStyle({ weight: 400, size: 11, color: colors.danger, isArabic }), { textAlign: 'center', marginTop: 9 }]}>{t.required}</Text>
        )}
      </View>
    </View>
  );
}
