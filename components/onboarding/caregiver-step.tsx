import { Button } from '@/components/nativewindui/Button';
import { Text } from '@/components/nativewindui/Text';
import React from 'react';
import { View } from 'react-native';

export const CaregiverStep = ({ onFinish, loading }: { onFinish: () => void, loading: boolean }) => {
  return (
    <View className="flex-1 justify-center items-center p-6 w-full max-w-sm">
      <Text variant="title2" className="text-center mb-4">
        Share with a Caregiver
      </Text>
      <Text className="text-center mb-8">
        You can invite a caregiver to view your logs and stay informed. You can set this up later in the settings.
      </Text>
      <Button className="w-full" onPress={onFinish} disabled={loading}>
        <Text>{loading ? 'Finishing...' : 'Finish'}</Text>
      </Button>
      <Button variant="plain" className="w-full mt-2" onPress={onFinish} disabled={loading}>
        <Text>Skip for now</Text>
      </Button>
    </View>
  );
};
