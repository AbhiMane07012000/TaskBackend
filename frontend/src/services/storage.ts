/**
 * Storage service for managing localStorage operations
 */

export const storageService = {
  // Generic get/set/remove methods
  set: (key: string, value: any): void => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error setting ${key} in localStorage:`, error);
    }
  },

  get: <T = any>(key: string, defaultValue?: T): T | null => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : (defaultValue ?? null);
    } catch (error) {
      console.error(`Error getting ${key} from localStorage:`, error);
      return defaultValue ?? null;
    }
  },

  remove: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing ${key} from localStorage:`, error);
    }
  },

  clear: (): void => {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  },

  // Auth-specific methods
  setToken: (token: string): void => {
    storageService.set('auth_token', token);
  },

  getToken: (): string | null => {
    return storageService.get('auth_token');
  },

  removeToken: (): void => {
    storageService.remove('auth_token');
  },

  setUser: (user: any): void => {
    storageService.set('auth_user', user);
  },

  getUser: () => {
    return storageService.get('auth_user');
  },

  removeUser: (): void => {
    storageService.remove('auth_user');
  },

  // Clear all auth data
  clearAuth: (): void => {
    storageService.removeToken();
    storageService.removeUser();
  },
};
