import { MOCK_SHIPMENTS, REGISTERED_FARMERS } from '../data/mockData';
import { LOGIC_CONSTANTS } from '../constants';

// Simulated delay to mimic network latency
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const api = {
  // SHIPMENTS
  fetchShipments: async () => {
    await delay(LOGIC_CONSTANTS.API_DELAY_SHORT);
    return MOCK_SHIPMENTS;
  },

  // PAYMENTS (Simulated store since it's not in mockData.ts yet)
  fetchPayments: async () => {
    await delay(LOGIC_CONSTANTS.API_DELAY_SHORT);
    return [
      { name: 'Loveness Phiri', nrc: '482910/11/1', qty: 12, amount: 3360, method: 'MoMo', status: 'APPROVED', district: 'Lusaka' },
      { name: 'Kelvin Banda', nrc: '110928/65/1', qty: 25, amount: 7000, method: 'Bank', status: 'PENDING', district: 'Choma' },
      { name: 'Mutale Kapwepwe', nrc: '338102/52/1', qty: 8, amount: 2240, method: 'MoMo', status: 'CANCELLED', district: 'Lusaka' },
      { name: 'John Doe', nrc: '123456/78/1', qty: 15, amount: 4200, method: 'Bank', status: 'PENDING', district: 'Kasama' },
    ];
  },

  // STOCK
  fetchStock: async () => {
    await delay(LOGIC_CONSTANTS.API_DELAY_SHORT);
    return [
      { name: 'D-Compound Fertilizer', qty: 450, unit: 'Bags', status: 'STABLE' },
      { name: 'Urea Fertilizer', qty: 120, unit: 'Bags', status: 'LOW' },
      { name: 'Maize Seed (10kg)', qty: 85, unit: 'Packs', status: 'STABLE' },
      { name: 'Soybean Seed (25kg)', qty: 12, unit: 'Packs', status: 'LOW' },
    ];
  },

  // REGISTRATION
  registerFarmer: async (farmerData: any) => {
    await delay(LOGIC_CONSTANTS.API_DELAY_MEDIUM);
    const newFarmer = { ...farmerData, id: `FARMER-${Date.now()}` };
    REGISTERED_FARMERS.push(newFarmer);
    return newFarmer;
  },

  // REDEMPTIONS (Agro-Dealer)
  fetchRedemptions: async () => {
    await delay(LOGIC_CONSTANTS.API_DELAY_SHORT);
    return [
      { id: 'RED-101', farmer: 'Mutale Phiri', items: '8 Bags D-Compound', time: '10m ago', amount: 4800 },
      { id: 'RED-102', farmer: 'Sarah Banda', items: '2 Packs Maize Seed', time: '1h ago', amount: 1200 },
      { id: 'RED-103', farmer: 'John Lungu', items: '4 Bags Urea', time: '3h ago', amount: 2400 },
    ];
  },

  // ANALYTICS (Daily Intake)
  fetchDailyIntake: async () => {
    await delay(LOGIC_CONSTANTS.API_DELAY_SHORT);
    return {
      bags: 142,
      tonnage: 7.1,
      pendingVerifications: 8
    };
  }
};
