import { apiClient } from './api-client';

/**
 * PRODUCTION & LOGISTICS API SERVICE
 */

export const productionApi = {
  /**
   * GET /api/v1/production/deliveries
   */
  fetchDeliveries: async () => {
    return apiClient.get('/production/deliveries');
  },

  /**
   * GET /api/v1/production/records
   */
  fetchFarmProduction: async () => {
    return apiClient.get('/production/records');
  },

  /**
   * GET /api/v1/production/insights
   */
  fetchInsights: async () => {
    return apiClient.get('/production/insights');
  },

  /**
   * GET /api/v1/production/intake
   */
  fetchDailyIntake: async () => {
    return apiClient.get('/production/intake');
  },

  /**
   * POST /api/v1/production/intake
   */
  recordGrainIntake: async (data: { weight: number, nrc: string, farmerName: string, crop: string }) => {
    return apiClient.post('/production/intake', data);
  }
};

