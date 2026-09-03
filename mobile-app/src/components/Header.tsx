import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import { textStyle } from '../theme/text';
import { useI18n } from '../i18n/useI18n';
import { useAppStore } from '../store/useAppStore';
import { accountTypeLabel, BV_CONTACT } from '../data/account';
import Starfield from './Starfield';
import GradientRule from './GradientRule';

export default function Header() {
  const insets = useSafeAreaInsets();
  const { t, isArabic } = useI18n();
  const toggleLang = useAppStore((s) => s.toggleLang);
  const showToast = useAppStore((s) => s.showToast);
  const accountType = useAppStore((s) => s.accountType);
  const account = useAppStore((s) => s.account);

  return (
    <View style={{ backgroundColor: colors.black, overflow: 'hidden' }}>
      <Starfield variant="header" />
      <View style={{ paddingTop: insets.top + 10, paddingBottom: 12, paddingHorizontal: 16, flexDirection: isArabic ? 'row-reverse' : 'row', alignItems: 'center', gap: 12 }}>
        <View style={{ alignItems: 'center' }}>
          <Text style={textStyle({ weight: 700, size: 21, color: colors.gold, isArabic: false, trackingPx: -0.4 })}>BV</Text>
          <Text style={[textStyle({ weight: 600, size: 7.5, color: '#fff', isArabic: false, trackingPx: 1.4 }), { marginTop: 2 }]}>BAVARIAN</Text>
        </View>
        <View style={{ width: 1, height: 26, backgroundColor: 'rgba(255,255,255,.16)' }} />
        <View style={{ flex: 1, minWidth: 0 }}>
          <Text numberOfLines={1} style={textStyle({ weight: 500, size: 12.5, color: '#fff', isArabic })}>
            {isArabic ? account.nameAr : account.name}
          </Text>
          <Text numberOfLines={1} style={[textStyle({ weight: 300, size: 10.5, color: colors.onDarkSoft, isArabic }), { marginTop: 1 }]}>
            {accountTypeLabel(accountType, isArabic)}
          </Text>
        </View>
        <Pressable
          onPress={toggleLang}
          style={{ minWidth: 46, height: 44, paddingHorizontal: 10, borderRadius: 100, borderWidth: 1, borderColor: 'rgba(255,255,255,.22)', alignItems: 'center', justifyContent: 'center' }}
        >
          <Text style={textStyle({ weight: 600, size: 11, color: '#fff', isArabic: false })}>{isArabic ? 'EN' : 'ع'}</Text>
        </Pressable>
        <Pressable
          onPress={() => showToast((isArabic ? 'اتصال بـ BV · ' : 'Calling BV Bavarian · ') + BV_CONTACT.phones[0])}
          style={{ height: 44, paddingHorizontal: 15, borderRadius: 100, backgroundColor: colors.gold, alignItems: 'center', justifyContent: 'center' }}
        >
          <Text style={textStyle({ weight: 600, size: 11.5, color: colors.ink, isArabic })}>{t.callNow}</Text>
        </Pressable>
      </View>
      <GradientRule />
    </View>
  );
}
