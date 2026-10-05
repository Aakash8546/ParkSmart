import { BASE_URL, getAuthHeaders, handleApiResponse } from './api';

export const authService = {
  // 1. User / Admin / Guard Login -> POST /api/auth/login
  login: async (email, password) => {
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await handleApiResponse(response);
    if (data && data.success && data.data?.token) {
      localStorage.setItem('token', data.data.token);
      localStorage.setItem('user', JSON.stringify(data.data));
    }
    return data;
  },

  // 2. Register New User Account -> POST /api/auth/register
  register: async (name, email, password, phone, role = 'USER') => {
    const response = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, phone, role }),
    });
    const data = await handleApiResponse(response);
    if (data && data.success && data.data?.token) {
      localStorage.setItem('token', data.data.token);
      localStorage.setItem('user', JSON.stringify(data.data));
    }
    return data;
  },

  // 3. Get Current User Profile -> GET /api/auth/me
  getProfile: async () => {
    const token = localStorage.getItem('token');
    if (!token) return null;
    const response = await fetch(`${BASE_URL}/auth/me`, {
      headers: getAuthHeaders(),
    });
    const data = await handleApiResponse(response);
    if (data?.success && data.data) {
      localStorage.setItem('user', JSON.stringify(data.data));
    }
    return data;
  },

  getCurrentUser: () => {
    try {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    } catch {
      return null;
    }
  },

  getRole: () => {
    try {
      const userStr = localStorage.getItem('user');
      if (!userStr) return 'USER';
      const user = JSON.parse(userStr);
      return (user.role || user.userRole || 'USER').toUpperCase();
    } catch {
      return 'USER';
    }
  },

  isAdmin: () => {
    return authService.getRole() === 'ADMIN';
  },

  isGuard: () => {
    return authService.getRole() === 'GUARD';
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};
