import { OnboardingProvider } from '@/contexts/OnboardingContext';
import { Stack } from 'expo-router';
import React from 'react';

export default function OnboardingLayout() {
  return (
    <OnboardingProvider>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="profile" options={{ title: 'Your Profile', headerBackVisible: false }} />
        <Stack.Screen name="caregiver" options={{ title: 'Add a Caregiver' }} />
        <Stack.Screen name="medication" options={{ title: 'Your Medications', headerBackVisible: false }} />
      </Stack>
    </OnboardingProvider>
  );
}