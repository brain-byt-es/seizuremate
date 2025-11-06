import { useOnboarding } from '@/contexts/OnboardingContext';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useRouter } from 'expo-router';
import React from 'react';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';

export default function ProfileStep() {
  const { state, updateProfile } = useOnboarding();
  const router = useRouter();

  const backgroundColor = useThemeColor('background');
  const textColor = useThemeColor('text');
  const primaryColor = useThemeColor('primary');

  const handleNameChange = (name: string) => {
    updateProfile({ name });
  };

  const handleNext = () => {
    // Here you would typically validate the input before proceeding
    // Navigate to the next step in the flow.
    router.push('/(onboarding)/caregiver');
  };

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <Text style={[styles.title, { color: textColor }]}>What should we call you?</Text>
      <TextInput
        value={state.profile.name || ''}
        onChangeText={handleNameChange}
        placeholder="Your Name"
        style={[styles.input, { color: textColor, borderColor: textColor }]}
      />
      <Button title="Next" onPress={handleNext} color={primaryColor} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  input: {
    height: 50,
    borderWidth: 1,
    padding: 15,
    borderRadius: 10,
    fontSize: 16,
    marginBottom: 20,
  },
});