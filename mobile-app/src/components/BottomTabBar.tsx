import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import { textStyle } from '../theme/text';
import { useI18n } from '../i18n/useI18n';
import { useAppStore } from '../store/useAppStore';
import { Tab } from '../store/types';

const TABS: Tab[] = ['home', 'fleet', 'trips', 'account'];

export default function BottomTabBar() {
  const insets = useSafeAreaInsets();
  const { t, isArabic } = useI18n();
  const tab = useAppStore((s) => s.tab);
  const setTab = useAppStore((s) => s.setTab);

  return (
    <View style={{ backgroundColor: colors.black, flexDirection: isArabic ? 'row-reverse' : 'row', paddingBottom: Math.max(insets.bottom, 14), borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,.08)' }}>
      {TABS.map((k, i) => {
        const on = tab === k;
        const color = on ? colors.gold : '#8E8E93';
        return (
          <Pressable key={k} onPress={() => setTab(k)} style={{ flex: 1, alignItems: 'center', paddingTop: 12, paddingBottom: 10, minHeight: 60 }}>
            <View style={{ position: 'absolute', top: 0, width: 28, height: 2, backgroundColor: on ? colors.gold : 'transparent' }} />
            <View
              style={{
                width: 14,
                height: 14,
                marginBottom: 8,
                borderRadius: 3,
                borderWidth: 1.5,
                borderColor: on ? colors.gold : '#6E6E72',
                backgroundColor: on ? colors.gold : 'transparent',
                transform: [{ rotate: '45deg' }],
              }}
            />
            <Text style={textStyle({ weight: 600, size: isArabic ? 11 : 9.5, color, isArabic, trackingPx: 1.2 })}>{t.nav[i]}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}
