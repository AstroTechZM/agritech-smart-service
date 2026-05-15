import { delay } from './api-client';
import { MOCK_FARM_PRODUCTION, MOCK_AGRONOMY_INSIGHTS, MOCK_DELIVERIES, MOCK_DAILY_INTAKE, MOCK_PAYMENTS } from '../data/mockData';
import { LOGIC_CONSTANTS } from '../constants';

/**
 * PRODUCTION & LOGISTICS API SERVICE
 */

export const productionApi = {
  /**
   * GET /api/v1/production/deliveries
   */
  fetchDeliveries: async () => {
    await delay(LOGIC_CONSTANTS.API_DELAY_SHORT);
    return MOCK_DELIVERIES;
  },

  /**
   * GET /api/v1/production/records
   */
  fetchFarmProduction: async () => {
    await delay(LOGIC_CONSTANTS.API_DELAY_SHORT);
    return MOCK_FARM_PRODUCTION;
  },

  /**
   * GET /api/v1/production/insights
   */
  fetchInsights: async () => {
    await delay(LOGIC_CONSTANTS.API_DELAY_SHORT);
    return MOCK_AGRONOMY_INSIGHTS;
  },

  /**
   * GET /api/v1/production/intake
   */
  fetchDailyIntake: async () => {
    await delay(LOGIC_CONSTANTS.API_DELAY_SHORT);
    return MOCK_DAILY_INTAKE;
  },

  /**
   * POST /api/v1/production/intake
   */
  recordGrainIntake: async (data: { weight: number, nrc: string, farmerName: string, crop: string }) => {
    await delay(LOGIC_CONSTANTS.API_DELAY_MEDIUM);
    
    // Update intake totals
    MOCK_DAILY_INTAKE.bags += Math.ceil(data.weight / 50); 
    
    // Create automated payment record (Requirement III: Automated payment calculations)
    const pricePerKg = data.crop.toLowerCase().includes('maize') ? 5.60 : 12.00;
    const amount = data.weight * pricePerKg;
    
    const newPayment = {
      name: data.farmerName,
      nrc: data.nrc,
      qty: Math.ceil(data.weight / 50),
      amount: Math.round(amount),
      method: "Mobile Money",
      status: "PENDING",
      district: "Choma" // Default for demo
    };
    
    // Import MOCK_PAYMENTS at the top or update it if it's in the same data pool
    // Since we want this to reflect in the Admin view immediately
    MOCK_PAYMENTS.unshift(newPayment);
    
    return { success: true, totalBags: MOCK_DAILY_INTAKE.bags, payment: newPayment };
  }
};
