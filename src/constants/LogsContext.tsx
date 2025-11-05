import { supabase } from '@/lib/supabase';
import { useAuth } from '@clerk/clerk-expo';
import React, { createContext, useCallback, useContext, useState } from 'react';

export type Log = {
  id: number;
  user_id: string;
  created_at: string;
  type: 'seizure' | 'meds' | 'symptom';
  intensity?: number;
  name?: string;
  time?: string;
  icon?: string;
  duration?: number; // duration in seconds
  logged_at: string; // yyyy-MM-dd format
};

interface LogsContextType {
  logs: Record<string, Log[]>;
  loading: boolean;
  fetchLogs: (startDate: string, endDate: string) => Promise<void>;
}

const LogsContext = createContext<LogsContextType | undefined>(undefined);

export const LogsProvider = ({ children }: { children: React.ReactNode }) => {
  const { userId } = useAuth();
  const [logs, setLogs] = useState<Record<string, Log[]>>({});
  const [loading, setLoading] = useState(false);

  const fetchLogs = useCallback(async (startDate: string, endDate: string) => {
    if (!userId) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('logs')
        .select('*')
        .eq('user_id', userId)
        .gte('logged_at', startDate)
        .lte('logged_at', endDate);

      if (error) throw error;

      const groupedLogs = data.reduce((acc, log) => {
        const date = log.logged_at;
        if (!acc[date]) {
          acc[date] = [];
        }
        acc[date].push(log);
        return acc;
      }, {} as Record<string, Log[]>);

      setLogs(groupedLogs);
    } catch (error) {
      console.error('Error fetching logs:', error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  return <LogsContext.Provider value={{ logs, loading, fetchLogs }}>{children}</LogsContext.Provider>;
};

export const useLogs = () => {
  const context = useContext(LogsContext);
  if (context === undefined) {
    throw new Error('useLogs must be used within a LogsProvider');
  }
  return context;
};

