import { LogsProvider } from '@/contexts/LogsContext';
import '@/global.css';
import { useAuth } from '@clerk/clerk-expo';
import 'expo-dev-client';
import { Redirect, Stack } from 'expo-router';
import { ActivityIndicator } from 'react-native';

export default function AuthLayout() {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) {
    return <ActivityIndicator />;
  }

  if (!isSignedIn) {
    return <Redirect href="/(public)/welcome" />;
  }

  return (
    <LogsProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </LogsProvider>
  );
}