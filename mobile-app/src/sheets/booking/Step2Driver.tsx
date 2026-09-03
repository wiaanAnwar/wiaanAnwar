import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { colors } from '../../theme/colors';
import { textStyle } from '../../theme/text';
import { useI18n } from '../../i18n/useI18n';
import { useAppStore } from '../../store/useAppStore';
import { useCash } from '../../utils/useCash';
import { useCatalogStore } from '../../store/useCatalogStore';
import { Eyebrow } from '../../components/Labels';
import Toggle from '../../components/Toggle';

export default function Step2Driver() {
  const { t, isArabic } = useI18n();
  const cash = useCash();
  const driver = useAppStore((s) => s.driver);
  const setDriver = useAppStore((s) => s.setDriver);
  const addons = useAppStore((s) => s.addons);
  const toggleAddon = useAppStore((s) => s.toggleAddon);
  const ADDONS = useCatalogStore((s) => s.addons);

  const modes = [
    { key: true, title: t.chauffeur, sub: (isArabic ? 'سائق محترف · ' : 'Professional driver · ') + cash(40) + t.perDay },
    { key: false, title: t.selfDrive, sub: isArabic ? 'فحص الرخصة والهوية عند الاستلام' : 'Licence and ID check at pickup' },
  ];

  return (
    <View style={{ gap: 20 }}>
      <View>
        <Eyebrow>{t.whoDrives}</Eyebrow>
        <View style={{ flexDirection: 'row', gap: 9, marginTop: 10 }}>
          {modes.map((m) => {
            const on = driver === m.key;
            return (
              <Pressable
                key={String(m.key)}
                onPress={() => setDriver(m.key)}
                style={{ flex: 1, borderRadius: 10, padding: 14, minHeight: 86, borderWidth: 1, borderColor: on ? '#0B0B0C' : '#E6E6E6', backgroundColor: on ? '#0B0B0C' : '#fff' }}
              >
                <Text style={textStyle({ weight: 600, size: 13, color: on ? '#fff' : colors.ink, isArabic, trackingPx: -0.2 })}>{m.title}</Text>
                <Text style={[textStyle({ weight: 300, size: 10.5, color: on ? '#fff' : colors.ink, isArabic, lineHeight: 15 }), { opacity: 0.75, marginTop: 5 }]}>{m.sub}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>
      <View>
        <Eyebrow>{t.addons}</Eyebrow>
        <View style={{ backgroundColor: '#fff', borderWidth: 1, borderColor: colors.cardBorder, borderRadius: 10, overflow: 'hidden', marginTop: 10 }}>
          {ADDONS.map((a, i) => {
            const on = addons[a.id];
            const sub = (isArabic ? a.arSub : a.enSub) + ' · ' + cash(a.price) + (a.unit === 'day' ? t.perDay : isArabic ? ' مرة واحدة' : ' once');
            return (
              <Pressable
                key={a.id}
                onPress={() => toggleAddon(a.id)}
                style={{ flexDirection: 'row', alignItems: 'center', gap: 11, minHeight: 56, padding: 12, paddingHorizontal: 15, borderBottomWidth: i === ADDONS.length - 1 ? 0 : 1, borderBottomColor: colors.hairline }}
              >
                <View style={{ flex: 1 }}>
                  <Text style={textStyle({ weight: 500, size: 12.5, color: colors.ink, isArabic })}>{isArabic ? a.ar : a.en}</Text>
                  <Text style={[textStyle({ weight: 300, size: 10.5, color: colors.slate, isArabic }), { marginTop: 2 }]}>{sub}</Text>
                </View>
                <Toggle on={on} onToggle={() => toggleAddon(a.id)} />
              </Pressable>
            );
          })}
        </View>
      </View>
      <View style={{ backgroundColor: colors.blackPanel, borderRadius: 10, padding: 15 }}>
        <Text style={textStyle({ weight: 300, size: 11.5, color: colors.onDarkSoft, isArabic, lineHeight: 19 })}>
          {driver
            ? isArabic
              ? 'سائقو BV يعرفون الخرطوم والطرق إلى الولايات، ويُطلعون على التعليمات قبل كل رحلة. الوقود يُحتسب منفصلاً.'
              : 'BV chauffeurs know Khartoum and the routes out to the states, and are briefed before every hire. Fuel is billed separately.'
            : isArabic
            ? 'القيادة الذاتية تتطلب رخصة سارية وهوية عند الاستلام، وقد تطلب BV عربوناً للسيارات الكبيرة.'
            : 'Self-drive needs a valid licence and ID at pickup. For Land Cruisers and the limousine BV may ask for a deposit.'}
        </Text>
      </View>
    </View>
  );
}
