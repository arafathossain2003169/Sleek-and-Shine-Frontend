// lib/api/wishlist.js
import { apiClient } from './config';

export const wishlistApi = {
  // Get wishlist
  get: async () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    if (!user.id) throw new Error('Must be logged in')
    
    return apiClient(`/wishlist?userId=${user.id}`)
  },

  add: async (productId) => {
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    if (!user.id) throw new Error('Must be logged in')
    
    return apiClient('/wishlist', {
      method: 'POST',
      body: JSON.stringify({ userId: user.id, productId }),
    })
  },

  // Remove from wishlist
  remove: async (id) => {
    return apiClient(`/wishlist/${id}`, {
      method: 'DELETE',
    });
  },
};