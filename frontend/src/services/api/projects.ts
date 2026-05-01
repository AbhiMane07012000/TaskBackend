import client from './client';
import { Project, PaginatedResponse } from '../../types/models';
import { CreateProjectRequest, UpdateProjectRequest, AddProjectMemberRequest } from '../../types/api';

export const projectsService = {
  // Get all projects with pagination
  getAll: async (page: number = 1, limit: number = 10): Promise<PaginatedResponse<Project>> => {
    const response = await client.get<PaginatedResponse<Project>>('/projects', {
      params: { page, limit },
    });
    return response.data;
  },

  // Get project by ID
  getById: async (id: number): Promise<Project> => {
    const response = await client.get<Project>(`/projects/${id}`);
    return response.data;
  },

  // Create a new project
  create: async (data: CreateProjectRequest): Promise<Project> => {
    const response = await client.post<Project>('/projects', data);
    return response.data;
  },

  // Update a project
  update: async (id: number, data: UpdateProjectRequest): Promise<Project> => {
    const response = await client.put<Project>(`/projects/${id}`, data);
    return response.data;
  },

  // Delete a project
  delete: async (id: number): Promise<void> => {
    await client.delete(`/projects/${id}`);
  },

  // Add member to project
  addMember: async (projectId: number, data: AddProjectMemberRequest): Promise<Project> => {
    const response = await client.post<Project>(`/projects/${projectId}/members`, data);
    return response.data;
  },

  // Remove member from project
  removeMember: async (projectId: number, memberId: number): Promise<void> => {
    await client.delete(`/projects/${projectId}/members/${memberId}`);
  },

  // Get project members
  getMembers: async (projectId: number): Promise<any[]> => {
    const response = await client.get(`/projects/${projectId}/members`);
    return response.data;
  },
};
