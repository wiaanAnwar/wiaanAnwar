import React from 'react';
import { View, Text, TextInput } from 'react-native';
import { colors } from '../../theme/colors';
import { textStyle } from '../../theme/text';
import { useI18n } from '../../i18n/useI18n';
import { useAppStore } from '../../store/useAppStore';
import { useCatalogStore } from '../../store/useCatalogStore';
import { Eyebrow } from '../../components/Labels';
import RadioRow from '../../components/RadioRow';

export default function Step3Billing() {
  const { t, isArabic } = useI18n();
  const accountType = useAppStore((s) => s.accountType);
  const org = useAppStore((s) => s.org);
  const code2 = useAppStore((s) => s.code2);
  const po = useAppStore((s) => s.po);
  const setOrgField = useAppStore((s) => s.setOrgField);
  const touched = useAppStore((s) => s.touched);
  const approverIdx = useAppStore((s) => s.approverIdx);
  const setApproverIdx = useAppStore((s) => s.setApproverIdx);
  const APPROVERS = useCatalogStore((s) => s.approvers);

  const isOrg = accountType === 'UN & INGO' || accountType === 'Business';

  const fields =
    accountType === 'Individual'
      ? [
          { key: 'org' as const, label: t.fullName, ph: isArabic ? 'كما في الرخصة' : 'As shown on your licence', hint: isArabic ? 'أحضر الرخصة والهوية عند الاستلام.' : 'Bring your licence and ID to pickup.' },
          { key: 'code2' as const, label: t.mobile, ph: '09xx xxx xxx', hint: isArabic ? 'تتصل BV بهذا الرقم للتأكيد.' : 'BV calls this number to confirm.' },
        ]
      : accountType === 'Business'
      ? [
          { key: 'org' as const, label: t.company, ph: isArabic ? 'الاسم التجاري المسجل' : 'Registered trading name', hint: isArabic ? 'يجب أن يطابق الاسم في الحساب.' : 'Must match the name on the account.' },
          { key: 'code2' as const, label: t.costCentre, ph: 'OPS-LOG-04', hint: isArabic ? 'يظهر في بند الفاتورة.' : 'Appears on the invoice line.' },
          { key: 'po' as const, label: t.poRefOpt, ph: 'PO-88412', hint: isArabic ? 'أضفه إذا طلبته إدارة المالية.' : 'Add one if your finance team requires it.' },
        ]
      : [
          { key: 'org' as const, label: t.org, ph: 'UNHCR — Sudan Operation', hint: isArabic ? 'تُفوتر على الاتفاقية الإطارية.' : 'Billed to your framework agreement.' },
          { key: 'code2' as const, label: t.projectCode, ph: 'SDN-24-KRT-118', hint: isArabic ? 'مطلوب لكل حجوزات المنظمات.' : 'Required for all agency hires.' },
          { key: 'po' as const, label: t.poRef, ph: 'PO-2026-4417', hint: isArabic ? 'يُدرج في الفاتورة المرسلة للمالية.' : 'Quoted on the invoice raised to finance.' },
        ];

  const values: Record<string, string> = { org, code2, po };

  return (
    <View style={{ gap: 18 }}>
      {fields.map((f) => {
        const bad = touched && (f.key === 'org' || f.key === 'code2') && !values[f.key].trim();
        return (
          <View key={f.key}>
            <Text style={[textStyle({ weight: 600, size: 8.5, color: '#6E6E72', isArabic, trackingPx: 1.4, uppercase: true }), { marginBottom: 4 }]}>{f.label}</Text>
            <TextInput
              value={values[f.key]}
              onChangeText={(v) => setOrgField(f.key, v)}
              placeholder={f.ph}
              placeholderTextColor="#9B9B9F"
              textAlign={isArabic ? 'right' : 'left'}
              style={[
                textStyle({ weight: 400, size: 13, color: colors.ink, isArabic }),
                { width: '100%', borderRadius: 8, minHeight: 48, paddingHorizontal: 14, backgroundColor: '#fff', borderWidth: 1, borderColor: bad ? colors.red : colors.cardBorder2 },
              ]}
            />
            <Text style={[textStyle({ weight: 300, size: 10.5, color: bad ? colors.danger : '#6E6E72', isArabic }), { marginTop: 7 }]}>{bad ? t.required : f.hint}</Text>
          </View>
        );
      })}

      {isOrg && (
        <View>
          <Eyebrow>{t.approver}</Eyebrow>
          <Text style={[textStyle({ weight: 300, size: 11, color: colors.slate, isArabic, lineHeight: 17 }), { marginTop: 7, marginBottom: 10 }]}>{t.approverSub}</Text>
          <View style={{ backgroundColor: '#fff', borderWidth: 1, borderColor: colors.cardBorder, borderRadius: 10, overflow: 'hidden' }}>
            {APPROVERS.map((a, i) => (
              <RadioRow
                key={i}
                title={isArabic ? a.ar : a.en}
                sub={isArabic ? a.arRole : a.enRole}
                selected={i === approverIdx}
                onPress={() => setApproverIdx(i)}
                last={i === APPROVERS.length - 1}
              />
            ))}
          </View>
        </View>
      )}
    </View>
  );
}
