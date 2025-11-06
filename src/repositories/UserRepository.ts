import { supabase } from '../lib/supabase';

/**
 * Represents the data that can be updated on a user's profile.
 */
export interface UserProfileUpdate {
  full_name?: string;
  // Add other profile fields from your 'users' table here
}

export class UserRepository {
  /**
   * Updates a user's profile in the database.
   * @param userId The user's Clerk ID (provider_user_id).
   * @param profileData The profile data to update.
   */
  static async updateUserProfile(userId: string, profileData: UserProfileUpdate): Promise<void> {
    const { error } = await supabase.from('users').update(profileData).eq('provider_user_id', userId);

    if (error) {
      console.error('Error updating user profile:', error.message);
      throw error;
    }
  }
}