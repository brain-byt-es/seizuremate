import { Button } from '@/components/nativewindui/Button';
import { Icon } from '@/components/nativewindui/Icon';
import { Text } from '@/components/nativewindui/Text';
import { useColorScheme } from '@/lib/useColorScheme';
import { Link, useRouter } from 'expo-router';
import { Platform, View } from 'react-native';

const SF_SYMBOL_PROPS = { type: 'hierarchical' } as const;

const FEATURES = [
  {
    title: 'Track with Confidence',
    description: 'Log seizures, medications, and triggers with a few simple taps.',
    icon: 'bolt.fill',
  },
  {
    title: 'Gain Valuable Insights',
    description: 'Visualize your data to understand trends and see patterns over time.',
    icon: 'chart.bar.fill',
  },
  {
    title: 'Share with Your Care Team',
    description: 'Securely share your progress with a trusted caregiver or doctor.',
    icon: 'person.2.fill',
  },
] as const;

export default function WelcomeScreen() {
  const router = useRouter();
  const { colors } = useColorScheme();

  return (
    <View className="p-safe flex-1 bg-background">
      <View className="mx-auto max-w-sm flex-1 justify-between gap-4 p-6">
        <View className="ios:pt-8 pt-12">
          <Text variant="largeTitle" className="ios:text-left text-center font-bold">
            Welcome to SeizureMate
          </Text>
        </View>
        <View className="gap-8">
          {FEATURES.map((feature) => (
            <View key={feature.title} className="flex-row items-center gap-4">
              <View className="pt-px">
                <Icon name={feature.icon} size={38} color={colors.primary} sfSymbol={SF_SYMBOL_PROPS} />
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
          <View className="items-center">
            <Icon name="info.circle" color={colors.primary} sfSymbol={SF_SYMBOL_PROPS} />
            <Text variant="caption2" className="pt-1 text-center">
              By pressing continue, you agree to our{' '}
              <Link href="/terms"><Text variant="caption2" className="text-primary">Terms of Service</Text></Link>{' '}
              and that you have read our{' '}
              <Link href="/privacy-policy"><Text variant="caption2" className="text-primary">Privacy Policy</Text></Link>
            </Text>
          </View>
          <Button size={Platform.select({ ios: 'lg', default: 'md' })} onPress={() => router.push('/welcome/value')}>
            <Text>Take a Quick Tour</Text>
          </Button>
          <Button variant="secondary" size={Platform.select({ ios: 'lg', default: 'md' })} onPress={() => router.push('/(public)/(auth)/sign-in')}>
            <Text>Log In / Sign Up</Text>
          </Button>
        </View>
      </View>
    </View>
  );
}
