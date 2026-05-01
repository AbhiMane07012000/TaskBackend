import client from './client';
import { Subscription } from '../../types/models';
import { CreateSubscriptionRequest } from '../../types/api';

export const subscriptionsService = {
  // Get user's current subscription
  getCurrent: async (): Promise<Subscription | null> => {
    const response = await client.get<Subscription | null>('/subscriptions/current');
    return response.data;
  },

  // Create a new subscription
  create: async (data: CreateSubscriptionRequest): Promise<Subscription> => {
    const response = await client.post<Subscription>('/subscriptions', data);
    return response.data;
  },

  // Cancel subscription
  cancel: async (id: number): Promise<Subscription> => {
    const response = await client.patch<Subscription>(`/subscriptions/${id}/cancel`);
    return response.data;
  },

  // Get subscription by ID
  getById: async (id: number): Promise<Subscription> => {
    const response = await client.get<Subscription>(`/subscriptions/${id}`);
    return response.data;
  },

  // Update subscription
  update: async (id: number, data: Partial<Subscription>): Promise<Subscription> => {
    const response = await client.put<Subscription>(`/subscriptions/${id}`, data);
    return response.data;
  },

  // Initiate Razorpay payment
  initiatePayment: async (planId: number): Promise<any> => {
    const response = await client.post('/subscriptions/initiate-payment', { planId });
    return response.data;
  },

  // Verify Razorpay payment
  verifyPayment: async (data: {
    paymentId: string;
    orderId: string;
    signature: string;
  }): Promise<Subscription> => {
    const response = await client.post<Subscription>('/subscriptions/verify-payment', data);
    return response.data;
  },
};
