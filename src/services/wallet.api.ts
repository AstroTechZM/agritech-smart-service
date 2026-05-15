import { delay } from './api-client';
import { MOCK_TRANSACTIONS } from '../data/mockData';
import { LOGIC_CONSTANTS } from '../constants';

/**
 * WALLET API SERVICE
 * Handles all financial and transaction-related backend calls.
 */

// SESSION STATE: We keep the balance in memory so it persists during navigation
export const walletApi = {
  /**
   * GET /api/v1/wallet/balance
   */
  fetchWalletBalance: async () => {
    await delay(LOGIC_CONSTANTS.API_DELAY_SHORT);
    const credits = MOCK_TRANSACTIONS
      .filter(t => ['CREDIT', 'PAYOUT', 'DEPOSIT'].includes(t.type))
      .reduce((sum, t) => sum + t.amount, 0);
    const debits = MOCK_TRANSACTIONS
      .filter(t => t.type === 'WITHDRAWAL')
      .reduce((sum, t) => sum + t.amount, 0);
    return credits - debits;
  },

  /**
   * GET /api/v1/wallet/transactions
   */
  fetchWalletTransactions: async () => {
    await delay(LOGIC_CONSTANTS.API_DELAY_SHORT);
    return MOCK_TRANSACTIONS;
  },

  /**
   * POST /api/v1/wallet/withdraw
   */
  postWithdrawal: async (amount: number) => {
    await delay(LOGIC_CONSTANTS.API_DELAY_MEDIUM);
    
    // Add to global transactions so it reflects everywhere
    MOCK_TRANSACTIONS.unshift({
        id: `TX-${Math.floor(LOGIC_CONSTANTS.TX_ID_MIN + Math.random() * LOGIC_CONSTANTS.TX_ID_MAX)}`,
        type: 'WITHDRAWAL',
        amount: amount,
        status: 'COMPLETED',
        date: new Date().toISOString(),
        description: 'Withdrawal to Mobile Money',
        recipient: 'Self'
    });

    return { success: true };
  }
};
