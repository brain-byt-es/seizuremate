import { supabase } from '@/lib/supabase';
import { MedicationRepository, NewMedication } from '@/repositories/MedicationRepository';

// Define a mock for the Supabase client's fluent API
const mockSupabaseQuery = {
  insert: jest.fn(),
};

// Mock the supabase client, ensuring `from` returns our query mock
jest.mock('@/lib/supabase', () => ({
  supabase: {
    from: jest.fn(() => mockSupabaseQuery),
  },
}));

const mockedSupabase = supabase as jest.Mocked<typeof supabase>;

describe('MedicationRepository', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('batchAddMedications', () => {
    it('should call supabase.insert with the correct medication data', async () => {
      const newMedications: NewMedication[] = [
        { provider_user_id: 'user-123', name: 'Keppra', dosage: '500mg' },
        { provider_user_id: 'user-123', name: 'Lamictal', dosage: '100mg' },
      ];

      // Mock a successful response
      (mockSupabaseQuery.insert as jest.Mock).mockResolvedValueOnce({ error: null });

      await MedicationRepository.batchAddMedications(newMedications);

      expect(mockedSupabase.from).toHaveBeenCalledWith('medications');
      expect(mockSupabaseQuery.insert).toHaveBeenCalledWith(newMedications);
    });

    it('should not call supabase.insert if the medications array is empty', async () => {
      await MedicationRepository.batchAddMedications([]);

      expect(mockedSupabase.from).not.toHaveBeenCalled();
      expect(mockSupabaseQuery.insert).not.toHaveBeenCalled();
    });

    it('should throw an error if the insert operation fails', async () => {
      const newMedications: NewMedication[] = [
        { provider_user_id: 'user-123', name: 'Keppra', dosage: '500mg' },
      ];
      const mockError = new Error('Insert failed');

      // Mock a failed response
      (mockSupabaseQuery.insert as jest.Mock).mockResolvedValueOnce({ error: mockError });

      await expect(MedicationRepository.batchAddMedications(newMedications)).rejects.toThrow(mockError);
    });
  });
});