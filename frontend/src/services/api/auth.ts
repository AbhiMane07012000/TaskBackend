import client from './client';
import { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from '../../types/api';

export const authService = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await client.post<LoginResponse>('/auth/login', data);
    return response.data;
  },

  register: async (data: RegisterRequest): Promise<RegisterResponse> => {
    const response = await client.post<RegisterResponse>('/auth/register', data);
    return response.data;
  },

  logout: async (): Promise<void> => {
    try {
      await client.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    }
  },

  getCurrentUser: async () => {
    const response = await client.get('/auth/me');
    return response.data;
  },
};
