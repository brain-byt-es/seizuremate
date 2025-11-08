import { Log, LogRepository, NewLog } from '@/repositories/LogRepository';
import { useAuth } from '@clerk/clerk-expo';
import React, {
    createContext,
    PropsWithChildren,
    useCallback,
    useContext,
    useState
} from 'react';

/**
 * Defines the shape of the context's value.
 * This is what components will receive when they use the `useLogs` hook.
 */
interface LogsContextType {
  logs: Log[];
  fetchLogs: (startDate?: string, endDate?: string) => Promise<Log[]>;
  addLog: (logData: NewLog) => Promise<void>;
}

// Create the context with a default value.
// The `!` assertion is safe here because we check for provider existence in the hook.
const LogsContext = createContext<LogsContextType>(null!);

/**
 * Custom hook to easily access the LogsContext.
 * It ensures that the hook is used within a LogsProvider.
 */
export const useLogs = () => {
  const context = useContext(LogsContext);
  if (!context) {
    throw new Error('useLogs must be used within a LogsProvider');
  }
  return context;
};

/**
 * The provider component that wraps parts of the app needing access to logs.
 * It contains the state and logic for fetching and managing log data.
 */
export const LogsProvider = ({ children }: PropsWithChildren) => {
  const { userId } = useAuth();
  const [logs, setLogs] = useState<Log[]>([]);

  const fetchLogs = useCallback(async (startDate?: string, endDate?: string) => {
    if (!userId) {
      console.warn('fetchLogs called without a userId.');
      return [];
    }

    try {
      const fetchedLogs = await LogRepository.getLogsByUserId(userId, startDate, endDate);
      setLogs(fetchedLogs);
      return fetchedLogs;
    } catch (e) {
      console.error('LogsContext: Failed to fetch logs.', e);
      throw new Error('Can’t connect right now. We’ll save your entry and try again soon.');
    }
  }, [userId]);

  const addLog = useCallback(
    async (logData: NewLog) => {
      if (!userId) {
        throw new Error('Cannot add log: User is not signed in.');
      }

      // No need to set isLoading here to avoid a full-screen loader on add
      try {
        await LogRepository.addLog({ ...logData, user_id: userId });
        // Refresh the logs list to include the new one.
        await fetchLogs();
      } catch (e) {
        console.error('LogsContext: Failed to add log.', e);
        // Re-throw the error so the calling component knows the operation failed.
        throw e;
      }
    },
    [userId, fetchLogs]
  );

  const value = {
    logs,
    fetchLogs,
    addLog,
  };

  return <LogsContext.Provider value={value}>{children}</LogsContext.Provider>;
};