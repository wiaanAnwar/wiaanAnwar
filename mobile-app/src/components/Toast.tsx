import React, { useEffect, useRef } from 'react';
import { Animated, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import { textStyle } from '../theme/text';
import { useI18n } from '../i18n/useI18n';

export default function Toast({ message }: { message: string | null }) {
  const { isArabic } = useI18n();
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (message) {
      opacity.setValue(0);
      Animated.timing(opacity, { toValue: 1, duration: 180, useNativeDriver: true }).start();
    }
  }, [message]);

  if (!message) return null;
  return (
    <Animated.View
      style={[
        styles.wrap,
        isArabic ? { borderEndWidth: 3, borderEndColor: colors.gold } : { borderStartWidth: 3, borderStartColor: colors.gold },
        { opacity },
      ]}
    >
      <Text style={textStyle({ weight: 400, size: 12, color: '#fff', isArabic })}>{message}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 104,
    zIndex: 50,
    backgroundColor: colors.blackPanel,
    borderRadius: 8,
    padding: 13,
    paddingHorizontal: 15,
    shadowColor: '#000',
    shadowOpacity: 0.4,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 8,
  },
});
