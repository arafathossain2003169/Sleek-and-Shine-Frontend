// lib/api/orders.js
import { apiClient } from './config';

export const orderApi = {
  // Get all orders (admin)
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiClient(`/orders?${queryString}`);
  },

  // Get user's orders (authenticated user)
  getUserOrders: async (token) => {
    return apiClient('/orders/user', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  // Get single order
  getById: async (id) => {
    return apiClient(`/orders/user/${id}`);
  },

  // Get order statistics (admin)
  getStats: async () => {
    return apiClient('/orders/stats');
  },

  // Create order
  create: async (orderData) => {
    return apiClient('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  },

  // Update order status (admin)
  updateStatus: async (id, status) => {
    return apiClient(`/orders/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },

  // Update payment status (admin)
  updatePaymentStatus: async (id, paymentStatus) => {
    return apiClient(`/orders/${id}/payment-status`, {
      method: 'PATCH',
      body: JSON.stringify({ paymentStatus }),
    });
  },
};