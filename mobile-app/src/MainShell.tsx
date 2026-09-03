import React from 'react';
import { View } from 'react-native';
import { colors } from './theme/colors';
import { useAppStore } from './store/useAppStore';
import Header from './components/Header';
import BottomTabBar from './components/BottomTabBar';
import OfflineBanner from './components/OfflineBanner';
import Toast from './components/Toast';
import HomeScreen from './screens/HomeScreen';
import FleetScreen from './screens/FleetScreen';
import TripsScreen from './screens/TripsScreen';
import AccountScreen from './screens/AccountScreen';
import SearchSheet from './sheets/SearchSheet';
import VehicleDetailSheet from './sheets/VehicleDetailSheet';
import BookingSheet from './sheets/BookingSheet';
import CancelSheet from './sheets/CancelSheet';
import DocumentsSheet from './sheets/DocumentsSheet';

export default function MainShell() {
  const tab = useAppStore((s) => s.tab);
  const offline = useAppStore((s) => s.offline);
  const searchOpen = useAppStore((s) => s.searchOpen);
  const detailId = useAppStore((s) => s.detailId);
  const booking = useAppStore((s) => s.booking);
  const documentsOpen = useAppStore((s) => s.documentsOpen);
  const toast = useAppStore((s) => s.toast);

  return (
    <View style={{ flex: 1, backgroundColor: colors.sheetBg }}>
      <Header />
      {offline && <OfflineBanner />}
      <View style={{ flex: 1 }}>
        {tab === 'home' && <HomeScreen />}
        {tab === 'fleet' && <FleetScreen />}
        {tab === 'trips' && <TripsScreen />}
        {tab === 'account' && <AccountScreen />}
      </View>
      <BottomTabBar />

      {searchOpen && <SearchSheet />}
      {!!detailId && !booking && <VehicleDetailSheet />}
      {booking && <BookingSheet />}
      {documentsOpen && <DocumentsSheet />}
      <CancelSheet />
      <Toast message={toast} />
    </View>
  );
}
