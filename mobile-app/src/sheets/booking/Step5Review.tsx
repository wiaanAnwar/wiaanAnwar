import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { colors } from '../../theme/colors';
import { textStyle } from '../../theme/text';
import { useI18n } from '../../i18n/useI18n';
import { useAppStore } from '../../store/useAppStore';
import { useCash } from '../../utils/useCash';
import { useSearchLabels } from '../../utils/useSearchLabels';
import { useAssignedUnit, useBookingCost } from '../../utils/useBookingCost';
import { useCatalogStore } from '../../store/useCatalogStore';
import VehiclePhoto from '../../components/VehiclePhoto';

export default function Step5Review() {
  const { t, isArabic } = useI18n();
  const cash = useCash();
  const { startLabel, endLabel, locationLabel, nightsLine } = useSearchLabels();
  const driver = useAppStore((s) => s.driver);
  const addons = useAppStore((s) => s.addons);
  const org = useAppStore((s) => s.org);
  const code2 = useAppStore((s) => s.code2);
  const approverIdx = useAppStore((s) => s.approverIdx);
  const account = useAppStore((s) => s.account);
  const submitFailed = useAppStore((s) => s.submitFailed);
  const whatsappFallback = useAppStore((s) => s.whatsappFallback);
  const ADDONS = useCatalogStore((s) => s.addons);
  const APPROVERS = useCatalogStore((s) => s.approvers);
  const PAY = useCatalogStore((s) => s.payMethods);
  const unit = useAssignedUnit();
  const { base, driverFee, extras, vat, total, deposit, vehicle, effectivePayId, isOrg } = useBookingCost();

  const payMethod = PAY.find((p) => p.id === effectivePayId) || PAY[1];
  const chosenAddons = ADDONS.filter((a) => addons[a.id]).map((a) => (isArabic ? a.ar : a.en)).join(', ') || t.none;

  const reviewRows = [
    { k: t.pickupDate, v: `${startLabel} · ${locationLabel}` },
    { k: t.returnDate, v: `${endLabel} · ${nightsLine}` },
    { k: t.driver, v: (driver ? t.chauffeur : t.selfDrive) + ' · ' + unit.plate },
    { k: t.addons, v: chosenAddons },
    { k: t.billTo, v: (org || (isArabic ? account.nameAr : account.name)) + (code2 ? ' · ' + code2 : '') },
    { k: t.payment, v: isArabic ? payMethod.ar : payMethod.en },
    ...(isOrg && APPROVERS[approverIdx] ? [{ k: t.approver, v: isArabic ? APPROVERS[approverIdx].ar : APPROVERS[approverIdx].en }] : []),
  ];

  const costRows = [
    { k: `${vehicle.name} × ${nightsLine}`, v: cash(base) },
    { k: driver ? `${t.chauffeurLine} × ${nightsLine}` : t.selfDrive, v: cash(driverFee) },
    { k: t.extrasLine, v: cash(extras) },
    { k: t.vat, v: cash(vat) },
  ];

  return (
    <View style={{ gap: 13 }}>
      <View style={{ backgroundColor: '#fff', borderWidth: 1, borderColor: colors.cardBorder, borderRadius: 10, padding: 14, flexDirection: 'row', gap: 12, alignItems: 'center' }}>
        <VehiclePhoto label={vehicle.name.toUpperCase()} style={{ width: 76, height: 56, borderRadius: 7 }} />
        <View>
          <Text style={textStyle({ weight: 600, size: 15, color: colors.ink, isArabic, trackingPx: -0.3, lineHeight: 19 })}>{vehicle.name}</Text>
          <Text style={[textStyle({ weight: 300, size: 11, color: colors.slate, isArabic }), { marginTop: 4 }]}>
            {vehicle.seats + (isArabic ? ' مقاعد · ' : ' seats · ') + vehicle.gear + ' · ' + (isArabic ? vehicle.badgeAr : vehicle.badge)}
          </Text>
        </View>
      </View>

      <View style={{ backgroundColor: '#fff', borderWidth: 1, borderColor: colors.cardBorder, borderRadius: 10, overflow: 'hidden' }}>
        {reviewRows.map((r, i) => (
          <View key={i} style={{ flexDirection: 'row', gap: 12, padding: 12, paddingHorizontal: 15, alignItems: 'baseline', borderBottomWidth: i === reviewRows.length - 1 ? 0 : 1, borderBottomColor: colors.hairline }}>
            <Text style={[textStyle({ weight: 600, size: 8.5, color: '#6E6E72', isArabic, trackingPx: 1.4, uppercase: true }), { width: 92 }]}>{r.k}</Text>
            <Text style={[textStyle({ weight: 300, size: 12, color: colors.ink, isArabic }), { flex: 1, textAlign: isArabic ? 'left' : 'right' }]}>{r.v}</Text>
          </View>
        ))}
      </View>

      <View style={{ backgroundColor: colors.black, borderRadius: 10, padding: 16 }}>
        {costRows.map((c, i) => (
          <View key={i} style={{ flexDirection: 'row', marginBottom: 9 }}>
            <Text style={[textStyle({ weight: 300, size: 12, color: colors.onDarkSoft, isArabic }), { flex: 1 }]}>{c.k}</Text>
            <Text style={textStyle({ weight: 400, size: 12, color: '#fff', isArabic })}>{c.v}</Text>
          </View>
        ))}
        <View style={{ height: 1, backgroundColor: 'rgba(255,255,255,.12)', marginVertical: 12 }} />
        <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
          <Text style={[textStyle({ weight: 600, size: 13, color: '#fff', isArabic }), { flex: 1 }]}>{t.total}</Text>
          <Text style={textStyle({ weight: 700, size: 21, color: colors.gold, isArabic, trackingPx: -0.5 })}>{cash(total)}</Text>
        </View>
        <Text style={[textStyle({ weight: 300, size: 10.5, color: colors.onDarkSoft, isArabic, lineHeight: 16 }), { marginTop: 9 }]}>
          {deposit === 0
            ? isArabic
              ? 'يشمل الضريبة. لا يشمل الوقود. تؤكد BV خلال ساعتي عمل.'
              : 'Includes VAT, excludes fuel. BV confirms within 2 working hours.'
            : (isArabic ? 'يشمل الضريبة. العربون ' : 'Includes VAT. Deposit of ') + cash(deposit) + (isArabic ? ' عند الاستلام.' : ' due at pickup.')}
        </Text>
      </View>

      {submitFailed && (
        <View style={{ backgroundColor: colors.dangerBg, borderWidth: 1, borderColor: colors.dangerBgBorder, borderRadius: 10, padding: 14 }}>
          <Text style={textStyle({ weight: 600, size: 12.5, color: colors.dangerDeep, isArabic })}>{t.failed}</Text>
          <Text style={[textStyle({ weight: 300, size: 11.5, color: '#8C2521', isArabic, lineHeight: 17 }), { marginTop: 5 }]}>{t.failedSub}</Text>
          <Pressable onPress={whatsappFallback} style={{ width: '100%', marginTop: 12, minHeight: 44, borderRadius: 7, backgroundColor: colors.success, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={textStyle({ weight: 600, size: 12.5, color: '#fff', isArabic })}>{t.whatsappFallback}</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}
