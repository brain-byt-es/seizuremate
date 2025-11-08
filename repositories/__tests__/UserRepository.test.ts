import { supabase } from '@/lib/supabase';
import { UserProfileUpdate, UserRepository } from '@/repositories/UserRepository';

// Define a mock for the Supabase client's fluent API
const mockSupabaseQuery = {
  update: jest.fn().mockReturnThis(),
  eq: jest.fn(),
};

// Mock the supabase client, ensuring `from` returns our query mock
jest.mock('@/lib/supabase', () => ({
  supabase: {
    from: jest.fn(() => mockSupabaseQuery),
  },
}));

const mockedSupabase = supabase as jest.Mocked<typeof supabase>;

describe('UserRepository', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('updateUserProfile', () => {
    it('should call supabase.update with the correct parameters', async () => {
      const userId = 'user-123';
      const profileData: UserProfileUpdate = { full_name: 'Jane Doe' };

      // Mock a successful response
      (mockSupabaseQuery.eq as jest.Mock).mockResolvedValueOnce({ error: null });

      await UserRepository.updateUserProfile(userId, profileData);

      expect(mockedSupabase.from).toHaveBeenCalledWith('users');
      expect(mockSupabaseQuery.update).toHaveBeenCalledWith(profileData);
      expect(mockSupabaseQuery.eq).toHaveBeenCalledWith('provider_user_id', userId);
    });

    it('should throw an error if the update operation fails', async () => {
      const userId = 'user-123';
      const profileData: UserProfileUpdate = { full_name: 'Jane Doe' };
      const mockError = new Error('Update failed');

      // Mock a failed response
      (mockSupabaseQuery.eq as jest.Mock).mockResolvedValueOnce({ error: mockError });

      await expect(UserRepository.updateUserProfile(userId, profileData)).rejects.toThrow(mockError);
    });
  });
});