import { apiClient } from './api-client';
import { User, PaymentRecord, Shipment } from '@/types';

export const adminApi = {
  fetchAdminStats: async () => apiClient.get<any>('/admin/stats'),
  fetchPayments: async () => apiClient.get<PaymentRecord[]>('/admin/payments'),
  fetchShipments: async () => apiClient.get<Shipment[]>('/admin/shipments'),
  approveAllPendingPayments: async () => apiClient.post<{ success: boolean; approvedCount: number }>('/admin/payments/approve-all'),
  updateProfile: async (data: Partial<User>) => apiClient.put<User>('/profile', data),
};
