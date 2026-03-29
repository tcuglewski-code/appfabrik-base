/**
 * Index — Root redirect based on auth state
 */

import { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet, useColorScheme } from 'react-native';
import { router } from 'expo-router';

import { useAuthStore } from '../store/authStore';
import { getColors, getHomeRoute } from '../config/tenant';

export default function Index() {
  const colorScheme = useColorScheme();
  const colors = getColors(colorScheme === 'dark' ? 'dark' : 'light');
  
  const { isAuthenticated, user } = useAuthStore();
  
  useEffect(() => {
    // Small delay to ensure store is hydrated
    const timer = setTimeout(() => {
      if (isAuthenticated && user) {
        const homeRoute = getHomeRoute(user.role);
        router.replace(homeRoute as any);
      } else {
        router.replace('/login');
      }
    }, 100);
    
    return () => clearTimeout(timer);
  }, [isAuthenticated, user]);
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
