import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { colors } from '../../theme/colors';
import { textStyle } from '../../theme/text';
import { useI18n } from '../../i18n/useI18n';
import { useAppStore } from '../../store/useAppStore';
import { useSearchLabels } from '../../utils/useSearchLabels';
import { useSelectedVehicle, useAssignedUnit } from '../../utils/useBookingCost';
import { MicroLabel } from '../../components/Labels';
import { OutlineButton } from '../../components/Buttons';
import VehiclePhoto from '../../components/VehiclePhoto';

export default function Step1Dates() {
  const { t, isArabic } = useI18n();
  const { startLabel, endLabel, locationLabel } = useSearchLabels();
  const openSearch = useAppStore((s) => s.openSearch);
  const v = useSelectedVehicle();
  const unit = useAssignedUnit();

  return (
    <View style={{ gap: 16 }}>
      <View style={{ backgroundColor: '#fff', borderWidth: 1, borderColor: colors.cardBorder, borderRadius: 10, padding: 15 }}>
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <View style={{ flex: 1 }}>
            <MicroLabel>{t.pickupDate}</MicroLabel>
            <Text style={[textStyle({ weight: 600, size: 15, color: colors.ink, isArabic }), { marginTop: 4 }]}>{startLabel}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <MicroLabel>{t.returnDate}</MicroLabel>
            <Text style={[textStyle({ weight: 600, size: 15, color: colors.ink, isArabic }), { marginTop: 4 }]}>{endLabel}</Text>
          </View>
        </View>
        <View style={{ height: 1, backgroundColor: colors.hairline, marginVertical: 13 }} />
        <MicroLabel>{t.location}</MicroLabel>
        <Text style={[textStyle({ weight: 400, size: 13, color: colors.ink, isArabic }), { marginTop: 4 }]}>{locationLabel}</Text>
        <OutlineButton label={t.changeDates} onPress={openSearch} style={{ width: '100%', marginTop: 13 }} />
      </View>
      <View style={{ backgroundColor: '#fff', borderWidth: 1, borderColor: colors.cardBorder, borderRadius: 10, padding: 15, flexDirection: 'row', gap: 12, alignItems: 'center' }}>
        <VehiclePhoto label={v.name.toUpperCase()} style={{ width: 76, height: 56, borderRadius: 7 }} />
        <View style={{ flex: 1, minWidth: 0 }}>
          <Text style={textStyle({ weight: 600, size: 15, color: colors.ink, isArabic, trackingPx: -0.3, lineHeight: 19 })}>{v.name}</Text>
          <Text style={[textStyle({ weight: 300, size: 11, color: colors.slate, isArabic }), { marginTop: 4 }]}>
            {v.seats + (isArabic ? ' مقاعد · ' : ' seats · ') + v.gear + ' · ' + (isArabic ? v.badgeAr : v.badge)}
          </Text>
          <Text style={[textStyle({ weight: 600, size: 11, color: colors.primary, isArabic }), { marginTop: 5 }]}>
            {(isArabic ? 'اللوحة المخصصة: ' : 'Assigned plate: ') + unit.plate}
          </Text>
        </View>
      </View>
    </View>
  );
}
