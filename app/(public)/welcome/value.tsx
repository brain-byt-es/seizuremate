import { Button } from '@/components/nativewindui/Button';
import { Icon } from '@/components/nativewindui/Icon';
import { Text } from '@/components/nativewindui/Text';
import { useColorScheme } from '@/lib/useColorScheme';
import { useRouter } from 'expo-router';
import { Platform, View } from 'react-native';

export default function ValueScreen() {
  const router = useRouter();
  const { colors } = useColorScheme();

  return (
    <View className="flex-1 justify-between bg-background p-6">
      <View />
      <View className="items-center gap-8">
        <View className="w-28 h-28 bg-primary/10 rounded-full items-center justify-center">
          <Icon name="chart.pie.fill" size={52} color={colors.primary} />
        </View>
        <View className="items-center gap-4">
          <Text variant="largeTitle" className="text-center font-bold">
            Track. Understand. Empower.
          </Text>
          <View className="gap-y-3">
            <Text className="text-center text-lg text-foreground/80">✓ Log seizures and possible triggers</Text>
            <Text className="text-center text-lg text-foreground/80">✓ See clear trends and patterns</Text>
            <Text className="text-center text-lg text-foreground/80">✓ Share insights with your doctor</Text>
          </View>
        </View>
      </View>
      <View className="pb-safe">
        <Button size={Platform.select({ ios: 'lg', default: 'md' })} onPress={() => router.push('/welcome/calm')}>
          <Text>Next</Text>
        </Button>
      </View>
    </View>
  );
}