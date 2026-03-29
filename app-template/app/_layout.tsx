/**
 * Root Layout — AppFabrik Mobile App
 * 
 * Sets up providers, theme, and navigation structure.
 */

import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useColorScheme, View, StyleSheet } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';

import { useAuthStore } from '../store/authStore';
import { appConfig, getColors } from '../config/tenant';

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

// React Query Client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 2,
    },
  },
});

// =============================================================================
// ROOT LAYOUT
// =============================================================================

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const colors = getColors(colorScheme === 'dark' ? 'dark' : 'light');
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  
  useEffect(() => {
    // Hide splash screen after initial load
    const hideSplash = async () => {
      await SplashScreen.hideAsync();
    };
    hideSplash();
  }, []);
  
  return (
    <GestureHandlerRootView style={styles.container}>
      <QueryClientProvider client={queryClient}>
        <View style={[styles.container, { backgroundColor: colors.background }]}>
          <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
          
          <Stack
            screenOptions={{
              headerStyle: {
                backgroundColor: colors.headerBg,
              },
              headerTintColor: colors.headerText,
              headerTitleStyle: {
                fontWeight: '600',
              },
              contentStyle: {
                backgroundColor: colors.background,
              },
              animation: appConfig.ui.animationsEnabled ? 'default' : 'none',
            }}
          >
            {/* Auth Screens */}
            <Stack.Screen
              name="login"
              options={{
                headerShown: false,
                gestureEnabled: false,
              }}
            />
            
            {/* Index / Redirect */}
            <Stack.Screen
              name="index"
              options={{
                headerShown: false,
              }}
            />
            
            {/* Role-based Routes */}
            <Stack.Screen
              name="(admin)"
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="(gf)"
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="(mitarbeiter)"
              options={{
                headerShown: false,
              }}
            />
            
            {/* Shared Screens */}
            <Stack.Screen
              name="(shared)"
              options={{
                headerShown: false,
              }}
            />
          </Stack>
        </View>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
