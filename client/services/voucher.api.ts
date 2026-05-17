// client/services/voucher.api.ts
import { apiClient } from './api-client';

export const voucherApi = {
  /**
   * GET /api/v1/farmer/vouchers/active
   */
  fetchActiveVoucher: async () =>
    apiClient.get('/farmer/vouchers/active'),

  /**
   * GET /api/v1/farmer/vouchers/history
   */
  fetchVoucherHistory: async () =>
    apiClient.get('/farmer/vouchers/history'),

  /**
   * GET /api/v1/farmer/vouchers/nearby-dealers
   */
  fetchNearbyDealers: async () =>
    apiClient.get('/farmer/vouchers/nearby-dealers'),
};