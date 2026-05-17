// client/services/deliveries.api.ts
import { apiClient } from './api-client';

export const deliveriesApi = {
  /**
   * GET /api/v1/farmer/deliveries
   */
  fetchDeliveries: async () =>
    apiClient.get('/farmer/deliveries'),

  /**
   * GET /api/v1/farmer/deliveries/:id
   */
  fetchDeliveryById: async (id: string) =>
    apiClient.get(`/farmer/deliveries/${id}`),
};