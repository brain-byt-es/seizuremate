import { Button } from '@/components/nativewindui/Button';
import { Icon } from '@/components/nativewindui/Icon';
import { Text } from '@/components/nativewindui/Text';
import { useColorScheme } from '@/lib/useColorScheme';
import { useRouter } from 'expo-router';
import { Platform, View } from 'react-native';

export default function PrivacyScreen() {
  const router = useRouter();
  const { colors } = useColorScheme();

  return (
    <View className="flex-1 justify-between bg-background p-6">
      <View />
      <View className="items-center gap-8">
        <View className="w-28 h-28 bg-primary/10 rounded-full items-center justify-center">
          <Icon name="shield.fill" size={52} color={colors.primary} />
        </View>
        <View className="items-center gap-4">
          <Text variant="largeTitle" className="text-center font-bold">
            Your data. Your choice.
          </Text>
          <Text className="text-center text-lg text-foreground/80 max-w-xs">
            Encrypted. Private. You control sharing.
          </Text>
        </View>
      </View>
      <View className="pb-safe">
        <Button size={Platform.select({ ios: 'lg', default: 'md' })} onPress={() => router.push('/sign-in')}>
          <Text>Get Started</Text>
        </Button>
      </View>
    </View>
  );
}