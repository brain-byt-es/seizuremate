import { createClient, SupabaseClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';
import 'react-native-url-polyfill/auto';

// getToken: () => Promise<string | null>
export function makeSupabase(getToken: () => Promise<string | null>): SupabaseClient {
  const { supabaseUrl, supabaseAnonKey } = Constants.expoConfig!.extra as any;

  // Wrap fetch to inject Authorization: Bearer <clerk_jwt> at call time
  const authFetch: typeof fetch = async (input, init = {}) => {
    const token = await getToken();
    const headers = new Headers(init.headers || {});
    if (token) headers.set('Authorization', `Bearer ${token}`);
    return fetch(input as RequestInfo, { ...init, headers });
  };

  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,       // we are NOT using Supabase Auth
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
    global: { fetch: authFetch },
  });
}
