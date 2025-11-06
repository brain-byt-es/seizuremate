import { useAuth } from '@clerk/clerk-expo';
import React, {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useState,
} from 'react';
import { MedicationRepository, NewMedication } from '../repositories/MedicationRepository';
import { UserRepository } from '../repositories/UserRepository';

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
  state: OnboardingState;
  isSubmitting: boolean;
  error: string | null;
  nextStep: () => void;
  prevStep: () => void;
  updateProfile: (data: Partial<ProfileData>) => void;
  addMedication: (medication: MedicationData) => void;
  finishOnboarding: (onOnboardingComplete: () => void) => Promise<void>;
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
  const { userId } = useAuth();
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

  const finishOnboarding = useCallback(async (onOnboardingComplete: () => void) => {
    if (!userId) {
      throw new Error('Cannot finish onboarding: User is not signed in.');
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // 1. Update the user's profile
      if (state.profile.name) {
        await UserRepository.updateUserProfile(userId, { full_name: state.profile.name });
      }

      // 2. Add the medications
      if (state.medications.length > 0) {
        const newMedications: NewMedication[] = state.medications.map((med) => ({
          provider_user_id: userId,
          name: med.name,
          dosage: med.dosage,
        }));
        await MedicationRepository.batchAddMedications(newMedications);
      }

      // On success, call the callback to update the app's state
      onOnboardingComplete();
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
      setError('Could not save your information. Please try again.');
      console.error('OnboardingContext: Failed to finish onboarding.', e);
      throw new Error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  }, [userId, state.profile, state.medications]);

  const value = {
    state,
    isSubmitting,
    error,
    nextStep,
    prevStep,
    updateProfile,
    addMedication,
    finishOnboarding,
  };

  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  );
};