import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { colors } from '../theme/colors';
import { textStyle } from '../theme/text';
import { useI18n } from '../i18n/useI18n';
import { useAppStore } from '../store/useAppStore';
import { Trip } from '../data/trips';
import { useCatalogStore } from '../store/useCatalogStore';
import { BV_CONTACT } from '../data/account';
import { dateLabel } from '../utils/dates';
import { badgeColors, driverInitials, statusFor, tripSteps } from '../utils/tripStatus';

export default function TripCard({ trip }: { trip: Trip }) {
  const { t, lang, isArabic } = useI18n();
  const showToast = useAppStore((s) => s.showToast);
  const amendTrip = useAppStore((s) => s.amendTrip);
  const requestCancel = useAppStore((s) => s.requestCancel);
  const openDocuments = useAppStore((s) => s.openDocuments);
  const locations = useCatalogStore((s) => s.locations);

  const badge = badgeColors(trip);
  const steps = tripSteps(trip, t);
  const loc = locations[trip.locIdx] ?? locations[0];
  const canAct = trip.stage < 4 && !trip.cancelled;

  return (
    <View style={{ backgroundColor: '#fff', borderWidth: 1, borderColor: colors.cardBorder, borderRadius: 10, padding: 15 }}>
      <View style={{ flexDirection: isArabic ? 'row-reverse' : 'row', alignItems: 'center', gap: 8, marginBottom: 11 }}>
        <Text style={{ fontSize: 9.5, fontWeight: '600', color: badge.fg, backgroundColor: badge.bg, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 100, letterSpacing: isArabic ? 0 : 0.8, textTransform: isArabic ? 'none' : 'uppercase' }}>
          {statusFor(trip, t)}
        </Text>
        <View style={{ flex: 1 }} />
        <Text style={textStyle({ weight: 400, size: 10.5, color: colors.slate, isArabic: false })}>{trip.ref}</Text>
      </View>
      <Text style={textStyle({ weight: 600, size: 16, color: colors.ink, isArabic, trackingPx: -0.3, lineHeight: 20 })}>{trip.vehicle}</Text>
      <Text style={[textStyle({ weight: 300, size: 11.5, color: colors.slate, isArabic }), { marginTop: 5 }]}>
        {dateLabel(trip.from, lang)} → {dateLabel(trip.to, lang)} · {isArabic ? loc.ar : loc.en}
      </Text>

      <View style={{ flexDirection: 'row', marginTop: 14, marginBottom: 4 }}>
        {steps.map((s, i) => (
          <View key={i} style={{ flex: 1, alignItems: 'center', gap: 7 }}>
            <View style={{ position: 'relative', width: '100%', height: 12, alignItems: 'center', justifyContent: 'center' }}>
              {i < steps.length - 1 && (
                <View
                  style={{
                    position: 'absolute',
                    top: 5,
                    height: 2,
                    width: '100%',
                    [isArabic ? 'right' : 'left']: '50%',
                    backgroundColor: s.connectorDone ? colors.primary : colors.trackGrey,
                  }}
                />
              )}
              <View
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: 100,
                  backgroundColor: s.current ? colors.gold : s.done ? colors.primary : '#fff',
                  borderWidth: 2,
                  borderColor: s.done ? (s.current ? colors.gold : colors.primary) : colors.dotBorder,
                }}
              />
            </View>
            <Text style={{ fontSize: 8.5, fontWeight: s.current ? '600' : '300', color: s.current ? colors.ink : s.done ? colors.slate : '#9B9B9F', textAlign: 'center', lineHeight: 11 }}>
              {s.label}
            </Text>
          </View>
        ))}
      </View>

      {trip.driverName && (
        <View style={{ flexDirection: isArabic ? 'row-reverse' : 'row', alignItems: 'center', gap: 10, backgroundColor: colors.sheetBg, borderRadius: 9, padding: 10, paddingHorizontal: 12, marginTop: 14 }}>
          <View style={{ width: 34, height: 34, borderRadius: 100, backgroundColor: colors.blackPanel, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ color: colors.gold, fontSize: 12, fontWeight: '600' }}>{driverInitials(trip.driverName)}</Text>
          </View>
          <View style={{ flex: 1, minWidth: 0 }}>
            <Text style={textStyle({ weight: 500, size: 12.5, color: colors.ink, isArabic })}>{trip.driverName}</Text>
            <Text style={[textStyle({ weight: 300, size: 10.5, color: colors.slate, isArabic: false }), { marginTop: 2 }]}>{trip.plate}</Text>
          </View>
          <Pressable
            onPress={() => showToast((isArabic ? 'اتصال بـ ' : 'Calling ') + trip.driverName + ' · ' + BV_CONTACT.phones[0])}
            style={{ height: 44, paddingHorizontal: 14, borderRadius: 100, backgroundColor: colors.blackPanel, alignItems: 'center', justifyContent: 'center' }}
          >
            <Text style={textStyle({ weight: 600, size: 11.5, color: '#fff', isArabic })}>{t.callWord}</Text>
          </Pressable>
          <Pressable
            onPress={() => showToast(isArabic ? 'فتح واتساب مع السائق' : 'Opening WhatsApp with the driver')}
            style={{ height: 44, paddingHorizontal: 14, borderRadius: 100, backgroundColor: colors.success, alignItems: 'center', justifyContent: 'center' }}
          >
            <Text style={textStyle({ weight: 600, size: 11.5, color: '#fff', isArabic })}>{t.waWord}</Text>
          </Pressable>
        </View>
      )}

      <View style={{ flexDirection: 'row', gap: 8, marginTop: 12 }}>
        <Pressable
          onPress={openDocuments}
          style={{ flex: 1, minHeight: 44, borderRadius: 7, borderWidth: 1, borderColor: colors.inputBorder, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' }}
        >
          <Text style={textStyle({ weight: 600, size: 11.5, color: colors.ink, isArabic })}>{t.documents}</Text>
        </Pressable>
        {canAct && (
          <>
            <Pressable
              onPress={() => amendTrip(trip.ref)}
              style={{ flex: 1, minHeight: 44, borderRadius: 7, borderWidth: 1, borderColor: colors.inputBorder, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' }}
            >
              <Text style={textStyle({ weight: 600, size: 11.5, color: colors.ink, isArabic })}>{t.amend}</Text>
            </Pressable>
            <Pressable
              onPress={() => requestCancel(trip.ref)}
              style={{ flex: 1, minHeight: 44, borderRadius: 7, borderWidth: 1, borderColor: '#F0C9C7', backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' }}
            >
              <Text style={textStyle({ weight: 600, size: 11.5, color: colors.danger, isArabic })}>{t.cancel}</Text>
            </Pressable>
          </>
        )}
      </View>
    </View>
  );
}
