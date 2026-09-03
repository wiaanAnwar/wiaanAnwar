import { useEffect } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { useAppStore } from '../store/useAppStore';

/** Wires the real device connectivity state into the offline banner + submit-failure path. */
export function useNetworkSync() {
  const setOffline = useAppStore((s) => s.setOffline);
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setOffline(state.isConnected === false || state.isInternetReachable === false);
    });
    return unsubscribe;
  }, [setOffline]);
}
