/**
 * IP-SAKTI Sahayak — Mock Authentication Service
 * 
 * Provides simulated authentication operations for the prototype.
 * All logic is isolated in this module to facilitate clean replacement
 * with real backend APIs in the future.
 */

const STORAGE_KEY = 'ipsakti_auth_session';

/**
 * Validate whether the identifier is a 10-digit mobile number or valid email address.
 * @param {string} identifier 
 * @returns {string} Validation error message if invalid, or empty string if valid.
 */
export function validateIdentifier(identifier) {
  const trimmed = (identifier || '').trim();
  if (!trimmed) {
    return 'Please enter your mobile number or email address.';
  }

  // 10-digit mobile number (optional +91 prefix and formatting spaces/hyphens)
  const digitsOnly = trimmed.replace(/\D/g, '');
  const isTenDigitPhone = digitsOnly.length === 10 || (digitsOnly.length === 12 && digitsOnly.startsWith('91'));
  const phonePattern = /^(\+91[-\s]?)?[6-9]\d{9}$/;

  // Standard syntactic email validation
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!phonePattern.test(trimmed) && !isTenDigitPhone && !emailPattern.test(trimmed)) {
    return 'Enter a valid 10-digit mobile number or a valid email address.';
  }

  return '';
}

/**
 * Masks an identifier for privacy and display purposes.
 * Does not retain raw identifiers in browser session.
 * @param {string} identifier 
 * @returns {string} Masked string (e.g. 98*****210 or p***r@ayush.org)
 */
export function maskIdentifier(identifier) {
  const trimmed = (identifier || '').trim();
  if (!trimmed) return '';

  if (trimmed.includes('@')) {
    const [user, domain] = trimmed.split('@');
    if (user.length <= 2) {
      return `${user[0] || ''}***@${domain}`;
    }
    return `${user[0]}***${user[user.length - 1]}@${domain}`;
  }

  // Treat as phone number
  const digits = trimmed.replace(/\D/g, '');
  const tenDigits = digits.length >= 10 ? digits.slice(-10) : digits;
  if (tenDigits.length === 10) {
    return `${tenDigits.slice(0, 2)}*****${tenDigits.slice(-3)}`;
  }

  return trimmed.length > 4 
    ? `${trimmed.slice(0, 2)}***${trimmed.slice(-2)}` 
    : '***';
}

/**
 * Simulates sending a 6-digit OTP to the provided identifier.
 * Delay: ~700ms.
 * @param {string} identifier 
 * @returns {Promise<{ success: boolean, maskedIdentifier: string }>}
 */
export function sendOtp(identifier) {
  return new Promise((resolve, reject) => {
    const errorMsg = validateIdentifier(identifier);
    if (errorMsg) {
      reject(new Error(errorMsg));
      return;
    }

    setTimeout(() => {
      resolve({
        success: true,
        maskedIdentifier: maskIdentifier(identifier),
      });
    }, 700);
  });
}

/**
 * Simulates verifying a 6-digit OTP.
 * Delay: ~600ms.
 * 
 * Special demo test codes (internal only, not displayed in UI):
 * - 000000: Simulates invalid code state
 * - 999999: Simulates expired code state
 * - Any other valid 6 digits: Succeeds in demo mode
 * 
 * @param {string} identifier 
 * @param {string} code 
 * @returns {Promise<{ ok: boolean, session: { mode: 'otp', identifier: string } }>}
 */
export function verifyOtp(identifier, code) {
  return new Promise((resolve, reject) => {
    const trimmedCode = (code || '').trim();

    if (!trimmedCode || !/^\d{6}$/.test(trimmedCode)) {
      reject(new Error('Please enter the 6-digit code.'));
      return;
    }

    setTimeout(() => {
      // Demo test code: 000000 simulates invalid code failure
      if (trimmedCode === '000000') {
        reject(new Error('That code is not valid. Check the code and try again.'));
        return;
      }

      // Demo test code: 999999 simulates expired code failure
      if (trimmedCode === '999999') {
        reject(new Error('This code has expired. Request a new code.'));
        return;
      }

      // In demo mode, any valid 6-digit code succeeds
      const masked = maskIdentifier(identifier);
      const session = {
        mode: 'otp',
        identifier: masked,
      };

      saveSessionToStorage(session);
      resolve({ ok: true, session });
    }, 600);
  });
}

/**
 * Creates a guest session immediately without delay or external verification.
 * @returns {{ mode: 'guest', identifier: string }}
 */
export function continueAsGuest() {
  const session = {
    mode: 'guest',
    identifier: 'Guest',
  };
  saveSessionToStorage(session);
  return session;
}

/**
 * Retrieve session from sessionStorage (never localStorage).
 * Returns null if absent or invalid.
 * @returns {{ mode: 'guest' | 'otp', identifier: string } | null}
 */
export function getStoredSession() {
  try {
    if (typeof sessionStorage !== 'undefined') {
      const data = sessionStorage.getItem(STORAGE_KEY);
      if (!data) return null;
      const parsed = JSON.parse(data);
      if (parsed && (parsed.mode === 'guest' || parsed.mode === 'otp')) {
        return parsed;
      }
    }
  } catch {
    // Return null if parsing fails
  }
  return null;
}

/**
 * Persists session strictly to sessionStorage.
 * @param {{ mode: 'guest' | 'otp', identifier: string }} session 
 */
export function saveSessionToStorage(session) {
  try {
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    }
  } catch {
    // Ignore storage errors in restricted contexts
  }
}

/**
 * Clears session from sessionStorage.
 */
export function clearSessionFromStorage() {
  try {
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.removeItem(STORAGE_KEY);
    }
  } catch {
    // Ignore storage errors
  }
}
