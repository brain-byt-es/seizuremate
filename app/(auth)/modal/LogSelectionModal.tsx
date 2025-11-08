import { Text } from '@/components/nativewindui/Text';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';

export default function LogSelectionModal() {
  const router = useRouter();

  const handleSelectLogType = (type: string) => {
    router.push({ pathname: '/modal/FullLogModal', params: { logType: type } });
  };

  const logOptions = [
    { type: 'Seizure', icon: 'medical-information' as const },
    { type: 'Medication', icon: 'medication' as const },
    { type: 'Aura', icon: 'flare' as const },
  ];

  return (
    <View className="flex-1 items-center justify-center bg-black/50">
      <View className="w-4/5 max-w-sm rounded-2xl border border-border bg-card p-6">
        <Text variant="title2" className="mb-6 text-center">What would you like to log?</Text>

        <View className="gap-3">
          {logOptions.map((option) => (
            <TouchableOpacity
              key={option.type}
              className="flex-row items-center rounded-xl border border-border bg-background p-4"
              onPress={() => handleSelectLogType(option.type)}
            >
              <MaterialIcons name={option.icon} size={24} className="text-primary" />
              <Text className="ml-4 text-base font-medium">{option.type}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity className="mt-6 items-center rounded-xl border border-border py-4" onPress={() => router.back()}>
          <Text className="font-bold text-primary">Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
