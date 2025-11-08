import { Link } from 'expo-router';
import { View } from 'react-native';

import { Text } from '@/components/nativewindui/Text';

export default function ModalScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-background p-5">
      <Text variant="title1">This is a modal</Text>
      <Link href="/today" className="mt-4 py-4">
        <Text className="text-primary">Go to home screen</Text>
      </Link>
    </View>
  );
}
