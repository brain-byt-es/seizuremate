import { useAuth } from '@clerk/clerk-expo';
import React, {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import { MedicationRepository, NewMedication } from '../repositories/MedicationRepository';
import { useSupabase } from './SupabaseContext';

// Define the shape of the data we'll collect
interface ProfileData {
  name: string;
  // ... other profile fields like date of birth, etc.
}

interface MedicationData {
  id: string; // Could be a nanoid
  name: string;
  dosage: string;
  // ... other medication fields
}

interface OnboardingState {
  currentStep: number;
  profile: Partial<ProfileData>;
  medications: MedicationData[];
}

interface OnboardingContextType {
  hasOnboarded: boolean;
  state: OnboardingState;
  isSubmitting: boolean;
  error: string | null;
  nextStep: () => void;
  prevStep: () => void;
  updateProfile: (data: Partial<ProfileData>) => void;
  addMedication: (medication: MedicationData) => void;
  finishOnboarding: () => Promise<void>;
  checkOnboardingStatus: () => Promise<void>;
  // ... other actions like removeMedication, etc.
}

const OnboardingContext = createContext<OnboardingContextType>(null!);

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
};

export const OnboardingProvider = ({ children }: PropsWithChildren) => {
  const { userId } = useAuth(); // Added isLoaded for check
  const { supabase } = useSupabase();
  const [hasOnboarded, setHasOnboarded] = useState(false);
  const [state, setState] = useState<OnboardingState>({
    currentStep: 0,
    profile: {},
    medications: [],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const nextStep = useCallback(() => {
    setState((prevState) => ({ ...prevState, currentStep: prevState.currentStep + 1 }));
  }, []);

  const prevStep = useCallback(() => {
    setState((prevState) => ({ ...prevState, currentStep: prevState.currentStep - 1 }));
  }, []);

  const updateProfile = useCallback((data: Partial<ProfileData>) => {
    setState((prevState) => ({
      ...prevState,
      profile: { ...prevState.profile, ...data },
    }));
  }, []);

  const addMedication = useCallback((medication: MedicationData) => {
    setState((prevState) => ({
      ...prevState,
      medications: [...prevState.medications, medication],
    }));
  }, []);

  const checkOnboardingStatus = useCallback(async () => {
    if (!userId || !supabase) {
      setHasOnboarded(false);
      return;
    }
    const { data, error } = await supabase
      .from('users')
      .select('id')
      .eq('provider_user_id', userId)
      .maybeSingle();

    if (error) console.error('Error checking onboarding status:', error);
    setHasOnboarded(!!data);
  }, [userId, supabase]);

  const finishOnboarding = useCallback(async () => {
    setIsSubmitting(true);
    setError(null);
    if (!supabase) throw new Error('Supabase client is not available.');

    try {
      // The user profile is already created/updated by the Edge Function.
      // We only need to save the medications here.
      if (state.medications.length > 0) {
        // We need the internal Supabase user ID to link the medications.
        const { data: userRecord } = await supabase
            .from('users')
            .select('id')
            .eq('provider_user_id', userId)
            .single();

        if (!userRecord) throw new Error('Could not find user profile to link medications.');

        const newMedications: NewMedication[] = state.medications.map((med) => ({
          subject_user_id: userRecord.id, // Use the Supabase user UUID
          name: med.name,
          dose: med.dosage,
        }));
        const medicationRepo = new MedicationRepository(supabase);
        await medicationRepo.batchAddMedications(newMedications);
      }

      // On success, update the onboarding status
      setHasOnboarded(true);
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
      setError('Could not save your information. Please try again.');
      console.error('OnboardingContext: Failed to finish onboarding.', e);
      throw new Error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  }, [state.medications, userId, supabase]);

  const value = useMemo(() => ({
      hasOnboarded,
      state,
      isSubmitting,
      error,
      nextStep,
      prevStep,
      updateProfile,
      addMedication,
      finishOnboarding,
      checkOnboardingStatus,
    }),
    [hasOnboarded, state, isSubmitting, error, nextStep, prevStep, updateProfile, addMedication, finishOnboarding, checkOnboardingStatus]
  );

  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  );
};