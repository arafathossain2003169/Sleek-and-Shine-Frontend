// lib/api/cart.js
import { apiClient } from './config';

export const cartApi = {
  // Get cart items
  get: async () => {
    const token = localStorage.getItem('token')
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    
    const params = user.id 
      ? { userId: user.id } 
      : { sessionId: getSessionId() }
    
    const queryString = new URLSearchParams(params).toString()
    return apiClient(`/cart?${queryString}`)
  },

  add: async (item) => {
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    
    return apiClient('/cart', {
      method: 'POST',
      body: JSON.stringify({
        ...item,
        userId: user.id || null,
        sessionId: user.id ? null : getSessionId()
      }),
    })
  },

  // Update cart item quantity
  update: async (id, quantity) => {
    return apiClient(`/cart/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ quantity }),
    });
  },

  // Remove from cart
  remove: async (id) => {
    return apiClient(`/cart/${id}`, {
      method: 'DELETE',
    });
  },

  // Clear cart
  clear: async (userId = null, sessionId = null) => {
    const params = userId ? { userId } : { sessionId };
    const queryString = new URLSearchParams(params).toString();
    return apiClient(`/cart?${queryString}`, {
      method: 'DELETE',
    });
  },
};