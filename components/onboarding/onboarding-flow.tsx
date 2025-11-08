
import { useAuth, useUser } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { View } from 'react-native';

import { Text } from '@/components/nativewindui/Text';
import { makeSupabase } from '@/lib/supabase';
import { CaregiverStep } from './caregiver-step';
import { MedicationStep } from './medication-step';
import { ProfileStep } from './profile-step';

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
  const { userId, getToken } = useAuth();
  const supabase = makeSupabase(getToken);
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
    <View className="flex-1 justify-center items-center p-6">
      {renderStep()}
      {error && <Text className="text-destructive mt-5 text-center">{error}</Text>}
    </View>
  );
}
