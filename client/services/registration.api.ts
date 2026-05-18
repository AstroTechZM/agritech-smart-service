import { apiClient } from './api-client';
import { Farmer } from '@/types';

/**
 * REGISTRATION API SERVICE
 * Handles farmer onboarding and biometric data sync.
 */

export const registrationApi = {
  /**
   * POST /api/v1/farmers/register
   * Submits new farmer data, including KYC and farm details.
   */
  registerFarmer: async (farmerData: Partial<Farmer>) => {
    return apiClient.post<Farmer>('/farmers/register', farmerData);
  },

  /**
   * GET /api/v1/farmers
   * Fetches the list of all registered farmers (Agent/Admin view).
   */
  fetchFarmers: async (): Promise<Farmer[]> => {
    return apiClient.get<Farmer[]>('/farmers');
  }
};
