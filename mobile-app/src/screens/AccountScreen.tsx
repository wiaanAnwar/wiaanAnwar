import React from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { colors } from '../theme/colors';
import { textStyle } from '../theme/text';
import { useI18n } from '../i18n/useI18n';
import { useAppStore } from '../store/useAppStore';
import { accountTypeLabel, initialsOf, BV_CONTACT, BV_LEGAL, TRUSTED_BY } from '../data/account';
import { useCatalogStore } from '../store/useCatalogStore';
import { dateLabel } from '../utils/dates';
import Starfield from '../components/Starfield';
import { Eyebrow } from '../components/Labels';
import GradientRule from '../components/GradientRule';

export default function AccountScreen() {
  const { t, lang, isArabic } = useI18n();
  const accountType = useAppStore((s) => s.accountType);
  const account = useAppStore((s) => s.account);
  const documents = useAppStore((s) => s.documents);
  const currency = useAppStore((s) => s.currency);
  const setCurrency = useAppStore((s) => s.setCurrency);
  const toggleLang = useAppStore((s) => s.toggleLang);
  const showToast = useAppStore((s) => s.showToast);
  const signOut = useAppStore((s) => s.signOut);
  const openDocuments = useAppStore((s) => s.openDocuments);
  const approvers = useCatalogStore((s) => s.approvers);
  const payMethods = useCatalogStore((s) => s.payMethods);

  const name = isArabic ? account.nameAr : account.name;
  const typeLabel = accountTypeLabel(accountType, isArabic);
  const contractRef = isArabic ? account.contractRefAr : account.contractRef;
  const outstandingDocs = documents.filter((d) => d.status === 'outstanding').length;
  const settledDocs = documents.filter((d) => d.status === 'settled').length;

  const rows = [
    { title: isArabic ? 'الأسعار والاتفاقية' : 'Rates & agreement', sub: contractRef, trail: '›', go: () => showToast(isArabic ? 'قائمة الأسعار PDF' : 'Rate card opens as a PDF') },
    { title: isArabic ? 'الفواتير والمستندات' : 'Invoices & documents', sub: isArabic ? `${outstandingDocs} غير مسددة · ${settledDocs} مسددة` : `${outstandingDocs} outstanding · ${settledDocs} settled`, trail: '›', go: openDocuments },
    { title: isArabic ? 'المعتمِدون' : 'Approvers', sub: isArabic ? `${approvers.length} أشخاص يعتمدون الطلبات` : `${approvers.length} people can sign off requests`, trail: '›', go: () => showToast(isArabic ? 'يديرها المسؤول المالي' : 'Managed by your finance focal point') },
    { title: isArabic ? 'طرق الدفع' : 'Payment methods', sub: payMethods.map((p) => (isArabic ? p.ar : p.en)).join(' · '), trail: '›', go: () => showToast(isArabic ? 'إعدادات الدفع' : 'Payment settings') },
    { title: t.language, sub: isArabic ? 'العربية' : 'English', trail: isArabic ? 'EN' : 'ع', go: toggleLang },
    { title: t.currency, sub: currency, trail: currency === 'USD' ? 'SDG' : 'USD', go: () => setCurrency(currency === 'USD' ? 'SDG' : 'USD') },
    { title: isArabic ? 'الإشعارات' : 'Notifications', sub: isArabic ? 'رسائل وبريد عند التأكيد' : 'Push and email on confirmation', trail: '›', go: () => showToast(isArabic ? 'إعدادات الإشعارات' : 'Notification settings') },
    { title: isArabic ? 'تابعنا' : 'Follow BV', sub: 'Facebook · Instagram', trail: '›', go: () => showToast(isArabic ? 'فتح صفحة BV' : 'Opening BV Bavarian on Facebook') },
  ];

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.black }} contentContainerStyle={{ paddingBottom: 26 }}>
      <View style={{ overflow: 'hidden' }}>
        <Starfield variant="account" />
        <View style={{ padding: 16, paddingTop: 18 }}>
          <Eyebrow tone="gold">BV BAVARIAN</Eyebrow>
          <Text style={[textStyle({ weight: 700, size: 22, color: '#fff', isArabic, trackingPx: -0.6 }), { marginTop: 6 }]}>{t.account}</Text>
          <View style={{ marginTop: 10, marginBottom: 16 }}>
            <GradientRule width={56} height={2} />
          </View>

          <View style={{ backgroundColor: colors.blackPanel, borderRadius: 12, padding: 16 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <View style={{ width: 46, height: 46, borderRadius: 9, backgroundColor: colors.gold, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontWeight: '700', fontSize: 14, color: colors.ink }}>{initialsOf(name)}</Text>
              </View>
              <View style={{ flex: 1, minWidth: 0 }}>
                <Text numberOfLines={1} style={textStyle({ weight: 600, size: 15, color: '#fff', isArabic, trackingPx: -0.3 })}>{name}</Text>
                <Text numberOfLines={1} style={[textStyle({ weight: 300, size: 11, color: colors.onDarkSoft, isArabic }), { marginTop: 3 }]}>{typeLabel}</Text>
              </View>
            </View>
            <View style={{ height: 1, backgroundColor: 'rgba(255,255,255,.1)', marginVertical: 14 }} />
            <View style={{ flexDirection: 'row' }}>
              <View style={{ flex: 1 }}>
                <Text style={[textStyle({ weight: 500, size: 12.5, color: colors.gold, isArabic })]}>{contractRef}</Text>
                <Text style={[textStyle({ weight: 300, size: 11, color: colors.onDarkSoft, isArabic }), { marginTop: 3 }]}>{t.agreement}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={textStyle({ weight: 500, size: 12.5, color: '#fff', isArabic: false })}>
                  {account.validUntil ? `${dateLabel(new Date(account.validUntil), lang)} ${new Date(account.validUntil).getFullYear()}` : '—'}
                </Text>
                <Text style={[textStyle({ weight: 300, size: 11, color: colors.onDarkSoft, isArabic }), { marginTop: 3 }]}>{t.validUntil}</Text>
              </View>
            </View>
          </View>

          <View style={{ backgroundColor: colors.blackPanel, borderRadius: 12, marginTop: 12, overflow: 'hidden' }}>
            {rows.map((r, i) => (
              <Pressable
                key={i}
                onPress={r.go}
                style={{ minHeight: 56, padding: 13, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 10, borderBottomWidth: i === rows.length - 1 ? 0 : 1, borderBottomColor: 'rgba(255,255,255,.07)' }}
              >
                <View style={{ flex: 1 }}>
                  <Text style={textStyle({ weight: 500, size: 13, color: '#fff', isArabic })}>{r.title}</Text>
                  <Text style={[textStyle({ weight: 300, size: 11, color: colors.onDarkSoft, isArabic }), { marginTop: 3 }]}>{r.sub}</Text>
                </View>
                <Text style={textStyle({ weight: 400, size: 13, color: colors.gold, isArabic: false })}>{r.trail}</Text>
              </Pressable>
            ))}
          </View>

          <View style={{ marginTop: 20 }}>
            <Text style={textStyle({ weight: 600, size: 14, color: '#fff', isArabic })}>{t.businessHours}</Text>
            <View style={{ flexDirection: 'row', marginTop: 12 }}>
              <Text style={[textStyle({ weight: 300, size: 12, color: colors.onDarkSoft, isArabic }), { flex: 1 }]}>{t.satThu}</Text>
              <Text style={textStyle({ weight: 400, size: 12, color: '#fff', isArabic: false })}>{BV_CONTACT.hours.satThu}</Text>
            </View>
            <View style={{ flexDirection: 'row', marginTop: 7 }}>
              <Text style={[textStyle({ weight: 300, size: 12, color: colors.onDarkSoft, isArabic }), { flex: 1 }]}>{t.friday}</Text>
              <Text style={textStyle({ weight: 500, size: 12, color: colors.coral, isArabic })}>{t.closed}</Text>
            </View>
          </View>

          <View style={{ marginTop: 20, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,.1)', paddingTop: 16, gap: 12 }}>
            <View style={{ flexDirection: 'row', gap: 10, alignItems: 'flex-start' }}>
              <Text style={{ width: 16, textAlign: 'center', color: colors.coral, fontSize: 12 }}>◉</Text>
              <Text style={[textStyle({ weight: 300, size: 11.5, color: colors.onDarkSoft, isArabic, lineHeight: 18 }), { flex: 1 }]}>{isArabic ? BV_CONTACT.addressAr : BV_CONTACT.addressEn}</Text>
            </View>
            <View style={{ flexDirection: 'row', gap: 10, alignItems: 'flex-start' }}>
              <Text style={{ width: 16, textAlign: 'center', color: colors.coral, fontSize: 12 }}>✆</Text>
              <Text style={{ fontWeight: '500', fontSize: 11.5, lineHeight: 18, color: '#fff' }}>{BV_CONTACT.phones.join('\n')}</Text>
            </View>
            <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
              <Text style={{ width: 16, textAlign: 'center', color: colors.coral, fontSize: 12 }}>✉</Text>
              <Text style={{ fontWeight: '300', fontSize: 11.5, color: colors.onDarkSoft }}>{BV_CONTACT.email}</Text>
            </View>
          </View>

          <View style={{ marginTop: 20, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,.1)', paddingTop: 16 }}>
            <Text style={[textStyle({ weight: 600, size: 9.5, color: colors.onDarkFaint, isArabic, trackingPx: 1.6, uppercase: true }), { marginBottom: 11 }]}>
              {isArabic ? 'من عملائنا' : 'Trusted by'}
            </Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 7 }}>
              {TRUSTED_BY.map((name) => (
                <View key={name} style={{ backgroundColor: 'rgba(255,255,255,.08)', borderRadius: 100, paddingHorizontal: 11, paddingVertical: 6 }}>
                  <Text style={textStyle({ weight: 500, size: 10.5, color: colors.onDarkSoft, isArabic: false })}>{name}</Text>
                </View>
              ))}
            </View>
            <Text style={[textStyle({ weight: 300, size: 10.5, color: colors.onDarkSoft, isArabic }), { marginTop: 11 }]}>
              {isArabic ? 'أكثر من ٨٠٠٠ عميل دولي منذ ٢٠١٦' : '8,000+ international clients since 2016'}
            </Text>
          </View>

          <Pressable onPress={signOut} style={{ width: '100%', minHeight: 48, marginTop: 20, borderRadius: 8, borderWidth: 1, borderColor: 'rgba(255,255,255,.18)', alignItems: 'center', justifyContent: 'center' }}>
            <Text style={textStyle({ weight: 600, size: 12.5, color: '#fff', isArabic })}>{t.signOut}</Text>
          </Pressable>
          <Text style={[textStyle({ weight: 300, size: 10, color: '#8E8E93', isArabic }), { textAlign: 'center', marginTop: 16, lineHeight: 15 }]}>
            {isArabic ? BV_LEGAL.entityAr : BV_LEGAL.entityEn} · {isArabic ? 'سجل تجاري رقم' : 'Reg. No.'} {BV_LEGAL.registrationNo}
            {'\n'}© 2026 BV Bavarian Rent A Car · v2.0.0
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}
