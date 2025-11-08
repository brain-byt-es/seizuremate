import { useAuth, useUser } from '@clerk/clerk-expo';
export function useClerkSession() {
  const { isSignedIn, getToken, signOut } = useAuth();
  const { user, isLoaded } = useUser();
  return { ready: isLoaded, isSignedIn: !!isSignedIn, user, getToken, signOut };
}
