import { getTheme } from '@/constants/theme';
import { LogsProvider } from '@/contexts/LogsContext';
import { OnboardingProvider } from '@/contexts/OnboardingContext';
import { supabase } from '@/lib/supabase';
import { ClerkProvider, useAuth } from '@clerk/clerk-expo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Href, SplashScreen, Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
import 'react-native-reanimated';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const clerkPublishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

if (!clerkPublishableKey) {
  throw new Error('Missing Clerk Publishable Key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env file.');
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const { isSignedIn, isLoaded, userId } = useAuth();

  const [isStorageLoading, setStorageLoading] = useState(true);
  const [hasSeenIntro, setHasSeenIntro] = useState(false);
  const [hasOnboarded, setHasOnboarded] = useState(false);
  const { isSupabaseReady } = useAuthAndSupabase();

  useEffect(() => {
    const checkStorage = async () => {
      try {
        const seenIntro = await AsyncStorage.getItem('hasSeenIntro');
        setHasSeenIntro(seenIntro === 'true');

        if (isLoaded && isSignedIn && isSupabaseReady) {
          const { data: profile } = await supabase
            .from('users')
            .select('id')
            .eq('provider_user_id', userId)
            .single();
          if (profile) {
            setHasOnboarded(true);
          }
        }
      } catch (e) {
        console.error('Failed to load data from storage', e);
      } finally {
        setStorageLoading(false);
      }
    };

    checkStorage();
  }, [isLoaded, isSignedIn, userId, isSupabaseReady]);

  const appTheme = getTheme(colorScheme ?? 'light');

  const navigationTheme = {
    ...(colorScheme === 'dark' ? DarkTheme : DefaultTheme),
    colors: {
      ...(colorScheme === 'dark' ? DarkTheme.colors : DefaultTheme.colors),
      background: appTheme.colors.background,
      primary: appTheme.colors.primary,
      text: appTheme.colors.text,
      card: appTheme.colors.surface,
      border: appTheme.colors.border,
    },
  };

  useEffect(() => {
    if (isStorageLoading || !isLoaded || !isSupabaseReady) {
      return;
    }

    let destination: Href | null = null;

    if (!hasSeenIntro) {
      destination = '/welcome';
    } else if (!isSignedIn) {
      destination = '/(auth)/sign-in';
    } else if (!hasOnboarded) {
      destination = '/(onboarding)';
    } else {
      destination = '/(tabs)/today';
    }

    if (destination) {
      router.replace(destination);
    }
  }, [isStorageLoading, hasSeenIntro, isLoaded, isSignedIn, hasOnboarded, isSupabaseReady, router]);

  useEffect(() => {
    if (!isStorageLoading && isLoaded) {
      SplashScreen.hideAsync();
    }
  }, [isStorageLoading, isLoaded]);

  if (isStorageLoading || !isLoaded || !isSupabaseReady) {
    return null;
  }

  return (
    <ThemeProvider value={navigationTheme}>
      <Stack>
        <Stack.Screen name="(public)" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(onboarding)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
      </Stack>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
    </ThemeProvider>
  );
}

/**
 * This hook centralizes the logic for setting up the Supabase session.
 * It returns a boolean that is true only when the session is ready.
 */
export function useAuthAndSupabase() {
  const { isSignedIn, isLoaded, getToken } = useAuth();
  const [isSupabaseReady, setSupabaseReady] = useState(false);

  useEffect(() => {
    const setSupabaseSession = async () => {
      if (isSignedIn) {
        const supabaseToken = await getToken({ template: 'supabase' });
        if (supabaseToken) {
          await supabase.auth.setSession({
            access_token: supabaseToken,
            refresh_token: '', // Clerk handles the refresh token.
          });
          setSupabaseReady(true);
        }
      } else {
        supabase.auth.signOut();
        setSupabaseReady(false);
      }
    };

    if (isLoaded) {
      setSupabaseSession();
    }
  }, [isSignedIn, isLoaded, getToken]);

  return { isSupabaseReady };
}

function InitialLayout() {
  return (
    <LogsProvider>
      <RootLayoutNav />
    </LogsProvider>
  );
}

export default function RootLayout() {
  return (
    <ClerkProvider publishableKey={clerkPublishableKey!}>
      <OnboardingProvider>
        <InitialLayout />
      </OnboardingProvider>
    </ClerkProvider>
  );
}
