import client from './client';
import { User, PaginatedResponse } from '../../types/models';
import { UpdateUserRequest, ChangePasswordRequest } from '../../types/api';

export const usersService = {
  // Get all users with pagination
  getAll: async (page: number = 1, limit: number = 10): Promise<PaginatedResponse<User>> => {
    const response = await client.get<PaginatedResponse<User>>('/users', {
      params: { page, limit },
    });
    return response.data;
  },

  // Get user by ID
  getById: async (id: number): Promise<User> => {
    const response = await client.get<User>(`/users/${id}`);
    return response.data;
  },

  // Update user
  update: async (id: number, data: UpdateUserRequest): Promise<User> => {
    const response = await client.put<User>(`/users/${id}`, data);
    return response.data;
  },

  // Change password
  changePassword: async (id: number, data: ChangePasswordRequest): Promise<any> => {
    const response = await client.post(`/users/${id}/change-password`, data);
    return response.data;
  },

  // Delete user (admin only)
  delete: async (id: number): Promise<void> => {
    await client.delete(`/users/${id}`);
  },

  // Update user role (admin only)
  updateRole: async (id: number, role: string): Promise<User> => {
    const response = await client.patch<User>(`/users/${id}/role`, { role });
    return response.data;
  },

  // Search users
  search: async (query: string): Promise<User[]> => {
    const response = await client.get<User[]>('/users/search', {
      params: { query },
    });
    return response.data;
  },
};
