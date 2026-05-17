// client/context/WalletContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Transaction } from '@/types';
import { api } from '@/services';
import { LOGIC_CONSTANTS } from '@/constants';
import { safeNumber } from '@/lib/utils';

// Mock fallback data — used when backend is not available
import mockTransactions from '@/data/transactions.json';

const FALLBACK_BALANCE = 4850.00;
const FALLBACK_TRANSACTIONS: Transaction[] = Array.isArray(mockTransactions)
  ? (mockTransactions as Transaction[])
  : [];

interface WalletContextType {
  balance: number;
  transactions: Transaction[];
  isLoading: boolean;
  addTransaction: (tx: Omit<Transaction, 'id' | 'date' | 'status'>) => Promise<void>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [balance, setBalance] = useState<number>(FALLBACK_BALANCE);
  const [transactions, setTransactions] = useState<Transaction[]>(FALLBACK_TRANSACTIONS);
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
    } catch {
      // Backend not available — use mock data silently
      console.warn('[WalletContext] Using mock wallet data (backend unavailable)');
      setBalance(FALLBACK_BALANCE);
      setTransactions(FALLBACK_TRANSACTIONS);
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