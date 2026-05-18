import { apiClient } from './api-client';
import { Transaction } from '@/types';

/**
 * WALLET API SERVICE
 * Handles all financial and transaction-related backend calls.
 */

export const walletApi = {
  /**
   * GET /api/v1/wallet/balance
   */
  fetchWalletBalance: async () => {
    const response = await apiClient.get<{ balance: number }>('/wallet/balance');
    return response.balance;
  },

  /**
   * GET /api/v1/wallet/transactions
   */
  fetchWalletTransactions: async () => {
    return apiClient.get<Transaction[]>('/wallet/transactions');
  },

  /**
   * POST /api/v1/wallet/withdraw
   */
  postWithdrawal: async (amount: number, userId: string) => {
    return apiClient.post<{ success: boolean; transaction: Transaction }>('/wallet/withdraw', { user_id: userId, amount });
  }
};
