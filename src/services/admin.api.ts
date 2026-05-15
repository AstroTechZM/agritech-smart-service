import { delay } from './api-client';
import { MOCK_ADMIN_STATS, MOCK_PAYMENTS, MOCK_SHIPMENTS, MOCK_TRANSACTIONS } from '../data/mockData';
import { LOGIC_CONSTANTS } from '../constants';

/**
 * ADMIN & OPERATIONS API SERVICE
 */

export const adminApi = {
  /**
   * GET /api/v1/admin/stats
   */
  fetchAdminStats: async () => {
    await delay(LOGIC_CONSTANTS.API_DELAY_MEDIUM);
    return MOCK_ADMIN_STATS;
  },

  /**
   * GET /api/v1/admin/payments
   */
  fetchPayments: async () => {
    await delay(LOGIC_CONSTANTS.API_DELAY_SHORT);
    return MOCK_PAYMENTS;
  },

  /**
   * GET /api/v1/admin/shipments
   */
  fetchShipments: async () => {
    await delay(LOGIC_CONSTANTS.API_DELAY_SHORT);
    return MOCK_SHIPMENTS;
  },

  /**
   * PUT /api/v1/profile
   */
  updateProfile: async (profileData: any) => {
    await delay(LOGIC_CONSTANTS.API_DELAY_MEDIUM);
    return { success: true, data: profileData };
  },

  /**
   * POST /api/v1/admin/payments/approve-all
   */
  approveAllPendingPayments: async () => {
    await delay(LOGIC_CONSTANTS.API_DELAY_MEDIUM);
    
    const pending = MOCK_PAYMENTS.filter(p => p.status === 'PENDING');
    
    pending.forEach(p => {
        p.status = 'APPROVED';
        // Add to global transactions so farmers see it (Requirement III)
        MOCK_TRANSACTIONS.unshift({
            id: `TX-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
            type: 'CREDIT',
            amount: p.amount,
            status: 'COMPLETED',
            date: new Date().toISOString(),
            description: `FRA Harvest Payment - ${p.qty} Bags`,
            recipient: p.name,
            nrc: p.nrc
        });
    });

    return { success: true, count: pending.length };
  }
};
