import { Button } from '@/components/nativewindui/Button';
import { Text } from '@/components/nativewindui/Text';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { TouchableOpacity, View } from 'react-native';

const tourSteps = [
  {
    title: 'Track with Confidence',
    description: 'A private and simple way to manage your seizure information, medications, and more.',
    className: 'bg-primary',
  },
  {
    title: 'Gain Valuable Insights',
    description: 'Visualize your data to understand trends, identify triggers, and see adherence over time.',
    className: 'bg-secondary',
  },
  {
    title: 'Share with Your Caregiver',
    description: 'Securely share your logs and progress with a trusted caregiver or family member.',
    className: 'bg-accent',
  },
  {
    title: 'Your Calm Companion',
    description: 'Designed to be simple, accessible, and calming during stressful times.',
    className: 'bg-foreground',
  },
];

export default function WelcomeTourScreen() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const totalSteps = tourSteps.length;

  // const primaryColor = useThemeColor('primary');

  const handleFinishTour = async () => {
    try {
      await AsyncStorage.setItem('hasSeenIntro', 'true');
    } catch (e) {
      console.error('Failed to save welcome tour status.', e);
    }
    router.replace('/(auth)/sign-in');
  };

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleFinishTour();
    }
  };

  const stepData = tourSteps[currentStep];

  return (
    <View className="flex-1 justify-between p-6 pt-6">
      <View className="items-end">
        <TouchableOpacity onPress={handleFinishTour}>
          <Text className="text-primary">Skip</Text>
        </TouchableOpacity>
      </View>

      <View className="flex-1 items-center justify-center">
        <View
          className={`w-[60vw] h-[60vw] max-w-[240px] max-h-[240px] rounded-3xl mb-12 items-center justify-center ${stepData.className}`}>
          <Text
            variant="largeTitle"
            className="text-background dark:text-foreground font-bold"
            style={{ color: stepData.className.includes('foreground') ? 'rgb(var(--background))' : undefined }}>
            S
          </Text>
        </View>
        <View className="max-w-[320px] items-center">
          <Text variant="title2" className="mb-3 text-center">
            {stepData.title}
          </Text>
          <Text className="leading-6 text-center">{stepData.description}</Text>
        </View>
      </View>

      <View className="pb-6 w-full self-center max-w-md">
        <View className="flex-row justify-center items-center mb-6 gap-2">
          {Array.from({ length: totalSteps }).map((_, index) => (
            <View
              key={index}
              className={`h-2.5 rounded-full transition-all ${index === currentStep ? 'w-6 bg-primary' : 'w-2.5 bg-muted'}`}
            />
          ))}
        </View>
        <Button onPress={handleNext}>
          <Text>{currentStep === totalSteps - 1 ? "Let's Get Started" : 'Next'}</Text>
        </Button>
      </View>
    </View>
  );
}
