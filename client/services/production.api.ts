import { apiClient } from './api-client';
import { DeliveryRecord, FarmProduction, AgronomyInsight } from '@/types';

/**
 * PRODUCTION & LOGISTICS API SERVICE
 */

export const productionApi = {
  /**
   * GET /api/v1/production/deliveries
   */
  fetchDeliveries: async () => {
    return apiClient.get<DeliveryRecord[]>('/production/deliveries');
  },

  /**
   * GET /api/v1/production/records
   */
  fetchFarmProduction: async () => {
    return apiClient.get<FarmProduction[]>('/production/records');
  },

  /**
   * GET /api/v1/production/insights
   */
  fetchInsights: async () => {
    return apiClient.get<AgronomyInsight[]>('/production/insights');
  },

  /**
   * GET /api/v1/production/intake
   */
  fetchDailyIntake: async () => {
    return apiClient.get<any>('/production/intake');
  },

  /**
   * POST /api/v1/production/intake
   */
  recordGrainIntake: async (data: { weight: number, nrc: string, farmerName: string, crop: string }) => {
    return apiClient.post<{ success: boolean; payment: any; totalBags: number }>('/production/intake', data);
  }
};
