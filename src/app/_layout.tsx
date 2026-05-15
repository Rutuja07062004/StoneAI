import { Buffer } from 'buffer';
import process from 'process';

if (typeof global.Buffer === 'undefined') {
  global.Buffer = Buffer;
}
if (typeof global.process === 'undefined') {
  global.process = process;
}

import { DarkTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { COLORS } from '@/constants/theme';

function RootLayoutNav() {
  const { user, loading, isAuthenticated } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === '(auth)';
    const isOnboarding = segments[0] === 'onboarding';
    const isSplash = !segments.length;

    if (!isAuthenticated && !inAuthGroup && !isOnboarding && !isSplash) {
      // Redirect to login if not authenticated and trying to access protected routes
      router.replace('/login' as any);
    } else if (isAuthenticated && inAuthGroup) {
      // Redirect to home if authenticated and trying to access auth screens
      router.replace('/(tabs)' as any);
    }
  }, [isAuthenticated, loading, segments]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false, animation: 'fade' }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="onboarding/index" />
      <Stack.Screen name="(auth)/login" />
      <Stack.Screen name="(auth)/signup" />
      <Stack.Screen name="(auth)/forgot-password" />
      <Stack.Screen name="(tabs)" options={{ gestureEnabled: false }} />
      <Stack.Screen name="scan/index" />
      <Stack.Screen name="scan/processing" />
      <Stack.Screen name="scan/result" />
      <Stack.Screen name="details/[id]" />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <ThemeProvider value={DarkTheme}>
          <RootLayoutNav />
          <StatusBar style="light" />
        </ThemeProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
