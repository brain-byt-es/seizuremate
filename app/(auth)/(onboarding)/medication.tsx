import { Text } from '@/components/nativewindui/Text';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Button, FlatList, TextInput, View } from 'react-native';
export default function MedicationStep() {
  const { state, addMedication, finishOnboarding, isSubmitting, error } = useOnboarding();
  const router = useRouter();

  const [medName, setMedName] = useState('');
  const [dosage, setDosage] = useState('');

  useEffect(() => {
    if (error) {
      Alert.alert('Error', error);
    }
  }, [error]);

  const handleAddMedication = () => {
    if (medName && dosage) {
      addMedication({
        id: Math.random().toString(), // Use a better ID in a real app, e.g., from nanoid
        name: medName,
        dosage,
      });
      setMedName('');
      setDosage('');
    }
  };

  const handleFinish = async () => {
    try {
      await finishOnboarding();
      router.replace('/(tabs)/today');
    } catch {
      // Error is handled by the useEffect hook, which shows an Alert.
    }
  };

  const handleSkip = () => {
    handleFinish();
  };

  return (
    <View className="flex-1 bg-background p-5 pt-10">
      <Text variant="title2" className="mb-5 text-center">What medications do you take?</Text>

      <TextInput
        value={medName}
        onChangeText={setMedName}
        placeholder="Medication Name (e.g., Keppra)"
        placeholderTextColor="hsl(var(--muted-foreground))"
        className="mb-2.5 h-12 rounded-lg border border-border bg-input p-4 text-base text-foreground"
      />
      <TextInput
        value={dosage}
        onChangeText={setDosage}
        placeholder="Dosage (e.g., 500mg, twice daily)"
        placeholderTextColor="hsl(var(--muted-foreground))"
        className="mb-2.5 h-12 rounded-lg border border-border bg-input p-4 text-base text-foreground"
      />
      <Button title="Add Medication" onPress={handleAddMedication} />

      <FlatList
        className="mt-5 flex-grow-0"
        data={state.medications}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View className="mb-2.5 rounded-lg bg-card p-4">
            <Text className="text-card-foreground">{item.name} - {item.dosage}</Text>
          </View>
        )}
      />

      {isSubmitting ? (
        <ActivityIndicator size="large" className="mt-5" />
      ) : (
        <View className="mt-5 flex-row justify-around">
          <Button title="Skip for now" onPress={handleSkip} />
          <Button title="Finish Onboarding" onPress={handleFinish} />
        </View>
      )}
    </View>
  );
}