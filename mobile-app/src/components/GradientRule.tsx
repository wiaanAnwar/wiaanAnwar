import React from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../theme/colors';

export default function GradientRule({ width, height = 3 }: { width?: number; height?: number }) {
  return (
    <LinearGradient
      colors={[colors.red, colors.gold]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={width ? { width, height, borderRadius: 2 } : { height }}
    />
  );
}
