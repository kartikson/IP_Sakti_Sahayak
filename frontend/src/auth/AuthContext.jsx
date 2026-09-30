import { createContext, useContext, useState, useCallback, useMemo } from 'react';
import {
  getStoredSession,
  saveSessionToStorage,
  clearSessionFromStorage,
  continueAsGuest,
} from './authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => getStoredSession());

  const isAuthenticated = Boolean(session && session.mode);
  const isGuest = session?.mode === 'guest';

  const loginWithOtp = useCallback((maskedIdentifier) => {
    const newSession = {
      mode: 'otp',
      identifier: maskedIdentifier,
    };
    saveSessionToStorage(newSession);
    setSession(newSession);
    return newSession;
  }, []);

  const loginGuest = useCallback(() => {
    const guestSession = continueAsGuest();
    setSession(guestSession);
    return guestSession;
  }, []);

  const logout = useCallback(() => {
    clearSessionFromStorage();
    setSession(null);
  }, []);

  const value = useMemo(
    () => ({
      session,
      isAuthenticated,
      isGuest,
      mode: session?.mode || null,
      identifier: session?.identifier || '',
      loginWithOtp,
      loginAsGuest: loginGuest,
      logout,
    }),
    [session, isAuthenticated, isGuest, loginWithOtp, loginGuest, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
