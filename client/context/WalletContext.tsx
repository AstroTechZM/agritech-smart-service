// client/context/WalletContext.tsx
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
        api.fetchWalletTransactions(),
      ]);
      setBalance(safeNumber(bal));
      setTransactions(txs as Transaction[]);
    } catch (error) {
      console.error('[WalletContext] Failed to fetch wallet data:', error);
      setBalance(0);
      setTransactions([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWalletData();
  }, []);

  const addTransaction = async (tx: Omit<Transaction, 'id' | 'date' | 'status'>) => {
    try {
      if (tx.type === 'WITHDRAWAL') {
        await api.postWithdrawal(tx.amount, 'FARMER-1');
      } else {
        await new Promise((resolve) =>
          setTimeout(resolve, LOGIC_CONSTANTS.API_DELAY_SHORT)
        );
      }
      await fetchWalletData();
    } catch {
      // Simulate locally if backend is down
      const newTx: Transaction = {
        ...(tx as any),
        id: `TX-${Date.now()}`,
        date: new Date().toISOString(),
        status: 'PENDING',
      };
      setTransactions((prev) => [newTx, ...prev]);
      if (tx.type === 'WITHDRAWAL') {
        setBalance((prev) => prev - tx.amount);
      }
    }
  };

  return (
    <WalletContext.Provider value={{ balance, transactions, isLoading, addTransaction }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) throw new Error('useWallet must be used within a WalletProvider');
  return context;
};