import { delay } from './api-client';
import { REGISTERED_FARMERS } from '../data/mockData';
import { LOGIC_CONSTANTS } from '../constants';

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
    await delay(LOGIC_CONSTANTS.API_DELAY_MEDIUM);
    const newFarmer = { 
      ...farmerData, 
      id: `FARMER-${Date.now()}`,
      status: 'VERIFIED',
      memberSince: new Date().getFullYear()
    };
    REGISTERED_FARMERS.push(newFarmer);
    return newFarmer;
  },

  /**
   * GET /api/v1/farmers
   * Fetches the list of all registered farmers (Agent/Admin view).
   */
  fetchFarmers: async () => {
    await delay(LOGIC_CONSTANTS.API_DELAY_SHORT);
    return REGISTERED_FARMERS;
  }
};
