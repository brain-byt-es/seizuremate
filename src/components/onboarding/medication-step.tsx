import React, { useState } from 'react';
import { View, StyleSheet, TextInput, FlatList } from 'react-native';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedButton } from '@/components/ui/themed-button';
import { spacing, Typography, radius } from '@/constants/theme';
import * as Crypto from 'expo-crypto';

interface Medication {
  id: string;
  name: string;
  dosage: string;
}

export const MedicationStep = ({ onNext }: { onNext: (medications: Medication[]) => void }) => {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');

  const addMedication = () => {
    if (name && dosage) {
      setMedications([...medications, { id: Crypto.randomUUID(), name, dosage }]);
      setName('');
      setDosage('');
    }
  };

  return (
    <ThemedView style={styles.stepContainer}>
      <ThemedText style={styles.title}>Add your medications</ThemedText>
      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Medication Name"
          value={name}
          onChangeText={setName}
          placeholderTextColor="#999"
        />
        <TextInput
          style={styles.input}
          placeholder="Dosage (e.g., 10mg)"
          value={dosage}
          onChangeText={setDosage}
          placeholderTextColor="#999"
        />
        <ThemedButton title="Add Medication" onPress={addMedication} disabled={!name || !dosage} />
      </View>
      <FlatList
        data={medications}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.medicationItem}>
            <ThemedText>{item.name} ({item.dosage})</ThemedText>
          </View>
        )}
        style={styles.list}
      />
      <ThemedButton title="Next" onPress={() => onNext(medications)} />
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  stepContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  title: {
    ...Typography.h2,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  formContainer: {
    width: '100%',
    marginBottom: spacing.lg,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: radius.md,
    padding: spacing.md,
    fontSize: 16,
    marginBottom: spacing.lg,
    color: '#000',
  },
  list: {
    width: '100%',
  },
  medicationItem: {
    backgroundColor: '#f0f0f0',
    padding: spacing.md,
    borderRadius: radius.sm,
    marginBottom: spacing.sm,
  },
});
