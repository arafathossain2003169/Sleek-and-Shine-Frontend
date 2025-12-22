// lib/api/products.js
import { apiClient } from './config';

export const productApi = {
  // Get all products with filters
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiClient(`/products?${queryString}`);
  },

  // Get single product
  getById: async (id) => {
    return apiClient(`/products/${id}`);
  },

  // Get product statistics (admin)
  getStats: async () => {
    return apiClient('/products/stats');
  },

  // Create product (admin)
  create: async (productData) => {
    return apiClient('/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
  },

  // Update product (admin)
  update: async (id, productData) => {
    return apiClient(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    });
  },

  // Delete product (admin)
  delete: async (id) => {
    return apiClient(`/products/${id}`, {
      method: 'DELETE',
    });
  },
};
