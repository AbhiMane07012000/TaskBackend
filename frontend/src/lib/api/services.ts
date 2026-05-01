import { api } from './client';

export const authApi = {
  login: (payload: { email: string; password: string }) => api.post('/auth/login', payload),
  register: (payload: { name: string; email: string; password: string }) => api.post('/auth/register', payload),
  me: () => api.get('/auth/me')
};

export const dashboardApi = { stats: () => api.get('/dashboard/stats') };
export const projectApi = {
  list: (params?: unknown) => api.get('/project', { params }),
  create: (payload: unknown) => api.post('/project', payload),
  get: (id: string) => api.get(`/project/${id}`),
  update: (id: string, payload: unknown) => api.put(`/project/${id}`, payload),
  remove: (id: string) => api.delete(`/project/${id}`),
  members: (id: string, payload: unknown) => api.post(`/project/${id}/members`, payload)
};
export const taskApi = {
  list: (params?: unknown) => api.get('/task', { params }),
  create: (payload: unknown) => api.post('/task', payload),
  get: (id: string) => api.get(`/task/${id}`),
  update: (id: string, payload: unknown) => api.put(`/task/${id}`, payload),
  remove: (id: string) => api.delete(`/task/${id}`),
  comment: (id: string, payload: unknown) => api.post(`/comment/task/${id}`, payload)
};
export const userApi = { list: () => api.get('/user'), update: (id: string, payload: unknown) => api.put(`/user/${id}`, payload), changePassword: (id: string, payload: unknown) => api.put(`/user/${id}/password`, payload) };
export const notificationApi = { list: () => api.get('/notification'), markRead: (id: string) => api.patch(`/notification/${id}/read`) };
export const planApi = { list: () => api.get('/plan'), subscribe: (payload: unknown) => api.post('/subscription/create-order', payload) };
