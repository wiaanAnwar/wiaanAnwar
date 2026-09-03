import React, { useMemo } from 'react';
import { View, Text, Pressable, FlatList } from 'react-native';
import { colors } from '../theme/colors';
import { textStyle } from '../theme/text';
import { useI18n } from '../i18n/useI18n';
import { useAppStore } from '../store/useAppStore';
import { TripGroup } from '../data/trips';
import TripCard from '../components/TripCard';
import { Eyebrow } from '../components/Labels';

const GROUPS: TripGroup[] = ['active', 'upcoming', 'past'];

export default function TripsScreen() {
  const { t, isArabic } = useI18n();
  const trips = useAppStore((s) => s.trips);
  const tripTab = useAppStore((s) => s.tripTab);
  const setTripTab = useAppStore((s) => s.setTripTab);
  const setTab = useAppStore((s) => s.setTab);

  const groupLabels: Record<TripGroup, string> = { active: t.tActive, upcoming: t.tUpcoming, past: t.tPast };
  const visible = useMemo(() => trips.filter((tr) => tr.group === tripTab), [trips, tripTab]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.sheetBg }}>
      <FlatList
        data={visible}
        keyExtractor={(tr) => tr.ref}
        contentContainerStyle={{ padding: 16, paddingBottom: 26, gap: 12 }}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        ListHeaderComponent={
          <View style={{ marginBottom: 4 }}>
            <Eyebrow>{t.yourBookings}</Eyebrow>
            <Text style={[textStyle({ weight: 700, size: 22, color: colors.ink, isArabic, trackingPx: -0.6 }), { marginTop: 6 }]}>{t.trips}</Text>
            <View style={{ width: 56, height: 2, backgroundColor: colors.gold, marginTop: 10, marginBottom: 16 }} />
            <View style={{ flexDirection: 'row', backgroundColor: '#EAEAEA', borderRadius: 8, padding: 3, marginBottom: 16 }}>
              {GROUPS.map((g) => {
                const on = tripTab === g;
                return (
                  <Pressable
                    key={g}
                    onPress={() => setTripTab(g)}
                    style={{ flex: 1, minHeight: 44, borderRadius: 6, alignItems: 'center', justifyContent: 'center', backgroundColor: on ? '#fff' : 'transparent' }}
                  >
                    <Text style={textStyle({ weight: 600, size: 12, color: on ? colors.ink : colors.slate, isArabic })}>{groupLabels[g]}</Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        }
        ListEmptyComponent={
          <View style={{ borderWidth: 1, borderStyle: 'dashed', borderColor: colors.dashedBorder, borderRadius: 10, padding: 32, paddingHorizontal: 20, alignItems: 'center', backgroundColor: '#fff' }}>
            <Text style={textStyle({ weight: 600, size: 14, color: colors.ink, isArabic })}>{t.nothingHere}</Text>
            <Text style={[textStyle({ weight: 300, size: 12, color: colors.slate, isArabic, lineHeight: 18 }), { marginTop: 6, textAlign: 'center' }]}>{t.nothingHereSub}</Text>
            <Pressable onPress={() => setTab('fleet')} style={{ marginTop: 16, borderRadius: 7, backgroundColor: colors.primary, minHeight: 44, paddingHorizontal: 20, alignItems: 'center', justifyContent: 'center' }}>
              <Text style={textStyle({ weight: 600, size: 12.5, color: '#fff', isArabic })}>{t.viewFleet}</Text>
            </Pressable>
          </View>
        }
        renderItem={({ item }) => <TripCard trip={item} />}
      />
    </View>
  );
}
