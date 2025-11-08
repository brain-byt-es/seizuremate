import React, { useState } from 'react';
import { View } from 'react-native';

import { Button } from '@/components/nativewindui/Button';
import { Text } from '@/components/nativewindui/Text';
import { Input } from '@/components/ui/Input';

export const ProfileStep = ({ onNext }: { onNext: (name: string) => void }) => {
  const [name, setName] = useState('');

  return (
    <View className="flex-1 justify-center items-center p-6 w-full max-w-sm">
      <Text variant="title2" className="text-center mb-8">
        What should we call you?
      </Text>
      <Input
        className="mb-4"
        placeholder="Your Name"
        value={name}
        onChangeText={setName}
      />
      <Button className="w-full" onPress={() => onNext(name)} disabled={!name}>
        <Text>Next</Text>
      </Button>
    </View>
  );
};
