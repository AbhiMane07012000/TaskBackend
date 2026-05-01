import axios from 'axios';
import Cookies from 'js-cookie';

export const api = axios.create({ baseURL: process.env.NEXT_PUBLIC_API_URL, withCredentials: true });

api.interceptors.request.use((config) => {
  const token = Cookies.get('accessToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    if (error.response?.status === 401) {
      try {
        const refresh = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`, {}, { withCredentials: true });
        Cookies.set('accessToken', refresh.data.accessToken);
        error.config.headers.Authorization = `Bearer ${refresh.data.accessToken}`;
        return api.request(error.config);
      } catch {
        Cookies.remove('accessToken');
        if (typeof window !== 'undefined') window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);
