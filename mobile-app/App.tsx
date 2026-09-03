import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts, Poppins_300Light, Poppins_400Regular, Poppins_500Medium, Poppins_600SemiBold, Poppins_700Bold } from '@expo-google-fonts/poppins';
import { Cairo_300Light, Cairo_400Regular, Cairo_600SemiBold, Cairo_700Bold } from '@expo-google-fonts/cairo';
import { colors } from './src/theme/colors';
import { useAppStore } from './src/store/useAppStore';
import { useNetworkSync } from './src/utils/useNetworkSync';
import AuthScreen from './src/screens/AuthScreen';
import MainShell from './src/MainShell';

export default function App() {
  const [fontsLoaded] = useFonts({
    Poppins_300Light, Poppins_400Regular, Poppins_500Medium, Poppins_600SemiBold, Poppins_700Bold,
    Cairo_300Light, Cairo_400Regular, Cairo_600SemiBold, Cairo_700Bold,
  });
  const authed = useAppStore((s) => s.authed);
  const restoreSession = useAppStore((s) => s.restoreSession);
  const [sessionChecked, setSessionChecked] = useState(false);
  useNetworkSync();

  useEffect(() => {
    // A stored JWT (SecureStore) means the last sign-in is still good — skip
    // straight to the app instead of forcing the phone/OTP screen again.
    restoreSession().finally(() => setSessionChecked(true));
  }, [restoreSession]);

  if (!fontsLoaded || !sessionChecked) {
    return <View style={{ flex: 1, backgroundColor: colors.black }} />;
  }

  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      {authed ? <MainShell /> : <AuthScreen />}
    </SafeAreaProvider>
  );
}
