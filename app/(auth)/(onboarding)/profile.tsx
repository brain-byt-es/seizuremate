import { Text } from '@/components/nativewindui/Text';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { useAuth } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, TextInput, TouchableOpacity, View } from 'react-native';

export default function ProfileStep() {
  const { userId } = useAuth();
  const { updateProfile, nextStep } = useOnboarding();
  const router = useRouter();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const handleContinue = async () => {
    if (!userId) {
      Alert.alert('Error', 'You must be logged in to create a profile.');
      return;
    }
    if (!firstName.trim() || !lastName.trim()) {
      Alert.alert('Error', 'Please enter both your first and last name.');
      return;
    }

    // Update the context state, don't save to DB yet
    updateProfile({ name: `${firstName.trim()} ${lastName.trim()}` });
    // Navigate to the next step
    nextStep();
  };

  return (
    <View className="flex-1 items-center justify-center bg-background p-5">
      <Text variant="title1" className="mb-4">Tell us about yourself</Text>
      <TextInput
        className="mb-4 h-12 w-full rounded-lg border border-border bg-input p-4 text-base text-foreground"
        placeholder="First Name"
        placeholderTextColor="hsl(var(--muted-foreground))"
        value={firstName}
        onChangeText={setFirstName}
      />
      <TextInput
        className="mb-4 h-12 w-full rounded-lg border border-border bg-input p-4 text-base text-foreground"
        placeholder="Last Name"
        placeholderTextColor="hsl(var(--muted-foreground))"
        value={lastName}
        onChangeText={setLastName}
      />
      <TouchableOpacity className="w-full items-center rounded-lg bg-primary p-4" onPress={handleContinue}>
        <Text className="text-lg font-bold text-primary-foreground">Continue</Text>
      </TouchableOpacity>
    </View>
  );
}