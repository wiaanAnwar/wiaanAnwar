import React from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import { textStyle } from '../theme/text';
import { useI18n } from '../i18n/useI18n';
import { useAppStore } from '../store/useAppStore';
import { useSearchLabels } from '../utils/useSearchLabels';
import { useCalendarMonths } from '../utils/useCalendarMonths';
import { useCatalogStore } from '../store/useCatalogStore';
import { PrimaryButton } from '../components/Buttons';
import { Eyebrow } from '../components/Labels';
import RadioRow from '../components/RadioRow';
import { isSameDay } from '../utils/dates';

export default function SearchSheet() {
  const insets = useSafeAreaInsets();
  const { t, isArabic } = useI18n();
  const closeSearch = useAppStore((s) => s.closeSearch);
  const applySearch = useAppStore((s) => s.applySearch);
  const pickCalendarDay = useAppStore((s) => s.pickCalendarDay);
  const setLocIdx = useAppStore((s) => s.setLocIdx);
  const pickupDate = useAppStore((s) => s.pickupDate);
  const returnDate = useAppStore((s) => s.returnDate);
  const pickPhase = useAppStore((s) => s.pickPhase);
  const locIdx = useAppStore((s) => s.locIdx);
  const locations = useCatalogStore((s) => s.locations);
  const { startLabel, endLabel, rangeLabel } = useSearchLabels();
  const months = useCalendarMonths();
  const chev = isArabic ? '›' : '‹';

  return (
    <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: colors.sheetBg, zIndex: 20 }}>
      <View style={{ backgroundColor: colors.black, paddingTop: insets.top + 10, paddingBottom: 14, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 11 }}>
        <Pressable onPress={closeSearch} style={{ width: 44, height: 44, borderRadius: 100, borderWidth: 1, borderColor: 'rgba(255,255,255,.22)', alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ color: '#fff', fontSize: 15 }}>{chev}</Text>
        </Pressable>
        <View style={{ flex: 1 }}>
          <Text style={textStyle({ weight: 600, size: 14, color: '#fff', isArabic, trackingPx: -0.3 })}>{t.whenWhere}</Text>
          <Text style={[textStyle({ weight: 300, size: 10.5, color: colors.onDarkSoft, isArabic }), { marginTop: 2 }]}>{t.whenWhereSub}</Text>
        </View>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }}>
        <View style={{ flexDirection: 'row', gap: 9, marginBottom: 16 }}>
          <View style={{ flex: 1, borderRadius: 9, padding: 13, borderWidth: 1, borderColor: pickPhase === 'start' ? colors.primary : colors.cardBorder, backgroundColor: '#fff' }}>
            <Text style={[textStyle({ weight: 600, size: 8.5, color: '#6E6E72', isArabic, trackingPx: 1.2 })]}>{t.pickupDate}</Text>
            <Text style={[textStyle({ weight: 600, size: 14, color: colors.ink, isArabic }), { marginTop: 4 }]}>{startLabel}</Text>
          </View>
          <View style={{ flex: 1, borderRadius: 9, padding: 13, borderWidth: 1, borderColor: pickPhase === 'end' ? colors.primary : colors.cardBorder, backgroundColor: '#fff' }}>
            <Text style={[textStyle({ weight: 600, size: 8.5, color: '#6E6E72', isArabic, trackingPx: 1.2 })]}>{t.returnDate}</Text>
            <Text style={[textStyle({ weight: 600, size: 14, color: colors.ink, isArabic }), { marginTop: 4 }]}>{endLabel}</Text>
          </View>
        </View>

        {months.map((mo, mi) => (
          <View key={mi} style={{ marginBottom: 20 }}>
            <Text style={[textStyle({ weight: 600, size: 13.5, color: colors.ink, isArabic }), { marginBottom: 10 }]}>{mo.label}</Text>
            <View style={{ flexDirection: 'row', marginBottom: 6 }}>
              {t.weekdays.map((wd, i) => (
                <Text key={i} style={[textStyle({ weight: 600, size: 9, color: '#8A8A8E', isArabic, trackingPx: 0.8 }), { flex: 1, textAlign: 'center' }]}>
                  {wd}
                </Text>
              ))}
            </View>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
              {mo.cells.map((c, ci) => {
                if (!c) return <View key={ci} style={{ width: `${100 / 7}%`, height: 40 }} />;
                const isStart = isSameDay(c.date, pickupDate);
                const isEnd = isSameDay(c.date, returnDate);
                const inRange = c.date.getTime() > pickupDate.getTime() && c.date.getTime() < returnDate.getTime();
                let bg = 'transparent';
                let color = c.isPast ? '#C4C4C8' : colors.ink;
                let weight: 400 | 600 = 400;
                if (inRange) { bg = colors.goldTint; color = colors.ink; }
                if (isStart || isEnd) { bg = colors.primary; color = '#fff'; weight = 600; }
                return (
                  <View key={ci} style={{ width: `${100 / 7}%`, height: 40, padding: 1.5 }}>
                    <Pressable
                      disabled={c.isPast}
                      onPress={() => pickCalendarDay(c.date)}
                      style={{ flex: 1, borderRadius: 8, alignItems: 'center', justifyContent: 'center', backgroundColor: bg }}
                    >
                      <Text style={textStyle({ weight, size: 12.5, color, isArabic: false })}>{c.day}</Text>
                    </Pressable>
                  </View>
                );
              })}
            </View>
          </View>
        ))}

        <Eyebrow>{t.location}</Eyebrow>
        <View style={{ backgroundColor: '#fff', borderWidth: 1, borderColor: colors.cardBorder, borderRadius: 10, overflow: 'hidden', marginTop: 10 }}>
          {locations.map((l, i) => (
            <RadioRow key={i} title={isArabic ? l.ar : l.en} sub={isArabic ? l.arSub : l.enSub} selected={i === locIdx} onPress={() => setLocIdx(i)} last={i === locations.length - 1} />
          ))}
        </View>
      </ScrollView>

      <View style={{ backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: colors.cardBorder, padding: 16, paddingBottom: insets.bottom + 20 }}>
        <PrimaryButton label={`${t.apply} · ${rangeLabel}`} onPress={applySearch} />
      </View>
    </View>
  );
}
