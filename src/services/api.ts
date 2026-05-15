import { 
  MOCK_SHIPMENTS, REGISTERED_FARMERS, MOCK_DELIVERIES, MOCK_AGRONOMY_INSIGHTS, 
  MOCK_VOUCHERS, MOCK_TRANSACTIONS, MOCK_FARM_PRODUCTION, MOCK_PAYMENTS, MOCK_STOCK, 
  MOCK_REDEMPTIONS, MOCK_DAILY_INTAKE, MOCK_ADMIN_STATS 
} from '../data/mockData';
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
    return MOCK_PAYMENTS;
  },

  // STOCK
  fetchStock: async () => {
    await delay(LOGIC_CONSTANTS.API_DELAY_SHORT);
    return MOCK_STOCK;
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
    return MOCK_REDEMPTIONS;
  },

  redeemVoucher: async (pin: string) => {
    await delay(LOGIC_CONSTANTS.API_DELAY_MEDIUM);
    // Simulation: Find voucher with this PIN
    const voucher = MOCK_VOUCHERS.find(v => v.pin === pin || v.id === pin);
    if (!voucher) {
      throw new Error("Invalid Voucher PIN or ID");
    }
    if (voucher.status === 'REDEEMED') {
      throw new Error("This voucher has already been redeemed");
    }
    
    // Mark as redeemed in mock data (simulated)
    voucher.status = 'REDEEMED';
    
    const redemption = {
      id: `RED-${Date.now()}`,
      farmer: "Selected Farmer", // In real app, we'd look this up
      item: voucher.type,
      amount: "8 Bags",
      date: new Date().toLocaleDateString(),
      status: 'COMPLETED'
    };
    
    MOCK_REDEMPTIONS.unshift(redemption);
    return { success: true, redemption };
  },

  // ANALYTICS (Daily Intake)
  fetchDailyIntake: async () => {
    await delay(LOGIC_CONSTANTS.API_DELAY_SHORT);
    return MOCK_DAILY_INTAKE;
  },

  // DELIVERIES
  fetchDeliveries: async () => {
    await delay(LOGIC_CONSTANTS.API_DELAY_SHORT);
    return MOCK_DELIVERIES;
  },

  // PRODUCTION
  fetchFarmProduction: async () => {
    await delay(LOGIC_CONSTANTS.API_DELAY_SHORT);
    return MOCK_FARM_PRODUCTION;
  },

  // INSIGHTS
  fetchInsights: async () => {
    await delay(LOGIC_CONSTANTS.API_DELAY_SHORT);
    return MOCK_AGRONOMY_INSIGHTS;
  },

  // VOUCHERS
  fetchVouchers: async () => {
    await delay(LOGIC_CONSTANTS.API_DELAY_SHORT);
    return MOCK_VOUCHERS;
  },

  // WALLET
  fetchWalletBalance: async () => {
    await delay(LOGIC_CONSTANTS.API_DELAY_SHORT);
    return LOGIC_CONSTANTS.INITIAL_WALLET_BALANCE;
  },
  
  fetchWalletTransactions: async () => {
    await delay(LOGIC_CONSTANTS.API_DELAY_SHORT);
    return MOCK_TRANSACTIONS;
  },

  // FARMERS
  fetchFarmers: async () => {
    await delay(LOGIC_CONSTANTS.API_DELAY_SHORT);
    return REGISTERED_FARMERS;
  },

  // PROFILE
  updateProfile: async (profileData: any) => {
    await delay(LOGIC_CONSTANTS.API_DELAY_MEDIUM);
    return { success: true, data: profileData };
  },

  // ADMIN STATS
  fetchAdminStats: async () => {
    await delay(LOGIC_CONSTANTS.API_DELAY_MEDIUM);
    return MOCK_ADMIN_STATS;
  }
};
