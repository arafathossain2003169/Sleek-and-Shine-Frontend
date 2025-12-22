import { apiClient } from './config';

export const dashboardApi = {
  summary: () => apiClient('/admin/dashboard/summary'),
  revenue: () => apiClient('/admin/dashboard/revenue'),
  categorySales: () => apiClient('/admin/dashboard/category-sales'),
  recentOrders: () => apiClient('/admin/dashboard/recent-orders'),
  topProducts: () => apiClient('/admin/dashboard/top-products'),
};
