import { apiClient } from './api-client';
import { Voucher, DepotStock } from '@/types';

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
    return apiClient.get<DepotStock[]>('/inventory');
  },

  /**
   * GET /api/v1/vouchers
   * Fetches active vouchers for the logged-in farmer.
   */
  fetchVouchers: async () => {
    return apiClient.get<Voucher[]>('/vouchers');
  },

  /**
   * POST /api/v1/vouchers/redeem
   * Processes a voucher PIN and initiates distribution.
   */
  redeemVoucher: async (pin: string) => {
    return apiClient.post<{ success: boolean; voucher: Voucher }>('/vouchers/redeem', { pin_code: pin });
  },

  /**
   * GET /api/v1/redemptions
   * History of distributions for the current dealer.
   */
  fetchRedemptions: async () => {
    return apiClient.get<any[]>('/redemptions');
  }
};
