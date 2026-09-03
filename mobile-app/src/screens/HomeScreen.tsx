import React from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { colors } from '../theme/colors';
import { textStyle } from '../theme/text';
import { useI18n } from '../i18n/useI18n';
import { useAppStore } from '../store/useAppStore';
import { useSearchLabels } from '../utils/useSearchLabels';
import { useCash } from '../utils/useCash';
import { dateLabel } from '../utils/dates';
import { BV_CONTACT } from '../data/account';
import { useCatalogStore } from '../store/useCatalogStore';
import Starfield from '../components/Starfield';
import { PrimaryButton, DarkGhostButton } from '../components/Buttons';
import { Eyebrow } from '../components/Labels';

// Home is built around the primary task — find and book a vehicle — per the
// product review: search, an active hire, and an upcoming trip all outrank
// the marketing hero, which is now a slim, dismissible strip rather than a
// full-height banner that pushes the task below the fold on every launch.
export default function HomeScreen() {
  const { t, lang, isArabic } = useI18n();
  const cash = useCash();
  const { startLabel, endLabel, locationLabel, nightsLine } = useSearchLabels();

  const heroSeen = useAppStore((s) => s.heroSeen);
  const dismissHero = useAppStore((s) => s.dismissHero);
  const openSearch = useAppStore((s) => s.openSearch);
  const runSearch = useAppStore((s) => s.runSearch);
  const trips = useAppStore((s) => s.trips);
  const setTab = useAppStore((s) => s.setTab);
  const setFleetFilter = useAppStore((s) => s.setFleetFilter);
  const openTrips = useAppStore((s) => s.openTrips);
  const showToast = useAppStore((s) => s.showToast);
  const account = useAppStore((s) => s.account);
  const setTripTab = useAppStore((s) => s.setTripTab);
  const vehicles = useCatalogStore((s) => s.vehicles);

  const activeTrip = trips.find((tr) => tr.group === 'active' && !tr.cancelled);
  const upcomingTrip = !activeTrip
    ? trips.filter((tr) => tr.group === 'upcoming' && !tr.cancelled).sort((a, b) => a.from.getTime() - b.from.getTime())[0]
    : undefined;
  const activeVehicle = activeTrip ? vehicles.find((v) => v.name === activeTrip.vehicle) : undefined;
  const openRequests = trips.filter((tr) => tr.stage < 3 && !tr.cancelled).length;

  const callDriver = () => showToast((isArabic ? 'اتصال بـ ' : 'Calling ') + (activeTrip?.driverName ?? '') + ' · ' + BV_CONTACT.phones[0]);

  const services = [
    { mark: '✈', title: isArabic ? 'توصيل المطار' : 'Airport Transfer', sub: isArabic ? 'استلام وتوصيل من كل المطارات' : 'Pickup and drop-off, all airports', go: () => { setTab('fleet'); setFleetFilter('SUV'); } },
    { mark: '◆', title: isArabic ? 'ليموزين الأعراس' : 'Wedding Limousine', sub: isArabic ? 'اجعل يومك لا يُنسى' : 'Make the day unforgettable', go: () => { setTab('fleet'); setFleetFilter('VIP'); } },
    { mark: '▣', title: isArabic ? 'إيجار الشركات' : 'Corporate Rental', sub: isArabic ? 'عقود طويلة وسفر تنفيذي' : 'Long-term and executive travel', go: () => { setTab('fleet'); setFleetFilter('All'); } },
    { mark: '✆', title: isArabic ? 'دعم ٢٤/٧' : '24/7 Support', sub: isArabic ? 'مساعدة على الطريق في أي وقت' : 'Roadside assistance any hour', go: () => showToast(BV_CONTACT.phones.join(' / ')) },
  ];

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.sheetBg }} showsVerticalScrollIndicator={false}>
      <View style={{ padding: 16, paddingTop: 18, gap: 16 }}>
        <View style={{ backgroundColor: colors.black, borderRadius: 12, padding: 16 }}>
          <Eyebrow tone="gold">{t.findRide}</Eyebrow>
          <View style={{ flexDirection: 'row', gap: 9, marginTop: 13 }}>
            <SearchField label={t.pickupDate} value={startLabel} onPress={openSearch} />
            <SearchField label={t.returnDate} value={endLabel} onPress={openSearch} />
          </View>
          <SearchField label={t.location} value={locationLabel} onPress={openSearch} wide style={{ marginTop: 9 }} />
          <PrimaryButton label={t.findVehicles} onPress={runSearch} style={{ marginTop: 12 }} />
          <Text style={[textStyle({ weight: 300, size: 10.5, color: '#9B9B9F', isArabic }), { textAlign: 'center', marginTop: 9 }]}>{nightsLine}</Text>
        </View>

        {activeTrip && (
          <View style={{ backgroundColor: colors.blackPanel, borderRadius: 12, padding: 16 }}>
            <View style={{ flexDirection: isArabic ? 'row-reverse' : 'row', alignItems: 'center', gap: 7, marginBottom: 13 }}>
              <View style={{ width: 6, height: 6, borderRadius: 100, backgroundColor: colors.gold }} />
              <Eyebrow tone="gold">{t.onHire}</Eyebrow>
              <View style={{ flex: 1 }} />
              <Text style={textStyle({ weight: 400, size: 10.5, color: '#9B9B9F', isArabic: false })}>{activeTrip.ref}</Text>
            </View>
            <Text style={textStyle({ weight: 600, size: 18, color: '#fff', isArabic, trackingPx: -0.4, lineHeight: 22 })}>{activeTrip.vehicle}</Text>
            <View style={{ flexDirection: isArabic ? 'row-reverse' : 'row', alignItems: 'center', gap: 8, marginTop: 7, flexWrap: 'wrap' }}>
              <Text style={{ fontSize: 10.5, fontWeight: '500', color: '#fff', backgroundColor: 'rgba(255,255,255,.12)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4, letterSpacing: 0.5 }}>
                {activeTrip.plate}
              </Text>
              {activeVehicle && (
                <Text style={textStyle({ weight: 300, size: 11.5, color: colors.onDarkSoft, isArabic })}>
                  {activeVehicle.seats + (isArabic ? ' مقاعد · ' : ' seats · ') + activeVehicle.gear + ' · ' + activeVehicle.cat}
                </Text>
              )}
            </View>
            <View style={{ height: 1, backgroundColor: 'rgba(255,255,255,.1)', marginVertical: 14 }} />
            <View style={{ flexDirection: isArabic ? 'row-reverse' : 'row', gap: 14 }}>
              <View style={{ flex: 1 }}>
                <Text style={[textStyle({ weight: 600, size: 8.5, color: '#9B9B9F', isArabic, trackingPx: 1.2 }), { marginBottom: 5 }]}>{t.driver}</Text>
                <Text style={textStyle({ weight: 400, size: 12.5, color: '#fff', isArabic })}>{activeTrip.driverName}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[textStyle({ weight: 600, size: 8.5, color: '#9B9B9F', isArabic, trackingPx: 1.2 }), { marginBottom: 5 }]}>{t.returns}</Text>
                <Text style={textStyle({ weight: 400, size: 12.5, color: '#fff', isArabic })}>{dateLabel(activeTrip.to, lang)}</Text>
              </View>
            </View>
            <View style={{ flexDirection: isArabic ? 'row-reverse' : 'row', gap: 8, marginTop: 16 }}>
              <PrimaryButton label={t.track} onPress={openTrips} style={{ flex: 1, minHeight: 44 }} />
              <DarkGhostButton label={t.callDriver} onPress={callDriver} />
            </View>
          </View>
        )}

        {upcomingTrip && (
          <Pressable
            onPress={() => { setTab('trips'); setTripTab('upcoming'); }}
            style={{ flexDirection: isArabic ? 'row-reverse' : 'row', alignItems: 'center', gap: 12, backgroundColor: '#fff', borderWidth: 1, borderColor: colors.cardBorder, borderRadius: 12, padding: 14 }}
          >
            <View style={{ width: 6, height: 6, borderRadius: 100, backgroundColor: colors.primary }} />
            <View style={{ flex: 1, minWidth: 0 }}>
              <Text style={[textStyle({ weight: 600, size: 8.5, color: colors.slate, isArabic, trackingPx: 1.2, uppercase: true })]}>{t.tUpcoming}</Text>
              <Text style={textStyle({ weight: 600, size: 13.5, color: colors.ink, isArabic, trackingPx: -0.2 })}>{upcomingTrip.vehicle}</Text>
              <Text style={[textStyle({ weight: 300, size: 11, color: colors.slate, isArabic }), { marginTop: 2 }]}>
                {dateLabel(upcomingTrip.from, lang)} → {dateLabel(upcomingTrip.to, lang)}
              </Text>
            </View>
            <Text style={textStyle({ weight: 600, size: 13, color: colors.primary, isArabic: false })}>{isArabic ? '‹' : '›'}</Text>
          </Pressable>
        )}

        {!heroSeen && (
          <View style={{ backgroundColor: colors.black, borderRadius: 12, padding: 14, overflow: 'hidden' }}>
            <Starfield variant="hero" />
            <View style={{ flexDirection: isArabic ? 'row-reverse' : 'row', alignItems: 'center', gap: 10 }}>
              <Text style={{ color: colors.gold, fontSize: 11, letterSpacing: 2 }}>★★★★★</Text>
              <View style={{ flex: 1 }}>
                <Text style={[textStyle({ weight: 600, size: 12, color: '#fff', isArabic, lineHeight: 16 })]}>
                  {isArabic ? 'BV بافاريان — تأجير سيارات فاخرة منذ أكثر من 10 سنوات' : 'BV Bavarian — premium car rental, 10+ years in Khartoum'}
                </Text>
              </View>
              <Pressable onPress={dismissHero} style={{ width: 32, height: 32, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ color: '#8E8E93', fontSize: 16, fontWeight: '300' }}>×</Text>
              </Pressable>
            </View>
          </View>
        )}

        <View>
          <View style={{ alignItems: 'center', marginBottom: 14, marginTop: 6 }}>
            <Eyebrow>{t.ourServices}</Eyebrow>
            <Text style={[textStyle({ weight: 700, size: 19, color: colors.ink, isArabic, trackingPx: -0.5 }), { marginTop: 6 }]}>{t.whatWeProvide}</Text>
            <View style={{ width: 52, height: 2, backgroundColor: colors.gold, marginTop: 9 }} />
          </View>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
            {services.map((sv, i) => (
              <Pressable key={i} onPress={sv.go} style={{ width: '48%', borderWidth: 1, borderColor: colors.cardBorder2, backgroundColor: '#fff', borderRadius: 10, padding: 14, minHeight: 110 }}>
                <View style={{ width: 34, height: 34, borderRadius: 8, backgroundColor: colors.blackPanel, alignItems: 'center', justifyContent: 'center', marginBottom: 11 }}>
                  <Text style={{ color: colors.gold, fontSize: 14, fontWeight: '600' }}>{sv.mark}</Text>
                </View>
                <Text style={textStyle({ weight: 600, size: 13, color: colors.ink, isArabic, lineHeight: 17 })}>{sv.title}</Text>
                <Text style={[textStyle({ weight: 300, size: 11, color: colors.slate, isArabic, lineHeight: 15 }), { marginTop: 4 }]}>{sv.sub}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={{ backgroundColor: colors.blackPanel, borderRadius: 12, padding: 16, marginBottom: 10 }}>
          <Eyebrow tone="gold">{t.accountThisMonth}</Eyebrow>
          <View style={{ flexDirection: isArabic ? 'row-reverse' : 'row', marginTop: 13 }}>
            <View style={{ flex: 1 }}>
              <Text style={textStyle({ weight: 700, size: 19, color: '#fff', isArabic, trackingPx: -0.4 })}>{openRequests}</Text>
              <Text style={[textStyle({ weight: 300, size: 11, color: colors.onDarkSoft, isArabic }), { marginTop: 3 }]}>{t.openRequests}</Text>
            </View>
            <View style={{ flex: 1.2 }}>
              <Text style={textStyle({ weight: 700, size: 19, color: '#fff', isArabic, trackingPx: -0.4 })}>{cash(4850)}</Text>
              <Text style={[textStyle({ weight: 300, size: 11, color: colors.onDarkSoft, isArabic }), { marginTop: 3 }]}>{t.committed}</Text>
            </View>
            <View style={{ flex: 1.1 }}>
              <Text style={[textStyle({ weight: 500, size: 12.5, color: colors.gold, isArabic }), { paddingTop: 4 }]}>{isArabic ? account.contractRefAr : account.contractRef}</Text>
              <Text style={[textStyle({ weight: 300, size: 11, color: colors.onDarkSoft, isArabic }), { marginTop: 3 }]}>{t.agreement}</Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

function SearchField({ label, value, onPress, wide, style }: { label: string; value: string; onPress: () => void; wide?: boolean; style?: object }) {
  const { isArabic } = useI18n();
  return (
    <Pressable
      onPress={onPress}
      style={[{ flex: wide ? undefined : 1, width: wide ? '100%' : undefined, borderWidth: 1, borderColor: 'rgba(255,255,255,.14)', backgroundColor: colors.blackPanel, borderRadius: 9, padding: 13, minHeight: 56, justifyContent: 'center' }, style]}
    >
      <Text style={textStyle({ weight: 600, size: 8.5, color: '#9B9B9F', isArabic, trackingPx: 1.2 })}>{label}</Text>
      <Text style={[textStyle({ weight: 600, size: 14, color: '#fff', isArabic }), { marginTop: 5 }]}>{value}</Text>
    </Pressable>
  );
}
