import { SupabaseClient } from '@supabase/supabase-js';

/**
 * Represents the data for a new medication to be inserted.
 * Assumes a 'medications' table with these columns.
 */
export interface NewMedication {
  subject_user_id: string;
  name: string;
  dose: string;
}

export class MedicationRepository {
  private supabase: SupabaseClient;

  constructor(supabaseClient: SupabaseClient) {
    this.supabase = supabaseClient;
  }

  /**
   * Inserts multiple medication records for a user.
   * @param medications An array of new medication objects.
   */
  async batchAddMedications(medications: NewMedication[]): Promise<void> {
    if (medications.length === 0) return;

    const { error } = await this.supabase.from('medications').insert(medications);

    if (error) {
      console.error('Error adding medications:', error.message);
      throw error;
    }
  }
}