import React from 'react';
import { View, StyleSheet, DimensionValue } from 'react-native';

interface Dot {
  left: DimensionValue;
  top: DimensionValue;
  size: number;
  color: string;
}

const PRESETS: Record<string, Dot[]> = {
  auth: [
    { left: '18%', top: '16%', size: 3, color: 'rgba(255,255,255,.55)' },
    { left: '74%', top: '26%', size: 2, color: 'rgba(160,190,255,.5)' },
    { left: '40%', top: '62%', size: 2, color: 'rgba(255,255,255,.4)' },
    { left: '86%', top: '74%', size: 3, color: 'rgba(255,255,255,.32)' },
    { left: '24%', top: '88%', size: 2, color: 'rgba(160,190,255,.4)' },
  ],
  header: [
    { left: '14%', top: '60%', size: 2, color: 'rgba(255,255,255,.5)' },
    { left: '62%', top: '34%', size: 2, color: 'rgba(160,190,255,.45)' },
    { left: '86%', top: '74%', size: 3, color: 'rgba(255,255,255,.35)' },
  ],
  hero: [
    { left: '18%', top: '18%', size: 3, color: 'rgba(255,255,255,.55)' },
    { left: '74%', top: '26%', size: 2, color: 'rgba(160,190,255,.5)' },
    { left: '40%', top: '62%', size: 2, color: 'rgba(255,255,255,.4)' },
    { left: '88%', top: '70%', size: 3, color: 'rgba(255,255,255,.32)' },
  ],
  account: [
    { left: '16%', top: '12%', size: 3, color: 'rgba(255,255,255,.5)' },
    { left: '72%', top: '30%', size: 2, color: 'rgba(160,190,255,.45)' },
    { left: '34%', top: '56%', size: 2, color: 'rgba(255,255,255,.35)' },
    { left: '84%', top: '78%', size: 3, color: 'rgba(255,255,255,.3)' },
  ],
};

export default function Starfield({ variant }: { variant: keyof typeof PRESETS }) {
  const dots = PRESETS[variant];
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {dots.map((d, i) => (
        <View
          key={i}
          style={{
            position: 'absolute',
            left: d.left,
            top: d.top,
            width: d.size,
            height: d.size,
            borderRadius: d.size,
            backgroundColor: d.color,
          }}
        />
      ))}
    </View>
  );
}
