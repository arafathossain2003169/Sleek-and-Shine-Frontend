// lib/api/auth.js
import { apiClient } from './config';

export const authApi = {
  // Register new user
  register: async (userData) => {
    return apiClient('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  // Login user
  login: async (credentials) => {
    return apiClient('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  // Get current user profile
  getProfile: async (token) => {
    return apiClient('/auth/profile', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  // Update user profile
  updateProfile: async (token, userData) => {
    return apiClient('/auth/profile', {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(userData),
    });
  },

  // Change password
  changePassword: async (token, passwords) => {
    return apiClient('/auth/change-password', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(passwords),
    });
  },
};