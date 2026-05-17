import { apiClient } from './api-client';

export const adminApi = {
  fetchAdminStats: async () => apiClient.get('/admin/stats'),
  fetchPayments: async () => apiClient.get('/admin/payments'),
  fetchShipments: async () => apiClient.get('/admin/shipments'),
  approveAllPendingPayments: async () => apiClient.post('/admin/payments/approve-all'),
  updateProfile: async (data: any) => apiClient.put('/profile', data),
};
