import React from 'react';
import { View, Text, Pressable, FlatList } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import { textStyle } from '../theme/text';
import { useI18n } from '../i18n/useI18n';
import { useAppStore } from '../store/useAppStore';
import { useCash } from '../utils/useCash';
import { dateLabel } from '../utils/dates';
import { DocumentRecord } from '../data/documents';

const STATUS_COPY: Record<DocumentRecord['status'], { en: string; ar: string; fg: string; bg: string }> = {
  outstanding: { en: 'Outstanding', ar: 'غير مسددة', fg: colors.ink, bg: colors.gold },
  settled: { en: 'Settled', ar: 'مسددة', fg: colors.slate, bg: '#EDEDED' },
  active: { en: 'Active', ar: 'سارية', fg: '#fff', bg: colors.success },
};

export default function DocumentsSheet() {
  const insets = useSafeAreaInsets();
  const { lang, isArabic } = useI18n();
  const cash = useCash();
  const closeDocuments = useAppStore((s) => s.closeDocuments);
  const showToast = useAppStore((s) => s.showToast);
  const documents = useAppStore((s) => s.documents);
  const chev = isArabic ? '›' : '‹';

  const outstanding = documents.filter((d) => d.status === 'outstanding').length;
  const settled = documents.filter((d) => d.status === 'settled').length;

  return (
    <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: colors.sheetBg, zIndex: 24 }}>
      <View style={{ backgroundColor: colors.black, paddingTop: insets.top + 10, paddingBottom: 14, paddingHorizontal: 16, flexDirection: isArabic ? 'row-reverse' : 'row', alignItems: 'center', gap: 11 }}>
        <Pressable onPress={closeDocuments} style={{ width: 44, height: 44, borderRadius: 100, borderWidth: 1, borderColor: 'rgba(255,255,255,.22)', alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ color: '#fff', fontSize: 15 }}>{chev}</Text>
        </Pressable>
        <View style={{ flex: 1 }}>
          <Text style={textStyle({ weight: 600, size: 14, color: '#fff', isArabic, trackingPx: -0.3 })}>
            {isArabic ? 'الفواتير والمستندات' : 'Invoices & documents'}
          </Text>
          <Text style={[textStyle({ weight: 300, size: 10.5, color: colors.onDarkSoft, isArabic }), { marginTop: 2 }]}>
            {isArabic ? `${outstanding} غير مسددة · ${settled} مسددة` : `${outstanding} outstanding · ${settled} settled`}
          </Text>
        </View>
      </View>

      <FlatList
        data={documents}
        keyExtractor={(d) => d.id}
        contentContainerStyle={{ padding: 16, gap: 10 }}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        renderItem={({ item }) => {
          const status = STATUS_COPY[item.status];
          return (
            <Pressable
              onPress={() => showToast(isArabic ? `فتح ${item.ref} بصيغة PDF` : `Opening ${item.ref} as a PDF`)}
              style={{ backgroundColor: '#fff', borderWidth: 1, borderColor: colors.cardBorder, borderRadius: 10, padding: 14 }}
            >
              <View style={{ flexDirection: isArabic ? 'row-reverse' : 'row', alignItems: 'center', gap: 8 }}>
                <Text style={{ fontSize: 9.5, fontWeight: '600', color: status.fg, backgroundColor: status.bg, paddingHorizontal: 9, paddingVertical: 5, borderRadius: 100 }}>
                  {isArabic ? status.ar : status.en}
                </Text>
                <View style={{ flex: 1 }} />
                <Text style={textStyle({ weight: 400, size: 10.5, color: colors.slate, isArabic: false })}>{item.ref}</Text>
              </View>
              <Text style={[textStyle({ weight: 600, size: 13.5, color: colors.ink, isArabic, lineHeight: 18 }), { marginTop: 9 }]}>
                {isArabic ? item.titleAr : item.titleEn}
              </Text>
              <View style={{ flexDirection: isArabic ? 'row-reverse' : 'row', alignItems: 'baseline', marginTop: 6 }}>
                <Text style={[textStyle({ weight: 300, size: 11, color: colors.slate, isArabic }), { flex: 1 }]}>{dateLabel(item.date, lang)}</Text>
                {item.amountUsd !== undefined && (
                  <Text style={textStyle({ weight: 700, size: 14, color: colors.ink, isArabic, trackingPx: -0.3 })}>{cash(item.amountUsd)}</Text>
                )}
              </View>
            </Pressable>
          );
        }}
      />
    </View>
  );
}
