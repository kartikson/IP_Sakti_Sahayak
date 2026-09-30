export {
  validateIdentifier,
  maskIdentifier,
  sendOtp,
  verifyOtp,
  continueAsGuest,
  getStoredSession,
  saveSessionToStorage,
  clearSessionFromStorage,
} from './authService';

export { AuthProvider, useAuth } from './AuthContext';
