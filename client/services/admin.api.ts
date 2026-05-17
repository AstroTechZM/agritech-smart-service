import { apiClient } from './api-client';

/**
 * ADMIN & OPERATIONS API SERVICE
 */

export const adminApi = {
  /**
   * GET /api/v1/admin/stats
   */
  fetchAdminStats: async () => {
    return apiClient.get('/admin/stats');
  },

  /**
   * GET /api/v1/admin/payments
   */
  fetchPayments: async () => {
    return apiClient.get('/admin/payments');
  },

  /**
   * GET /api/v1/admin/shipments
   */
  fetchShipments: async () => {
    return apiClient.get('/admin/shipments');
  },

  /**
   * POST /api/v1/admin/payments/approve-all
   */
  approveAllPendingPayments: async () => {
    return apiClient.post('/admin/payments/approve-all');
  },

 
  
};

