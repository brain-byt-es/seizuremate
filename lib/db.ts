import { useClerkSession } from './auth';
import { makeSupabase } from './supabase';
export function useDb() {
  const { getToken } = useClerkSession();
  // Important: memoize in your app; safe to create once per app session
  return makeSupabase(() => getToken({ template: 'supabase' })); // optional: Clerk JWT template name
}
