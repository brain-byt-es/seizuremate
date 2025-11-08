import { DisplaySettingsProvider } from '@/contexts/DisplaySettingsContext';
import { SupabaseProvider } from '@/contexts/SupabaseContext';
import { useColorScheme } from '@/lib/useColorScheme';
import { ClerkProvider } from '@clerk/clerk-expo';
import 'expo-dev-client';
import { SplashScreen, Stack } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { View } from 'react-native';
import 'react-native-reanimated';
import '../global.css';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const clerkPublishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

if (!clerkPublishableKey) {
  throw new Error('Missing Clerk Publishable Key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env file.');
}

// Cache the Clerk JWT
const tokenCache = {
  async getToken(key: string) {
    try {
      return SecureStore.getItemAsync(key);
    } catch {
      return null;
    }
  },
  async saveToken(key: string, value: string) {
    try {
      return SecureStore.setItemAsync(key, value);
    } catch {}
  },
};

function InitialLayout() {
  const { colorScheme } = useColorScheme();

  useEffect(() => {
    // This is now handled in index.tsx after routing decisions are made.
    // We can hide it here after a delay as a fallback.
    setTimeout(() => SplashScreen.hideAsync(), 500);
  }, []);

  // Use a View with NativeWind classes for the background.
  // This will automatically apply the correct light/dark theme from global.css.
  return (
    <View className="flex-1 bg-background">
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(onboarding)" />
        <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
      </Stack>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
    </View>
  );
}

export default function RootLayout() {
  return (
    <ClerkProvider tokenCache={tokenCache} publishableKey={clerkPublishableKey!}>
      <DisplaySettingsProvider>
        <SupabaseProvider>
          <InitialLayout />
        </SupabaseProvider>
      </DisplaySettingsProvider>
    </ClerkProvider>
  );
}
