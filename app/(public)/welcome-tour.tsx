import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { ThemedButton } from '@/components/ui/themed-button';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Dimensions, StyleSheet, TouchableOpacity, View } from 'react-native';

const tourSteps = [
  {
    title: 'Track with Confidence',
    description: 'A private and simple way to manage your seizure information, medications, and more.',
    color: '#3B82F6',
  },
  {
    title: 'Gain Valuable Insights',
    description: 'Visualize your data to understand trends, identify triggers, and see adherence over time.',
    color: '#7FA08C',
  },
  {
    title: 'Share with Your Caregiver',
    description: 'Securely share your logs and progress with a trusted caregiver or family member.',
    color: '#D5705D',
  },
  {
    title: 'Your Calm Companion',
    description: 'Designed to be simple, accessible, and calming during stressful times.',
    color: '#4F4B42',
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
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleFinishTour}>
          <ThemedText type="link">Skip</ThemedText>
        </TouchableOpacity>
      </View>

      <View style={styles.mainContent}>
        <View style={[styles.imagePlaceholder, { backgroundColor: stepData.color }]} >
            <ThemedText type='h1' style={{color: 'white'}}>S</ThemedText>
        </View>
        <View style={styles.textContainer}>
            <ThemedText type='h2' style={styles.title}>{stepData.title}</ThemedText>
            <ThemedText style={styles.description}>
                {stepData.description}
            </ThemedText>
        </View>
      </View>

      <View style={styles.footer}>
        <View style={styles.dotsContainer}>
          {Array.from({ length: totalSteps }).map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot, // ThemedButton will handle colors
                index === currentStep ? styles.dotActive : {},
              ]}
            />
          ))}
        </View>
        <ThemedButton
          title={currentStep === totalSteps - 1 ? "Let's Get Started" : 'Next'}
          onPress={handleNext}
        />
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 24,
    paddingTop: 24,
  },
  header: {
    alignItems: 'flex-end',
  },
  mainContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imagePlaceholder: {
    width: Dimensions.get('window').width * 0.6,
    height: Dimensions.get('window').width * 0.6,
    maxWidth: 240, // Add a max width
    maxHeight: 240, // Add a max height
    borderRadius: 24,
    marginBottom: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    maxWidth: 320,
    textAlign: 'center',
    alignItems: 'center',
  },
  title: {
    marginBottom: 12,
    textAlign: 'center',
  },
  description: {
    lineHeight: 24,
    textAlign: 'center',
  },
  footer: {
    paddingBottom: 24,
    width: '100%',
    alignSelf: 'center',
    maxWidth: 448, // max-w-md
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    gap: 8,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  dotActive: {
    width: 24,
  },
});
