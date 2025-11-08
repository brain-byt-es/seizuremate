import { useAuth } from '@clerk/clerk-expo';
import { SplashScreen, useRouter } from 'expo-router';
import { useEffect } from 'react';

export default function Index() {
  const { isLoaded, isSignedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    SplashScreen.hideAsync();

    if (isSignedIn) {
      router.replace('/(tabs)/today');
    } else {
      router.replace('/welcome');
    }
  }, [isLoaded, isSignedIn, router]);

  return null; // Or a loading indicator while routing
}