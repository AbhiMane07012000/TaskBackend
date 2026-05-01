import client from './client';
import { Comment } from '../../types/models';
import { CreateCommentRequest, UpdateCommentRequest } from '../../types/api';

export const commentsService = {
  // Get comments for a task
  getByTask: async (taskId: number): Promise<Comment[]> => {
    const response = await client.get<Comment[]>(`/tasks/${taskId}/comments`);
    return response.data;
  },

  // Create a comment
  create: async (taskId: number, data: CreateCommentRequest): Promise<Comment> => {
    const response = await client.post<Comment>(`/tasks/${taskId}/comments`, {
      content: data.content,
    });
    return response.data;
  },

  // Update a comment
  update: async (taskId: number, commentId: number, data: UpdateCommentRequest): Promise<Comment> => {
    const response = await client.put<Comment>(
      `/tasks/${taskId}/comments/${commentId}`,
      data
    );
    return response.data;
  },

  // Delete a comment
  delete: async (taskId: number, commentId: number): Promise<void> => {
    await client.delete(`/tasks/${taskId}/comments/${commentId}`);
  },
};
