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
    const rawVouchers = await apiClient.get<any[]>('/vouchers');
    return rawVouchers.map(v => ({
      id: v.voucher_id,
      type: v.input_type || 'FISP Input',
      status: v.status === 'PENDING' ? 'ACTIVE' : v.status, // Map DB PENDING to UI ACTIVE
      pin: v.pin_code,
      expiryDate: v.expiry_date,
      amount: v.amount
    })) as Voucher[];
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
