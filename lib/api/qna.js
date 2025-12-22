// lib/api/qna.js
import { apiClient } from './config';

export const qnaApi = {
  // Create question
  createQuestion: async (questionData) => {
    return apiClient('/qna', {
      method: 'POST',
      body: JSON.stringify(questionData),
    });
  },

  // Answer question (admin)
  answerQuestion: async (id, answer) => {
    return apiClient(`/qna/${id}/answer`, {
      method: 'PATCH',
      body: JSON.stringify({ answer }),
    });
  },

  // Delete question (admin)
  delete: async (id) => {
    return apiClient(`/qna/${id}`, {
      method: 'DELETE',
    });
  },
};