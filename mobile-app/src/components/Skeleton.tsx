import React, { useEffect, useRef } from 'react';
import { Animated, View } from 'react-native';
import { colors } from '../theme/colors';

export function SkeletonCard() {
  const opacity = useRef(new Animated.Value(0.5)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 600, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.5, duration: 600, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [opacity]);

  return (
    <Animated.View style={{ opacity, backgroundColor: '#fff', borderWidth: 1, borderColor: colors.cardBorder, borderRadius: 10, padding: 12, flexDirection: 'row', gap: 12 }}>
      <View style={{ width: 104, height: 78, borderRadius: 8, backgroundColor: colors.skeleton1 }} />
      <View style={{ flex: 1, paddingTop: 4 }}>
        <View style={{ height: 13, width: '70%', borderRadius: 4, backgroundColor: colors.skeleton1 }} />
        <View style={{ height: 10, width: '50%', borderRadius: 4, backgroundColor: colors.skeleton2, marginTop: 10 }} />
        <View style={{ height: 10, width: '38%', borderRadius: 4, backgroundColor: colors.skeleton2, marginTop: 8 }} />
      </View>
    </Animated.View>
  );
}
