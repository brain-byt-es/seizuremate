import { Text } from '@/components/nativewindui/Text';
import { View } from 'react-native';

export default function ProfileScreen() {
  return (
    <View className="flex-1 bg-background p-6">
      <Text variant="title2">Profile Page</Text>
      <Text>Here you can edit user details.</Text>
    </View>
  );
}