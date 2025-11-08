// src/repositories/LogRepository.ts
import { supabase } from '../lib/supabase';

export interface Log {
  id: string;
  user_id: string;
  created_at: string;
  note?: string;
  duration?: number;
  type: 'seizure' | 'medication' | 'symptom'; // Example types
}

/** Data needed to create a new log, omitting auto-generated fields. */
export type NewLog = Omit<Log, 'id' | 'created_at'>;

export class LogRepository {
  static async getLogsByUserId(userId: string, startDate?: string, endDate?: string): Promise<Log[]> {
    let query = supabase
      .from('logs')
      .select(`*`)
      .eq('user_id', userId);

    if (startDate) {
      query = query.gte('created_at', startDate);
    }
    if (endDate) {
      query = query.lte('created_at', endDate);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching logs:', error.message);
      // We throw the error so the calling code can handle it.
      throw error;
    }

    return data || [];
  }

  static async addLog(logData: NewLog): Promise<Log> {
    const { data, error } = await supabase
      .from('logs')
      .insert(logData)
      .select()
      .single(); // Use .single() to get the created object back, not an array

    if (error) {
      console.error('Error adding log:', error.message);
      throw error;
    }

    if (!data) {
      throw new Error('Failed to add log: No data returned from Supabase.');
    }

    return data;
  }
}
