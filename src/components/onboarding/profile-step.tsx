import React, { useState } from 'react';
import { View, StyleSheet, TextInput } from 'react-native';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedButton } from '@/components/ui/themed-button';
import { spacing, Typography, radius } from '@/constants/theme';

export const ProfileStep = ({ onNext }: { onNext: (name: string) => void }) => {
  const [name, setName] = useState('');

  return (
    <ThemedView style={styles.stepContainer}>
      <ThemedText style={styles.title}>What should we call you?</ThemedText>
      <TextInput
        style={styles.input}
        placeholder="Your Name"
        value={name}
        onChangeText={setName}
        placeholderTextColor="#999"
      />
      <ThemedButton title="Next" onPress={() => onNext(name)} disabled={!name} />
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
});
