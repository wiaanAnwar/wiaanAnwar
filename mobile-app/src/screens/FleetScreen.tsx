import React, { useMemo } from 'react';
import { View, Text, Pressable, ScrollView, FlatList, ActivityIndicator } from 'react-native';
import { colors } from '../theme/colors';
import { textStyle } from '../theme/text';
import { useI18n } from '../i18n/useI18n';
import { useAppStore } from '../store/useAppStore';
import { useSearchLabels } from '../utils/useSearchLabels';
import { useCash } from '../utils/useCash';
import { Category } from '../data/vehicles';
import { useCatalogStore } from '../store/useCatalogStore';
import { buildVehicleRow } from '../utils/vehicleRow';
import { SkeletonCard } from '../components/Skeleton';
import VehiclePhoto from '../components/VehiclePhoto';
import { FleetFilter } from '../store/types';

const FILTERS: FleetFilter[] = ['All', 'SUV', 'Sedan', 'Truck', 'VIP', 'Van', 'Bus'];

export default function FleetScreen() {
  const { t, lang, isArabic } = useI18n();
  const cash = useCash();
  const { rangeLabel, locationLabel, nightsLine, nights } = useSearchLabels();

  const openSearch = useAppStore((s) => s.openSearch);
  const fleetFilter = useAppStore((s) => s.fleetFilter);
  const setFleetFilter = useAppStore((s) => s.setFleetFilter);
  const searching = useAppStore((s) => s.searching);
  const pickupDate = useAppStore((s) => s.pickupDate);
  const openDetail = useAppStore((s) => s.openDetail);
  const startBooking = useAppStore((s) => s.startBooking);
  const showToast = useAppStore((s) => s.showToast);
  const checkingAvailability = useAppStore((s) => s.checkingAvailability);
  const detailId = useAppStore((s) => s.detailId);
  const vehicles = useCatalogStore((s) => s.vehicles);

  const filterLabels: Record<FleetFilter, string> = {
    All: isArabic ? 'الكل' : 'All', SUV: 'SUV', Sedan: isArabic ? 'سيدان' : 'Sedan',
    Truck: isArabic ? 'بيك أب' : 'Truck', VIP: 'VIP', Van: isArabic ? 'فان' : 'Van', Bus: isArabic ? 'باص' : 'Bus',
  };

  const fleet = useMemo(() => {
    return vehicles
      .filter((v) => fleetFilter === 'All' || v.cat === (fleetFilter as Category))
      .map((v) => ({ v, row: buildVehicleRow(v, { pickupDate, nights, lang, isArabic, t, cash }) }))
      .sort((a, b) => Number(b.row.free > 0) - Number(a.row.free > 0));
  }, [vehicles, fleetFilter, pickupDate, nights, lang, isArabic]);

  const freeCategories = fleet.filter((f) => f.row.free > 0).length;

  return (
    <View style={{ flex: 1, backgroundColor: colors.sheetBg }}>
      <View style={{ paddingTop: 16, paddingHorizontal: 16 }}>
        <Pressable onPress={openSearch} style={{ flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#fff', borderWidth: 1, borderColor: colors.cardBorder, borderRadius: 10, padding: 14, minHeight: 56 }}>
          <View style={{ flex: 1 }}>
            <Text style={textStyle({ weight: 600, size: 13, color: colors.ink, isArabic })}>{rangeLabel}</Text>
            <Text style={[textStyle({ weight: 300, size: 11, color: colors.slate, isArabic }), { marginTop: 3 }]}>{locationLabel} · {nightsLine}</Text>
          </View>
          <Text style={textStyle({ weight: 600, size: 11.5, color: colors.primary, isArabic })}>{t.change}</Text>
        </Pressable>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 7, paddingHorizontal: 16, paddingVertical: 14 }}>
        {FILTERS.map((f) => {
          const on = fleetFilter === f;
          return (
            <Pressable
              key={f}
              onPress={() => setFleetFilter(f)}
              style={{ borderRadius: 100, minHeight: 44, paddingHorizontal: 18, justifyContent: 'center', borderWidth: 1, borderColor: on ? colors.primary : colors.chipBorder, backgroundColor: on ? colors.primary : '#fff' }}
            >
              <Text style={textStyle({ weight: 600, size: 12, color: on ? '#fff' : '#4E4E52', isArabic })}>{filterLabels[f]}</Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {searching ? (
        <View style={{ paddingHorizontal: 16, gap: 12 }}>
          {[1, 2, 3].map((i) => <SkeletonCard key={i} />)}
        </View>
      ) : (
        <FlatList
          data={fleet}
          keyExtractor={(item) => item.v.id}
          contentContainerStyle={{ padding: 16, paddingTop: 0, gap: 12 }}
          ListHeaderComponent={
            <Text style={[textStyle({ weight: 300, size: 11.5, color: colors.slate, isArabic }), { marginBottom: 12 }]}>
              {freeCategories} {t.categoriesFree} · {rangeLabel}
            </Text>
          }
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
          ListEmptyComponent={
            <View style={{ borderWidth: 1, borderStyle: 'dashed', borderColor: colors.dashedBorder, borderRadius: 10, padding: 30, paddingHorizontal: 20, alignItems: 'center', backgroundColor: '#fff' }}>
              <Text style={textStyle({ weight: 600, size: 14, color: colors.ink, isArabic })}>{t.noResults}</Text>
              <Text style={[textStyle({ weight: 300, size: 12, color: colors.slate, isArabic, lineHeight: 18 }), { marginTop: 6, textAlign: 'center' }]}>{t.noResultsSub}</Text>
              <Pressable onPress={openSearch} style={{ marginTop: 16, borderRadius: 7, backgroundColor: colors.primary, minHeight: 44, paddingHorizontal: 20, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={textStyle({ weight: 600, size: 12.5, color: '#fff', isArabic })}>{t.changeDates}</Text>
              </Pressable>
            </View>
          }
          renderItem={({ item }) => {
            const { v, row } = item;
            const rate = cash(v.rate);
            const total = cash(v.rate * nights);
            const badge = isArabic ? v.badgeAr : v.badge;
            const onRent = () => {
              if (row.out) {
                showToast(isArabic ? `سنبلغك عند توفر ${v.name}` : `We'll notify you when the ${v.name} frees up`);
                return;
              }
              openDetail(v.id);
              startBooking();
            };
            return (
              <View style={{ backgroundColor: '#fff', borderWidth: 1, borderColor: colors.cardBorder, borderRadius: 10, opacity: row.out ? 0.72 : 1 }}>
                <View style={{ flexDirection: 'row', gap: 12, padding: 12 }}>
                  <Pressable onPress={() => openDetail(v.id)}>
                    <VehiclePhoto label={v.name.toUpperCase()} style={{ width: 104, height: 78, borderRadius: 8 }} />
                  </Pressable>
                  <View style={{ flex: 1, minWidth: 0 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 8 }}>
                      <Pressable onPress={() => openDetail(v.id)} style={{ flex: 1 }}>
                        <Text style={textStyle({ weight: 600, size: 14.5, color: colors.ink, isArabic, trackingPx: -0.3, lineHeight: 18 })}>{v.name}</Text>
                      </Pressable>
                      <Text style={{ fontSize: 8.5, fontWeight: '600', color: colors.ink, backgroundColor: colors.gold, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 100 }}>{badge}</Text>
                    </View>
                    <Text style={[textStyle({ weight: 300, size: 11, color: colors.slate, isArabic }), { marginTop: 6 }]}>{row.specLine}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 8 }}>
                      <View style={{ width: 6, height: 6, borderRadius: 100, backgroundColor: row.dotColor }} />
                      <Text style={textStyle({ weight: 300, size: 10.5, color: row.availColor, isArabic })}>{row.availability}</Text>
                    </View>
                  </View>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 12, paddingBottom: 12 }}>
                  <View style={{ flex: 1, flexDirection: 'row', alignItems: 'baseline', gap: 3 }}>
                    <Text style={textStyle({ weight: 700, size: 18, color: colors.ink, isArabic, trackingPx: -0.4 })}>{rate}</Text>
                    <Text style={textStyle({ weight: 300, size: 10.5, color: colors.slate, isArabic })}>{t.perDay}</Text>
                    <Text style={textStyle({ weight: 300, size: 10.5, color: '#9B9B9F', isArabic })}> · {total} · {nightsLine}</Text>
                  </View>
                  <Pressable
                    onPress={onRent}
                    disabled={checkingAvailability && detailId === v.id}
                    style={{ minHeight: 44, paddingHorizontal: 18, borderRadius: 7, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: row.out ? '#EDEDED' : colors.primary }}
                  >
                    {checkingAvailability && detailId === v.id && <ActivityIndicator size="small" color="#fff" style={{ marginEnd: 7 }} />}
                    <Text style={textStyle({ weight: 600, size: 12.5, color: row.out ? colors.slate : '#fff', isArabic })}>{row.ctaLabel}</Text>
                  </Pressable>
                </View>
              </View>
            );
          }}
        />
      )}
    </View>
  );
}
