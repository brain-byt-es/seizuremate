
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth, useUser } from '@clerk/clerk-expo';

import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedButton } from '@/components/ui/themed-button';
import { spacing, Typography } from '@/constants/theme';
import { supabase } from '@/lib/supabase';
import { ProfileStep } from './profile-step';
import { MedicationStep } from './medication-step';
import { CaregiverStep } from './caregiver-step';

interface Medication {
  id: string;
  name: string;
  dosage: string;
}

enum OnboardingStep {
  PROFILE,
  MEDICATION,
  CAREGIVERS,
}

export default function OnboardingFlow() {
  const { userId } = useAuth();
  const { user } = useUser();
  const router = useRouter();
  const [step, setStep] = useState(OnboardingStep.PROFILE);
  const [userName, setUserName] = useState('');
  const [medications, setMedications] = useState<Medication[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleProfileSubmit = (name: string) => {
    setUserName(name);
    setStep(OnboardingStep.MEDICATION);
  };

  const handleMedicationSubmit = (meds: Medication[]) => {
    setMedications(meds);
    setStep(OnboardingStep.CAREGIVERS);
  };

  const handleComplete = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { error: profileError } = await supabase.from('users').insert([
        {
          provider_user_id: userId!,
          email: user?.primaryEmailAddress?.emailAddress ?? '',
          name: userName,
        },
      ]);

      if (profileError) throw profileError;

      const { data: profile } = await supabase
        .from('users')
        .select('id')
        .eq('provider_user_id', userId!)
        .single();

      if (medications.length > 0 && profile) {
        const medInsert = medications.map(med => ({ ...med, subject_user_id: profile.id }));
        const { error: medError } = await supabase.from('medications').insert(medInsert);
        if (medError) throw medError;
      }

      router.replace('/(tabs)/today');
    } catch (err) {
      console.error('Failed to save onboarding data:', err);
      let errorMessage = 'An unknown error occurred. Please try again.';
      if (typeof err === 'string') {
        errorMessage = err;
      } else if (err && typeof err === 'object' && 'message' in err) {
        errorMessage = `Database Error: ${err.message}`;
      } else if (err instanceof Error) {
        errorMessage = `Error: ${err.message}`;
      }
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case OnboardingStep.PROFILE:
        return <ProfileStep onNext={handleProfileSubmit} />;
      case OnboardingStep.MEDICATION:
        return <MedicationStep onNext={handleMedicationSubmit} />;
      case OnboardingStep.CAREGIVERS:
        return <CaregiverStep onFinish={handleComplete} loading={isLoading} />;
      default:
        return null;
    }
  }

  return (
    <View style={styles.stepContainer}>
      {renderStep()}
      {error && <ThemedText style={{ color: 'red', marginTop: 20, textAlign: 'center' }}>{error}</ThemedText>}
    </View>
  )
}

const styles = StyleSheet.create({
  stepContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  title: {
    ...Typography.h1,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  subtitle: {
    ...Typography.body,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
});
