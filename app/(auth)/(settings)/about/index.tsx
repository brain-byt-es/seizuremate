import { Text } from '@/components/nativewindui/Text';
import React from 'react';
import { View } from 'react-native';

export default function AboutScreen() {
  return (
    <View className="flex-1 bg-background p-6">
      <Text variant="title1">About</Text>
    </View>
  );
}
