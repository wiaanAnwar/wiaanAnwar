import React from 'react';
import { View, Text, TextInput, KeyboardAvoidingView, Platform, ScrollView, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import { textStyle } from '../theme/text';
import { useI18n } from '../i18n/useI18n';
import { useAppStore } from '../store/useAppStore';
import Starfield from '../components/Starfield';
import GradientRule from '../components/GradientRule';
import { PrimaryButton } from '../components/Buttons';

export default function AuthScreen() {
  const insets = useSafeAreaInsets();
  const { t, isArabic } = useI18n();
  const authStep = useAppStore((s) => s.authStep);
  const phone = useAppStore((s) => s.phone);
  const code = useAppStore((s) => s.code);
  const setPhone = useAppStore((s) => s.setPhone);
  const setCode = useAppStore((s) => s.setCode);
  const sendCode = useAppStore((s) => s.sendCode);
  const verifyCode = useAppStore((s) => s.verifyCode);
  const backToPhone = useAppStore((s) => s.backToPhone);
  const guestMode = useAppStore((s) => s.guestMode);

  const inputStyle = {
    width: '100%' as const,
    borderRadius: 8,
    minHeight: 50,
    paddingHorizontal: 14,
    color: '#fff',
    backgroundColor: colors.blackPanel,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,.14)',
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: colors.black }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={{ flex: 1 }}>
        <Starfield variant="auth" />
        <ScrollView contentContainerStyle={{ flexGrow: 1, paddingTop: insets.top + 40, paddingBottom: insets.bottom + 24, paddingHorizontal: 22, justifyContent: 'center' }} keyboardShouldPersistTaps="handled">
          <View style={{ alignItems: 'center' }}>
            <Text style={textStyle({ weight: 700, size: 40, color: colors.gold, isArabic: false, trackingPx: -1.2 })}>BV</Text>
            <Text style={[textStyle({ weight: 600, size: 11, color: '#fff', isArabic: false, trackingPx: 3 }), { marginTop: 6 }]}>BAVARIAN</Text>
          </View>
          <View style={{ alignItems: 'center', marginTop: 26 }}>
            <GradientRule width={64} height={3} />
          </View>
          <View style={{ alignItems: 'center', marginTop: 26 }}>
            <Text style={textStyle({ weight: 700, size: 22, color: '#fff', isArabic, trackingPx: -0.6 })}>{t.signIn}</Text>
            <Text style={[textStyle({ weight: 300, size: 12.5, color: colors.onDarkSoft, isArabic }), { marginTop: 7 }]}>{t.signInSub}</Text>
          </View>

          {authStep === 'phone' ? (
            <View style={{ marginTop: 26 }}>
              <Text style={[textStyle({ weight: 600, size: 9.5, color: colors.onDarkSoft, isArabic, trackingPx: 1.6, uppercase: true }), { marginBottom: 9 }]}>{t.phone}</Text>
              <TextInput
                value={phone}
                onChangeText={setPhone}
                placeholder="09xx xxx xxx"
                placeholderTextColor="#9B9B9F"
                keyboardType="phone-pad"
                style={[inputStyle, textStyle({ weight: 400, size: 15, color: '#fff', isArabic: false })]}
                textAlign={isArabic ? 'right' : 'left'}
              />
              <PrimaryButton label={t.sendCode} onPress={sendCode} style={{ marginTop: 14 }} />
              <Pressable onPress={guestMode} style={{ minHeight: 44, alignItems: 'center', justifyContent: 'center', marginTop: 10 }}>
                <Text style={textStyle({ weight: 400, size: 12.5, color: colors.onDarkSoft, isArabic })}>{t.guest}</Text>
              </Pressable>
            </View>
          ) : (
            <View style={{ marginTop: 26 }}>
              <Text style={[textStyle({ weight: 600, size: 9.5, color: colors.onDarkSoft, isArabic, trackingPx: 1.6, uppercase: true }), { marginBottom: 9 }]}>{t.enterCode}</Text>
              <TextInput
                value={code}
                onChangeText={setCode}
                placeholder="0000"
                placeholderTextColor="#9B9B9F"
                keyboardType="number-pad"
                maxLength={4}
                style={[inputStyle, { minHeight: 56, textAlign: 'center' }, textStyle({ weight: 600, size: 24, color: '#fff', isArabic: false, trackingPx: 8 })]}
              />
              <Text style={[textStyle({ weight: 300, size: 11.5, color: colors.onDarkSoft, isArabic }), { textAlign: 'center', marginTop: 10 }]}>
                {(isArabic ? 'أُرسل الرمز إلى ' : 'Code sent to ') + (phone || '09xx xxx xxx')}
              </Text>
              <PrimaryButton label={t.verify} onPress={verifyCode} style={{ marginTop: 14 }} />
              <Pressable onPress={backToPhone} style={{ minHeight: 44, alignItems: 'center', justifyContent: 'center', marginTop: 10 }}>
                <Text style={textStyle({ weight: 400, size: 12.5, color: colors.onDarkSoft, isArabic })}>{t.changeNumber}</Text>
              </Pressable>
            </View>
          )}
        </ScrollView>
        <Text style={[textStyle({ weight: 300, size: 10.5, color: '#8E8E93', isArabic, lineHeight: 17 }), { textAlign: 'center', paddingHorizontal: 22, paddingBottom: insets.bottom + 16 }]}>
          {t.authFooter}
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}
