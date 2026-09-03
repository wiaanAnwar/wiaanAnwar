import React from 'react';
import { Pressable, View, Text } from 'react-native';
import { colors } from '../theme/colors';
import { textStyle } from '../theme/text';
import { useI18n } from '../i18n/useI18n';

export default function RadioRow({
  title,
  sub,
  selected,
  onPress,
  last,
}: {
  title: string;
  sub: string;
  selected: boolean;
  onPress: () => void;
  last?: boolean;
}) {
  const { isArabic } = useI18n();
  return (
    <Pressable
      onPress={onPress}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 11,
        minHeight: 56,
        paddingHorizontal: 15,
        paddingVertical: 12,
        borderBottomWidth: last ? 0 : 1,
        borderBottomColor: colors.hairline,
        backgroundColor: selected ? '#FFFBF0' : '#fff',
      }}
    >
      <View
        style={{
          width: 18,
          height: 18,
          borderRadius: 100,
          borderWidth: selected ? 5 : 1.5,
          borderColor: selected ? colors.primary : '#C4C4C8',
        }}
      />
      <View style={{ flex: 1 }}>
        <Text style={textStyle({ weight: 500, size: 12.5, color: colors.ink, isArabic })}>{title}</Text>
        <Text style={[textStyle({ weight: 300, size: 10.5, color: colors.slate, isArabic }), { marginTop: 2 }]}>{sub}</Text>
      </View>
    </Pressable>
  );
}
