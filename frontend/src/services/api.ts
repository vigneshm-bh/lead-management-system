import axios from 'axios';
import { AuthResponse, DashboardData, Lead, LeadRequest, LeadStatus } from '../types';

const api = axios.create({
  baseURL: '/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  login: (username: string, password: string) =>
    api.post<AuthResponse>('/auth/login', { username, password }),
  register: (username: string, password: string) =>
    api.post<AuthResponse>('/auth/register', { username, password }),
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

