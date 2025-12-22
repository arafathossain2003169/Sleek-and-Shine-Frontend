// lib/api/reviews.js
import { apiClient } from './config';

export const reviewApi = {
  // Create review
  create: async (reviewData) => {
    return apiClient('/reviews', {
      method: 'POST',
      body: JSON.stringify(reviewData),
    });
  },

  // Delete review (admin)
  delete: async (id) => {
    return apiClient(`/reviews/${id}`, {
      method: 'DELETE',
    });
  },
};