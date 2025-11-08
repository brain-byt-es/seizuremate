import { useAuth } from '@clerk/clerk-expo';
import { Redirect, Stack } from 'expo-router';

export default function PublicLayout() {
  const { isSignedIn } = useAuth();

  if (isSignedIn) {
    return <Redirect href={'/(auth)/(tabs)/today' as any} />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}