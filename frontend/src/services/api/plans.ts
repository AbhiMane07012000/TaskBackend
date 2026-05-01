import client from './client';
import { Plan } from '../../types/models';

export const plansService = {
  // Get all plans
  getAll: async (): Promise<Plan[]> => {
    const response = await client.get<Plan[]>('/plans');
    return response.data;
  },

  // Get plan by ID
  getById: async (id: number): Promise<Plan> => {
    const response = await client.get<Plan>(`/plans/${id}`);
    return response.data;
  },

  // Create a plan (admin only)
  create: async (data: Partial<Plan>): Promise<Plan> => {
    const response = await client.post<Plan>('/plans', data);
    return response.data;
  },

  // Update a plan (admin only)
  update: async (id: number, data: Partial<Plan>): Promise<Plan> => {
    const response = await client.put<Plan>(`/plans/${id}`, data);
    return response.data;
  },

  // Delete a plan (admin only)
  delete: async (id: number): Promise<void> => {
    await client.delete(`/plans/${id}`);
  },
};
