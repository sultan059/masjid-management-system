import React, { useCallback, useState, useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import * as SplashScreen from 'expo-splash-screen';
import { 
  useFonts,
  PlusJakartaSans_700Bold,
  PlusJakartaSans_600SemiBold,
} from '@expo-google-fonts/plus-jakarta-sans';
import {
  BeVietnamPro_400Regular,
  BeVietnamPro_500Medium,
  BeVietnamPro_600SemiBold,
} from '@expo-google-fonts/be-vietnam-pro';

import { Theme } from './src/theme/Theme';
import CustomDrawerContent from './src/components/CustomDrawerContent';
import authService from './src/services/authService';

// Screen Imports
import DashboardScreen from './src/screens/DashboardScreen';
import LoginScreen from './src/screens/LoginScreen';
import InventoryScreen from './src/screens/InventoryScreen';
import PaymentsScreen from './src/screens/PaymentsScreen';
import NotificationsScreen from './src/screens/NotificationsScreen';
import ReportsScreen from './src/screens/ReportsScreen';
import TransactionsScreen from './src/screens/TransactionsScreen';
import EventsScreen from './src/screens/EventsScreen';

SplashScreen.preventAutoHideAsync();

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

function AppDrawer() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          backgroundColor: Theme.colors.surface,
          width: 300,
        },
        sceneContainerStyle: { backgroundColor: Theme.colors.background },
      }}
    >
      <Drawer.Screen name="Dashboard" component={DashboardScreen} />
      <Drawer.Screen name="Inventory" component={InventoryScreen} />
      <Drawer.Screen name="Payments" component={PaymentsScreen} />
      <Drawer.Screen name="Notifications" component={NotificationsScreen} />
      <Drawer.Screen name="Events" component={EventsScreen} />
      <Drawer.Screen name="Reports" component={ReportsScreen} />
      <Drawer.Screen name="Transactions" component={TransactionsScreen} />
    </Drawer.Navigator>
  );
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  const [fontsLoaded] = useFonts({
    PlusJakartaSans_700Bold,
    PlusJakartaSans_600SemiBold,
    BeVietnamPro_400Regular,
    BeVietnamPro_500Medium,
    BeVietnamPro_600SemiBold,
  });

  useEffect(() => {
    const checkAuth = async () => {
      const authenticated = await authService.isAuthenticated();
      setIsAuthenticated(authenticated);
      setAuthLoading(false);
    };
    checkAuth();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded && !authLoading) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, authLoading]);

  if (!fontsLoaded || authLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Theme.colors.background }}>
        <ActivityIndicator size="large" color={Theme.colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer onReady={onLayoutRootView}>
      <StatusBar style="dark" />
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          <Stack.Screen name="Login">
            {(props) => <LoginScreen {...props} onLogin={() => setIsAuthenticated(true)} />}
          </Stack.Screen>
        ) : (
          <Stack.Screen name="Main" component={AppDrawer} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
