import React from 'react';
import { Pressable, View } from 'react-native';
import { colors } from '../theme/colors';
import { useI18n } from '../i18n/useI18n';

export default function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  const { isArabic } = useI18n();
  return (
    <Pressable
      onPress={onToggle}
      style={{
        width: 42,
        height: 24,
        borderRadius: 100,
        padding: 3,
        backgroundColor: on ? colors.primary : '#D2D2D5',
        justifyContent: 'center',
      }}
    >
      <View
        style={{
          width: 18,
          height: 18,
          borderRadius: 100,
          backgroundColor: '#fff',
          transform: [{ translateX: on ? (isArabic ? -18 : 18) : 0 }],
        }}
      />
    </Pressable>
  );
}
