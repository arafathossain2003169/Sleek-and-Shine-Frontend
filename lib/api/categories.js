// lib/api/categories.js
import { apiClient } from './config';

export const categoryApi = {
  getAll: async () => {
    return apiClient('/categories');
  },

  create: async (categoryData) => {
    return apiClient('/categories', {
      method: 'POST',
      body: JSON.stringify(categoryData),
    });
  },

  update: async (id, categoryData) => {
    return apiClient(`/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(categoryData),
    });
  },

  delete: async (id) => {
    return apiClient(`/categories/${id}`, {
      method: 'DELETE',
    });
  },
};