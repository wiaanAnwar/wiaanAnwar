import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import { textStyle } from '../theme/text';
import { useI18n } from '../i18n/useI18n';
import { useAppStore } from '../store/useAppStore';
import { OutlineButton, PrimaryButton } from '../components/Buttons';

export default function CancelSheet() {
  const insets = useSafeAreaInsets();
  const { t, isArabic } = useI18n();
  const cancelTarget = useAppStore((s) => s.cancelTarget);
  const dismissCancel = useAppStore((s) => s.dismissCancel);
  const confirmCancel = useAppStore((s) => s.confirmCancel);

  if (!cancelTarget) return null;

  return (
    <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: colors.overlay, justifyContent: 'flex-end', zIndex: 30 }}>
      <Pressable style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} onPress={dismissCancel} />
      <View style={{ backgroundColor: '#fff', borderTopLeftRadius: 16, borderTopRightRadius: 16, padding: 22, paddingBottom: insets.bottom + 24 }}>
        <Text style={textStyle({ weight: 700, size: 18, color: colors.ink, isArabic, trackingPx: -0.5 })}>{t.cancelTitle}</Text>
        <Text style={[textStyle({ weight: 300, size: 12.5, color: colors.slate, isArabic, lineHeight: 19 }), { marginTop: 8 }]}>
          {(isArabic ? 'الحجز ' : 'Booking ') + cancelTarget + (isArabic ? ' سيُلغى وسيُخطر مكتب BV.' : ' will be withdrawn and BV dispatch notified.')}
        </Text>
        <View style={{ backgroundColor: colors.sheetBg, borderRadius: 9, padding: 12, paddingHorizontal: 14, marginTop: 14 }}>
          <Text style={[textStyle({ weight: 600, size: 8.5, color: '#6E6E72', isArabic, trackingPx: 1.4, uppercase: true })]}>{t.cancellation}</Text>
          <Text style={[textStyle({ weight: 300, size: 11.5, color: '#3E3E42', isArabic, lineHeight: 17 }), { marginTop: 5 }]}>{t.cancelPolicy}</Text>
        </View>
        <View style={{ flexDirection: 'row', gap: 9, marginTop: 16 }}>
          <OutlineButton label={t.keepBooking} onPress={dismissCancel} style={{ flex: 1, minHeight: 48 }} />
          <PrimaryButton label={t.confirmCancel} onPress={confirmCancel} style={{ flex: 1, minHeight: 48 }} />
        </View>
      </View>
    </View>
  );
}
