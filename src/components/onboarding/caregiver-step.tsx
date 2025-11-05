import React from 'react';
import { StyleSheet } from 'react-native';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedButton } from '@/components/ui/themed-button';
import { spacing, Typography } from '@/constants/theme';

export const CaregiverStep = ({ onFinish, loading }: { onFinish: () => void, loading: boolean }) => {
  return (
    <ThemedView style={styles.stepContainer}>
      <ThemedText style={styles.title}>Share with a Caregiver</ThemedText>
      <ThemedText style={styles.subtitle}>
        You can invite a caregiver to view your logs and stay informed. You can set this up later in the settings.
      </ThemedText>
      <ThemedButton title="Finish" onPress={onFinish} loading={loading} />
      <ThemedButton title="Skip for now" onPress={onFinish} variant="secondary" loading={loading} />
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
  subtitle: {
    ...Typography.body,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
});
