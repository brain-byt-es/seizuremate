import AsyncStorage from '@react-native-async-storage/async-storage';
import { z } from 'zod';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

// 1. Define a Zod schema for validation. This ensures data integrity.
const UserPrefsSchema = z.object({
  trackingRole: z.enum(['self', 'caregiver']).nullable(),
  region: z.string().nullable(),
  seizureTypes: z.array(z.string()).default(['unsure']),
  mainGoal: z.enum(['triggers', 'medication', 'doctor', 'caregiver']).nullable(),
  frequencyBand: z.enum(['monthly', 'weekly', 'daily']).default('weekly'),
  trackMedication: z.boolean().nullable(),
  calmMode: z.boolean().default(false),
  // `notificationsEnabled` will be handled by the device's permission status
  // and a separate action if needed, so we can omit it from this specific store for now.
  researchOptIn: z.boolean().default(false),
  onboardingCompleted: z.boolean().default(false),
});

// 2. Define the store's state and actions interface.
type UserPrefsState = z.infer<typeof UserPrefsSchema>;

interface UserPrefsActions {
  setTrackingRole: (role: 'self' | 'caregiver') => void;
  setRegion: (region: string) => void;
  setSeizureTypes: (types: string[]) => void;
  setMainGoal: (goal: 'triggers' | 'medication' | 'doctor' | 'caregiver') => void;
  setFrequencyBand: (band: 'monthly' | 'weekly' | 'daily') => void;
  setTrackMedication: (track: boolean) => void;
  setCalmMode: (enabled: boolean) => void;
  setResearchOptIn: (optIn: boolean) => void;
  setOnboardingCompleted: (completed: boolean) => void;
  reset: () => void;
}

// 3. Create the Zustand store with persist middleware.
export const useUserPrefsStore = create<UserPrefsState & UserPrefsActions>()(
  persist(
    (set) => ({
      // Default values
      ...UserPrefsSchema.parse({}),

      // Actions
      setTrackingRole: (role) => set({ trackingRole: role }),
      setRegion: (region) => set({ region }),
      setSeizureTypes: (types) => set({ seizureTypes: types }),
      setMainGoal: (goal) => set({ mainGoal: goal }),
      setFrequencyBand: (band) => set({ frequencyBand: band }),
      setTrackMedication: (track) => set({ trackMedication: track }),
      setCalmMode: (enabled) => set({ calmMode: enabled }),
      setResearchOptIn: (optIn) => set({ researchOptIn: optIn }),
      setOnboardingCompleted: (completed) => set({ onboardingCompleted: completed }),
      reset: () => set(UserPrefsSchema.parse({})),
    }),
    {
      name: 'user-preferences-storage', // Key in AsyncStorage
      storage: createJSONStorage(() => AsyncStorage), // Use AsyncStorage
      // This merge function runs when state is loaded from storage.
      // It ensures the loaded state is valid, otherwise it returns the default state.
      merge: (persistedState, currentState) => {
        const result = UserPrefsSchema.safeParse(persistedState);
        if (result.success) {
          // If stored data is valid, merge it with the current state (which has the actions).
          return { ...currentState, ...result.data };
        }
        // If stored data is invalid, log a warning and return the default initial state.
        console.warn('Invalid user preferences in storage, resetting to default.');
        return currentState;
      },
    }
  )
);