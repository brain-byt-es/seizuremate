import { useOnboarding } from '@/contexts/OnboardingContext';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Button, FlatList, StyleSheet, Text, TextInput, View } from 'react-native';

export default function MedicationStep() {
  const { state, addMedication, finishOnboarding, isSubmitting, error } = useOnboarding();
  const router = useRouter();

  const [medName, setMedName] = useState('');
  const [dosage, setDosage] = useState('');

  const backgroundColor = useThemeColor('background');
  const textColor = useThemeColor('text');
  const primaryColor = useThemeColor('primary');
  const surfaceColor = useThemeColor('surface');

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
      // Pass a callback to handle navigation after the onboarding state is saved.
      await finishOnboarding(() => {
        router.replace('/(tabs)/today');
      });
    } catch {
      // Error is handled by the useEffect hook, which shows an Alert.
    }
  };

  const handleSkip = () => {
    handleFinish();
  };

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <Text style={[styles.title, { color: textColor }]}>What medications do you take?</Text>

      <TextInput
        value={medName}
        onChangeText={setMedName}
        placeholder="Medication Name (e.g., Keppra)"
        style={[styles.input, { color: textColor, borderColor: textColor }]}
      />
      <TextInput
        value={dosage}
        onChangeText={setDosage}
        placeholder="Dosage (e.g., 500mg, twice daily)"
        style={[styles.input, { color: textColor, borderColor: textColor }]}
      />
      <Button title="Add Medication" onPress={handleAddMedication} color={primaryColor} />

      <FlatList
        style={styles.list}
        data={state.medications}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[styles.medItem, { backgroundColor: surfaceColor }]}>
            <Text style={{ color: textColor }}>{item.name} - {item.dosage}</Text>
          </View>
        )}
      />

      {isSubmitting ? (
        <ActivityIndicator size="large" color={primaryColor} />
      ) : (
        <View style={styles.buttonContainer}>
          <Button title="Skip for now" onPress={handleSkip} />
          <Button title="Finish Onboarding" onPress={handleFinish} color={primaryColor} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 40 },
  title: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  input: { height: 50, borderWidth: 1, padding: 15, borderRadius: 10, fontSize: 16, marginBottom: 10 },
  list: { marginTop: 20, flexGrow: 0 },
  medItem: { padding: 15, borderRadius: 10, marginBottom: 10 },
  buttonContainer: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});