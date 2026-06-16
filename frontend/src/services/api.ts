import axios from 'axios';
import { AuthResponse, DashboardData, Lead, LeadRequest, LeadStatus } from '../types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  withCredentials: true,
});

// Response interceptor: on 401, try to refresh; if refresh fails, redirect to login
let isRefreshing = false;
let failedQueue: Array<{ resolve: (value?: unknown) => void; reject: (reason?: unknown) => void }> = [];

const processQueue = (error: unknown | null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve();
    }
  });
  failedQueue = [];
};
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes('/auth/login') &&
      !originalRequest.url?.includes('/auth/register') &&
      !originalRequest.url?.includes('/auth/refresh')
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => api(originalRequest));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await api.post('/auth/refresh');
        processQueue(null);
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError);
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export const authApi = {
  login: (username: string, password: string) =>
    api.post<AuthResponse>('/auth/login', { username, password }),
  register: (username: string, password: string) =>
    api.post<AuthResponse>('/auth/register', { username, password }),
  refresh: () =>
    api.post<AuthResponse>('/auth/refresh'),
  logout: () =>
    api.post('/auth/logout'),
  me: () =>
    api.get<AuthResponse>('/auth/me'),
};

export const leadApi = {
  getAll: (search?: string, status?: LeadStatus) =>
    api.get<Lead[]>('/leads', { params: { search, status } }),
  getById: (id: number) => api.get<Lead>(`/leads/${id}`),
  create: (data: LeadRequest) => api.post<Lead>('/leads', data),
  update: (id: number, data: LeadRequest) => api.put<Lead>(`/leads/${id}`, data),
  delete: (id: number) => api.delete(`/leads/${id}`),
  getDashboard: () => api.get<DashboardData>('/leads/dashboard'),
};

export default api;

