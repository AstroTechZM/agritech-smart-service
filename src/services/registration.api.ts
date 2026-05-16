import { apiClient } from './api-client';

/**
 * REGISTRATION API SERVICE
 * Handles farmer onboarding and biometric data sync.
 */

export const registrationApi = {
  /**
   * POST /api/v1/farmers/register
   * Submits new farmer data, including KYC and farm details.
   */
  registerFarmer: async (farmerData: any) => {
    return apiClient.post('/farmers/register', farmerData);
  },

  /**
   * GET /api/v1/farmers
   * Fetches the list of all registered farmers (Agent/Admin view).
   */
  fetchFarmers: async () => {
    return apiClient.get('/farmers');
  }
};
