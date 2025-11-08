import { useAuth } from '@clerk/clerk-expo';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';
import { createContext, useContext, useMemo } from 'react';
import 'react-native-url-polyfill/auto';

export const SupabaseContext = createContext<{
  supabase: SupabaseClient | null;
  isSupabaseReady: boolean;
}>({
  supabase: null,
  isSupabaseReady: false,
});

export function SupabaseProvider({ children }: { children: React.ReactNode }) {
  const { getToken } = useAuth();
  const { supabaseUrl, supabaseAnonKey } = Constants.expoConfig!.extra as any;

  const supabase = useMemo(() => {
    // Wrap fetch to inject Authorization: Bearer <clerk_jwt> at call time
    const authFetch: typeof fetch = async (input, init = {}) => {
      // NOTE: you might want to get a template token here if you use Supabase JWT templates in Clerk
      const token = await getToken();
      const headers = new Headers(init.headers || {});
      if (token) headers.set('Authorization', `Bearer ${token}`);
      return fetch(input as RequestInfo, { ...init, headers });
    };

    return createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false, // we are NOT using Supabase Auth
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
      global: { fetch: authFetch },
    });
  }, [getToken, supabaseUrl, supabaseAnonKey]);

  return <SupabaseContext.Provider value={{ supabase, isSupabaseReady: !!supabase }}>{children}</SupabaseContext.Provider>;
}

export const useSupabase = () => useContext(SupabaseContext);
