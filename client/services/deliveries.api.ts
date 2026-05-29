// client/services/deliveries.api.ts
import { apiClient } from './api-client';

export const deliveriesApi = {
  /**
   * GET /api/v1/production/deliveries
   */
  fetchDeliveries: async () => {
    const records = await apiClient.get<any[]>('/production/deliveries');
    return records.map((r: any) => ({
      id: r.delivery_id,
      date: new Date(r.recorded_at || Date.now()).toLocaleDateString(),
      produceType: r.crop_type,
      weight: r.weight ? `${r.weight} KG` : '0 KG',
      depot: r.depot_id || 'Lusaka Central',
      amount: `ZMW ${(r.weight * (r.crop_type?.toLowerCase().includes('maize') ? 5.6 : 8.0)).toLocaleString()}`,
      paymentStatus: 'PROCESSING',
      grade: r.grade || '1',
      moisture: '12.5%',
    }));
  },

  /**
   * GET /api/v1/production/deliveries/:id
   */
  fetchDeliveryById: async (id: string) =>
    apiClient.get(`/production/deliveries/${id}`),
};