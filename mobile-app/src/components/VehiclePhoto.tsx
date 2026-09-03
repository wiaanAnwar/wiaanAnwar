import React from 'react';
import { View, Text, ViewStyle } from 'react-native';
import { textStyle } from '../theme/text';

// Stand-in for real vehicle photography (none was supplied — see known limitations).
export default function VehiclePhoto({ label, style, dark }: { label: string; style?: ViewStyle; dark?: boolean }) {
  return (
    <View
      style={[
        { backgroundColor: dark ? '#1F1F21' : '#EDEDED', alignItems: 'center', justifyContent: 'flex-end', overflow: 'hidden' },
        style,
      ]}
    >
      <Text style={{ fontSize: dark ? 34 : 22, opacity: 0.35, position: 'absolute', top: '38%' }}>🚗</Text>
      <Text
        numberOfLines={1}
        style={[
          textStyle({ weight: 400, size: dark ? 8.5 : 7.5, color: dark ? '#9B9B9F' : '#8A8A8E', isArabic: false, trackingPx: 0.6 }),
          { textAlign: 'center', paddingHorizontal: 4, marginBottom: 5 },
        ]}
      >
        {label}
      </Text>
    </View>
  );
}
