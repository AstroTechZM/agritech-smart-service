import { delay } from './api-client';
import { MOCK_STOCK, MOCK_VOUCHERS, MOCK_REDEMPTIONS } from '../data/mockData';
import { LOGIC_CONSTANTS } from '../constants';

/**
 * STOCK & VOUCHER API SERVICE
 * Manages inventory and voucher redemptions.
 */

export const stockApi = {
  /**
   * GET /api/v1/inventory
   * Returns current stock levels at the local depot.
   */
  fetchStock: async () => {
    await delay(LOGIC_CONSTANTS.API_DELAY_SHORT);
    return MOCK_STOCK;
  },

  /**
   * GET /api/v1/vouchers
   * Fetches active vouchers for the logged-in farmer.
   */
  fetchVouchers: async () => {
    await delay(LOGIC_CONSTANTS.API_DELAY_SHORT);
    return MOCK_VOUCHERS;
  },

  /**
   * POST /api/v1/vouchers/redeem
   * Processes a voucher PIN and initiates distribution.
   */
  redeemVoucher: async (pin: string) => {
    await delay(LOGIC_CONSTANTS.API_DELAY_MEDIUM);
    const voucher = MOCK_VOUCHERS.find(v => v.pin === pin || v.id === pin);
    
    if (!voucher) throw new Error("Invalid Voucher PIN or ID");
    if (voucher.status === 'REDEEMED') throw new Error("Voucher already redeemed");
    
    voucher.status = 'REDEEMED';
    
    const redemption = {
      id: `RED-${Date.now()}`,
      farmer: "Authenticated Farmer",
      item: voucher.type,
      amount: voucher.allocation,
      date: new Date().toLocaleDateString(),
      status: 'COMPLETED'
    };
    
    MOCK_REDEMPTIONS.unshift(redemption);
    return { success: true, redemption };
  },

  /**
   * GET /api/v1/redemptions
   * History of distributions for the current dealer.
   */
  fetchRedemptions: async () => {
    await delay(LOGIC_CONSTANTS.API_DELAY_SHORT);
    return MOCK_REDEMPTIONS;
  }
};
