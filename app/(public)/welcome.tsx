
import { useRouter } from 'expo-router';
import { Platform, View } from 'react-native';

import { Button } from '@/components/nativewindui/Button';
import { Text } from '@/components/nativewindui/Text';
import { IconSymbol } from '@/components/ui/icon-symbol';

const FEATURES = [
  {
    title: 'Track with Confidence',
    description: 'Log seizures, medications, and triggers with a few simple taps.',
    icon: 'bolt.fill',
  },
  {
    title: 'Gain Valuable Insights',
    description: 'Visualize your data to understand trends and patterns over time.',
    icon: 'insights', // Material Icon name
  },
  {
    title: 'Share with Your Caregiver',
    description: 'Securely share your progress with a trusted caregiver or family member.',
    icon: 'share', // Material Icon name
  },
];

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 p-safe bg-background">
      <View className="mx-auto max-w-sm flex-1 justify-between gap-4 p-6">
        <View className="ios:pt-8 pt-12">
          <Text variant="largeTitle" className="ios:text-left text-center font-bold">
            Welcome to
          </Text>
          <Text variant="largeTitle" className="ios:text-left text-primary text-center font-bold">
            SeizureMate
          </Text>
        </View>
        <View className="gap-8">
          {FEATURES.map(feature => (
            <View key={feature.title} className="flex-row items-center gap-4">
              <View className="pt-px">
                <IconSymbol name={feature.icon} size={38} className="text-primary" />
              </View>
              <View className="flex-1">
                <Text variant="callout" className="font-semibold">
                  {feature.title}
                </Text>
                <Text variant="subhead" className="text-muted-foreground leading-5">
                  {feature.description}
                </Text>
              </View>
            </View>
          ))}
        </View>
        <View className="gap-4">
          <Button
            size={Platform.select({ ios: 'lg', default: 'md' })}
            onPress={() => router.push('/(public)/welcome-tour')}
            className="w-full">
            <Text>Get Started</Text>
          </Button>
        </View>
      </View>
    </View>
  );
}
