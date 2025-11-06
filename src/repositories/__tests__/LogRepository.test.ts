import { supabase } from '@/lib/supabase';
import { Log, LogRepository, NewLog } from '@/repositories/LogRepository';

// Define a more structured mock for the Supabase client's fluent (chained) API
const mockSupabaseQuery = {
  select: jest.fn().mockReturnThis(),
  insert: jest.fn().mockReturnThis(),
  eq: jest.fn().mockReturnThis(),
  single: jest.fn(),
};

// Mock the supabase client, ensuring `from()` returns our query mock object
jest.mock('@/lib/supabase', () => ({
  supabase: {
    from: jest.fn(() => mockSupabaseQuery),
  },
}));

// Create a typed mock for easier usage and type-safety in tests
const mockedSupabase = supabase as jest.Mocked<typeof supabase> & {
  from: jest.Mock<typeof mockSupabaseQuery>;
};

describe('LogRepository', () => {
  beforeEach(() => {
    // Clear all mock implementations and calls before each test
    jest.clearAllMocks();
  });

  describe('getLogsByUserId', () => {
    it('should fetch and return logs for a given user ID', async () => {
      const mockLogs: Log[] = [
        { id: '1', user_id: 'user-123', created_at: new Date().toISOString(), type: 'seizure' },
        { id: '2', user_id: 'user-123', created_at: new Date().toISOString(), type: 'medication' },
      ];

      // Setup the mock response for a successful fetch
      (mockSupabaseQuery.eq as jest.Mock).mockResolvedValue({
        data: mockLogs,
        error: null,
      });

      const logs = await LogRepository.getLogsByUserId('user-123');

      expect(logs).toEqual(mockLogs);
      expect(mockedSupabase.from).toHaveBeenCalledWith('logs');
      expect(mockSupabaseQuery.select).toHaveBeenCalledWith('*');
      expect(mockSupabaseQuery.eq).toHaveBeenCalledWith('user_id', 'user-123');
    });

    it('should return an empty array if no logs are found', async () => {
      (mockSupabaseQuery.eq as jest.Mock).mockResolvedValue({
        data: [],
        error: null,
      });

      const logs = await LogRepository.getLogsByUserId('user-404');

      expect(logs).toEqual([]);
    });

    it('should throw an error if the Supabase query fails', async () => {
      const mockError = new Error('Database connection failed');
      (mockSupabaseQuery.eq as jest.Mock).mockResolvedValue({
        data: null,
        error: mockError,
      });

      await expect(LogRepository.getLogsByUserId('user-123')).rejects.toThrow(mockError);
    });
  });

  describe('addLog', () => {
    it('should add a new log and return the created log object', async () => {
      const newLog: NewLog = {
        user_id: 'user-123',
        type: 'seizure',
        note: 'A test note',
      };
      const createdLog: Log = {
        id: '3',
        created_at: new Date().toISOString(),
        ...newLog,
      };

      // Setup the mock response for a successful insert
      (mockSupabaseQuery.single as jest.Mock).mockResolvedValue({
        data: createdLog,
        error: null,
      });

      const result = await LogRepository.addLog(newLog);

      expect(result).toEqual(createdLog);
      expect(mockedSupabase.from).toHaveBeenCalledWith('logs');
      expect(mockSupabaseQuery.insert).toHaveBeenCalledWith(newLog);
      expect(mockSupabaseQuery.select).toHaveBeenCalled();
      expect(mockSupabaseQuery.single).toHaveBeenCalled();
    });

    it('should throw an error if the insert operation fails', async () => {
      const newLog: NewLog = { user_id: 'user-123', type: 'seizure' };
      const mockError = new Error('Insert failed');

      (mockSupabaseQuery.single as jest.Mock).mockResolvedValue({
        data: null,
        error: mockError,
      });

      await expect(LogRepository.addLog(newLog)).rejects.toThrow(mockError);
    });

    it('should throw an error if Supabase returns no data after insert', async () => {
      const newLog: NewLog = { user_id: 'user-123', type: 'seizure' };

      (mockSupabaseQuery.single as jest.Mock).mockResolvedValue({
        data: null,
        error: null,
      });

      await expect(LogRepository.addLog(newLog)).rejects.toThrow(
        'Failed to add log: No data returned from Supabase.'
      );
    });
  });
});