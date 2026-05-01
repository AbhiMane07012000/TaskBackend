import client from './client';
import { Notification, PaginatedResponse } from '../../types/models';

export const notificationsService = {
  // Get all notifications
  getAll: async (
    page: number = 1,
    limit: number = 10,
    unreadOnly: boolean = false
  ): Promise<PaginatedResponse<Notification>> => {
    const response = await client.get<PaginatedResponse<Notification>>('/notifications', {
      params: { page, limit, unreadOnly },
    });
    return response.data;
  },

  // Mark notification as read
  markAsRead: async (id: number): Promise<Notification> => {
    const response = await client.patch<Notification>(`/notifications/${id}/read`);
    return response.data;
  },

  // Mark all notifications as read
  markAllAsRead: async (): Promise<any> => {
    const response = await client.patch('/notifications/mark-all-read');
    return response.data;
  },

  // Delete a notification
  delete: async (id: number): Promise<void> => {
    await client.delete(`/notifications/${id}`);
  },

  // Get unread count
  getUnreadCount: async (): Promise<{ count: number }> => {
    const response = await client.get<{ count: number }>('/notifications/unread-count');
    return response.data;
  },
};
