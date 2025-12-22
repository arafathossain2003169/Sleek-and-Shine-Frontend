// lib/api/users.js
import { apiClient } from "./config"

export const userApi = {
  getAll: async () => apiClient("/users"),               // GET all users
  create: async (data) => apiClient("/users", {        // POST new user
    method: "POST",
    body: JSON.stringify(data),
  }),
  update: async (id, data) => apiClient(`/users/${id}`, { // PATCH existing
    method: "PATCH",
    body: JSON.stringify(data),
  }),
  delete: async (id) => apiClient(`/users/${id}`, {    // DELETE user
    method: "DELETE",
  }),
}
