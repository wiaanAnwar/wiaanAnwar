import React from 'react';
import { Pressable, Text, ActivityIndicator, ViewStyle, StyleProp } from 'react-native';
import { colors } from '../theme/colors';
import { textStyle } from '../theme/text';
import { useI18n } from '../i18n/useI18n';

interface BtnProps {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function PrimaryButton({ label, onPress, disabled, loading, style }: BtnProps) {
  const { isArabic } = useI18n();
  return (
    <Pressable
      disabled={disabled || loading}
      onPress={onPress}
      style={[
        {
          minHeight: 50,
          borderRadius: 7,
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'row',
          backgroundColor: loading ? '#A8A8AC' : disabled ? '#B9B9BC' : colors.primary,
        },
        style,
      ]}
    >
      {loading && <ActivityIndicator size="small" color="#fff" style={{ marginEnd: 9 }} />}
      <Text style={textStyle({ weight: 600, size: 13.5, color: '#fff', isArabic })}>{label}</Text>
    </Pressable>
  );
}

export function OutlineButton({ label, onPress, disabled, style, danger }: BtnProps & { danger?: boolean }) {
  const { isArabic } = useI18n();
  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      style={[
        {
          minHeight: 44,
          borderRadius: 7,
          alignItems: 'center',
          justifyContent: 'center',
          borderWidth: 1,
          borderColor: danger ? '#F0C9C7' : colors.inputBorder,
          backgroundColor: '#fff',
        },
        style,
      ]}
    >
      <Text style={textStyle({ weight: 600, size: 11.5, color: danger ? colors.danger : colors.ink, isArabic })}>{label}</Text>
    </Pressable>
  );
}

export function GoldPillButton({ label, onPress, style }: BtnProps) {
  const { isArabic } = useI18n();
  return (
    <Pressable
      onPress={onPress}
      style={[{ minHeight: 44, minWidth: 44, paddingHorizontal: 15, borderRadius: 100, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.gold }, style]}
    >
      <Text style={textStyle({ weight: 600, size: 11.5, color: colors.ink, isArabic })}>{label}</Text>
    </Pressable>
  );
}

export function DarkGhostButton({ label, onPress, style }: BtnProps) {
  const { isArabic } = useI18n();
  return (
    <Pressable
      onPress={onPress}
      style={[
        { flex: 1, minHeight: 44, borderRadius: 7, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,.22)' },
        style,
      ]}
    >
      <Text style={textStyle({ weight: 600, size: 12.5, color: '#fff', isArabic })}>{label}</Text>
    </Pressable>
  );
}
