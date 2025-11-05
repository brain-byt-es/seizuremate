import { LogsProvider } from '@/constants/LogsContext';
import { getTheme } from '@/constants/theme';
import { supabase } from '@/lib/supabase';
import { ClerkProvider, useAuth } from '@clerk/clerk-expo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { SplashScreen, Stack, useRouter } from 'expo-router';
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

function InitialLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const { isSignedIn, isLoaded, userId, getToken } = useAuth();

  const [isStorageLoading, setStorageLoading] = useState(true);
  const [hasSeenIntro, setHasSeenIntro] = useState(false);
  const [hasOnboarded, setHasOnboarded] = useState(false);

  useEffect(() => {
    const checkStorage = async () => {
      try {
        const seenIntro = await AsyncStorage.getItem('hasSeenIntro');
        setHasSeenIntro(seenIntro === 'true');

        if (isLoaded && isSignedIn) {
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
  }, [isLoaded, isSignedIn, userId]);

  useEffect(() => {
    const setSupabaseSession = async () => {
      if (isSignedIn) {
        const supabaseToken = await getToken({ template: 'supabase' });
        if (supabaseToken) {
          await supabase.auth.setSession({
            access_token: supabaseToken,
            refresh_token: '', // Clerk handles the refresh token.
          });
        }
      } else {
        supabase.auth.signOut();
      }
    };

    if (isLoaded) {
      setSupabaseSession();
    }
  }, [isSignedIn, isLoaded, getToken]);

  useEffect(() => {
    if (isStorageLoading || !isLoaded) return;

    console.log('Routing decision:', { isStorageLoading, hasSeenIntro, isLoaded, isSignedIn, hasOnboarded });

    if (!hasSeenIntro) {
      console.log('Redirecting to /welcome');
      router.replace('/welcome');
    } else if (isSignedIn) {
      if (hasOnboarded) {
        console.log('Redirecting to /(tabs)/today');
        router.replace('/(tabs)/today');
      } else {
        console.log('Redirecting to /(onboarding)');
        router.replace('/(onboarding)');
      }
    } else {
      console.log('Redirecting to /(auth)/sign-in');
      router.replace('/(auth)/sign-in');
    }
    
    SplashScreen.hideAsync();

  }, [isStorageLoading, hasSeenIntro, isLoaded, isSignedIn, hasOnboarded, router]);

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

  if (isStorageLoading || !isLoaded) {
    return null;
  }

  return (
    <LogsProvider>
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
    </LogsProvider>
  );
}

export default function RootLayout() {
  return (
    <ClerkProvider publishableKey={clerkPublishableKey!}>
      <InitialLayout />
    </ClerkProvider>
  );
}
