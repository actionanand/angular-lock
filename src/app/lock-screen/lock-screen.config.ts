export interface LockScreenConfig {
  /**
   * SHA1 hash of the password
   * Example: SHA1('password123') = 'cbfdac6008f9cab4083784cbd1874f76618d2a97'
   * You can generate SHA1 hash at: https://emn178.github.io/online-tools/sha1.html
   */
  passwordHash: string;

  /**
   * Expiry time in milliseconds (0 means no expiry)
   * Examples:
   * - 0: No expiry
   * - 3600000: 1 hour
   * - 86400000: 24 hours
   */
  expiryTime: number;

  /**
   * Key used to store the authentication data in localStorage
   */
  storageKey: string;

  /**
   * UI Configuration
   */
  ui: {
    title: string;
    message: string;
    successMessage: string;
    errorMessage: string;
    unlockButtonText: string;
    passwordPlaceholder: string;
  };
}

// Default SHA1 hash for 'password123'
const DEFAULT_PASSWORD_HASH = 'cbfdac6008f9cab4083784cbd1874f76618d2a97';

/**
 * Get password hash from environment variable or use default
 * 
 * Priority order:
 * 1. window.__env.PASSWORD_HASH (runtime injection via index.html)
 * 2. DEFAULT_PASSWORD_HASH (fallback)
 * 
 * To use custom password hash:
 * - Add to index.html: window.__env = { PASSWORD_HASH: 'your-hash' };
 * - Or modify DEFAULT_PASSWORD_HASH constant above
 * - Or use Angular environment files (see environments/environment.ts)
 */
const getPasswordHash = (): string => {
  // Check for browser environment variables (if injected during build/runtime)
  if (typeof window !== 'undefined') {
    const win = window as Window & { __env?: { PASSWORD_HASH?: string } };
    if (win.__env?.PASSWORD_HASH) {
      return win.__env.PASSWORD_HASH;
    }
  }
  
  return DEFAULT_PASSWORD_HASH;
};

export const LOCK_SCREEN_CONFIG: LockScreenConfig = {
  // Default password is 'password123'
  // SHA1 hash: cbfdac6008f9cab4083784cbd1874f76618d2a97
  // Can be overridden with PASSWORD_HASH environment variable
  passwordHash: getPasswordHash(),
  
  // No expiry by default (set to 0)
  // To set 1 hour expiry: 3600000
  // To set 24 hours expiry: 86400000
  expiryTime: 0,
  
  storageKey: 'angular_lock_auth',
  
  ui: {
    title: 'Locked Screen',
    message: 'Please enter your password to unlock the application',
    successMessage: 'Access granted!',
    errorMessage: 'Invalid password. Please try again.',
    unlockButtonText: 'Unlock',
    passwordPlaceholder: 'Enter password'
  }
};
