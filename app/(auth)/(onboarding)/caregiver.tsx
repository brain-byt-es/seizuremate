import { useRouter } from 'expo-router';
import React from 'react';
import { Button, View } from 'react-native';

import { Text } from '@/components/nativewindui/Text';

export default function CaregiverStep() {
  const router = useRouter();

  const handleNext = () => {
    // Navigate to the next step in the flow.
    router.push('/(onboarding)/medication');
  };

  return (
    <View className="flex-1 items-center justify-center bg-background p-5">
      <Text variant="title2" className="mb-2.5 text-center">
        Would you like to add a caregiver?
      </Text>
      <Text variant="subhead" className="mb-8 text-center italic">(This feature is coming soon!)</Text>
      <Button title="Next" onPress={handleNext} />
    </View>
  );
}