import { supabase } from '../lib/supabase';

/**
 * Represents the data for a new medication to be inserted.
 * Assumes a 'medications' table with these columns.
 */
export interface NewMedication {
  provider_user_id: string;
  name: string;
  dosage: string;
}

export class MedicationRepository {
  /**
   * Inserts multiple medication records for a user.
   * @param medications An array of new medication objects.
   */
  static async batchAddMedications(medications: NewMedication[]): Promise<void> {
    if (medications.length === 0) return;

    const { error } = await supabase.from('medications').insert(medications);

    if (error) {
      console.error('Error adding medications:', error.message);
      throw error;
    }
  }
}