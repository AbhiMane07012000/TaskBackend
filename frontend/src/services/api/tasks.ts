import client from './client';
import { Task, PaginatedResponse } from '../../types/models';
import { CreateTaskRequest, UpdateTaskRequest } from '../../types/api';

export const tasksService = {
  // Get all tasks with filtering
  getAll: async (params?: {
    page?: number;
    limit?: number;
    projectId?: number;
    status?: string;
    assigneeId?: number;
  }): Promise<PaginatedResponse<Task>> => {
    const response = await client.get<PaginatedResponse<Task>>('/tasks', { params });
    return response.data;
  },

  // Get task by ID
  getById: async (id: number): Promise<Task> => {
    const response = await client.get<Task>(`/tasks/${id}`);
    return response.data;
  },

  // Create a new task
  create: async (data: CreateTaskRequest): Promise<Task> => {
    const response = await client.post<Task>('/tasks', data);
    return response.data;
  },

  // Update a task
  update: async (id: number, data: UpdateTaskRequest): Promise<Task> => {
    const response = await client.patch<Task>(`/tasks/${id}`, data);
    return response.data;
  },

  // Delete a task
  delete: async (id: number): Promise<void> => {
    await client.delete(`/tasks/${id}`);
  },

  // Update task status
  updateStatus: async (id: number, status: string): Promise<Task> => {
    const response = await client.patch<Task>(`/tasks/${id}/status`, { status });
    return response.data;
  },

  // Get tasks by project
  getByProject: async (
    projectId: number,
    params?: { page?: number; limit?: number }
  ): Promise<PaginatedResponse<Task>> => {
    const response = await client.get<PaginatedResponse<Task>>(`/projects/${projectId}/tasks`, {
      params,
    });
    return response.data;
  },
};
