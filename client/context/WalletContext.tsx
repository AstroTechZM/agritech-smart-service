import React, { createContext, useContext, useState, useEffect } from 'react';
import { Transaction } from '@/types';
import { api } from '@/services';
import { LOGIC_CONSTANTS } from '@/constants';
import { safeNumber } from '@/lib/utils';

interface WalletContextType {
  balance: number;
  transactions: Transaction[];
  isLoading: boolean;
  addTransaction: (tx: Omit<Transaction, 'id' | 'date' | 'status'>) => Promise<void>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [balance, setBalance] = useState<number>(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchWalletData = async () => {
    try {
      setIsLoading(true);
      const [bal, txs] = await Promise.all([
        api.fetchWalletBalance(),
        api.fetchWalletTransactions()
      ]);
      setBalance(safeNumber(bal));
      setTransactions(txs);
    } catch (error) {
      console.error('Failed to fetch wallet data', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWalletData();
  }, []);

  const addTransaction = async (tx: Omit<Transaction, 'id' | 'date' | 'status'>) => {
    if (tx.type === 'WITHDRAWAL') {
      await api.postWithdrawal(tx.amount, 'ADMIN-1');
    } else {
      // For other types, simulate an API call if needed, or just let the refresh handle it
      await new Promise(resolve => setTimeout(resolve, LOGIC_CONSTANTS.API_DELAY_SHORT));
    }
    
    // Always refresh from the central source of truth (the API/Mock state)
    await fetchWalletData();
  };

  return (
    <WalletContext.Provider value={{ balance, transactions, isLoading, addTransaction }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};

