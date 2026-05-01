import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types/models';
import { LoginRequest, RegisterRequest } from '../types/api';
import { authService } from '../services/api/auth';
import { storageService } from '../services/storage';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const token = storageService.getToken();
        const storedUser = storageService.getUser();
        
        if (token && storedUser) {
          setUser(storedUser);
        }
      } catch (err) {
        console.error('Error initializing auth:', err);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (credentials: LoginRequest): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authService.login(credentials);
      storageService.setToken(response.accessToken);

      const meResponse = await authService.getCurrentUser();
      const currentUser = meResponse.user;
      const derivedFirstName = currentUser.firstName || currentUser.username || '';
      const userData: User = {
        id: currentUser.id,
        firstName: derivedFirstName,
        lastName: currentUser.lastName || '',
        email: currentUser.email,
        role: String(currentUser.role).toLowerCase() as 'admin' | 'user' | 'guest',
        createdAt: currentUser.createdAt,
        updatedAt: currentUser.updatedAt,
      };
      
      storageService.setUser(userData);
      setUser(userData);
    } catch (err: any) {
      const message = err.response?.data?.message || 'Login failed';
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterRequest): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      await authService.register(data);
      await login({ email: data.email, password: data.password });
    } catch (err: any) {
      const message = err.response?.data?.message || 'Registration failed';
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    setIsLoading(true);
    try {
      await authService.logout();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      storageService.clearAuth();
      setUser(null);
      setIsLoading(false);
    }
  };

  const clearError = (): void => {
    setError(null);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    error,
    login,
    register,
    logout,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
