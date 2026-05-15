import React, { createContext, useContext, useState, useEffect } from 'react';
import { Transaction } from '@/src/types';
import { api } from '@/src/services/api';
import { LOGIC_CONSTANTS } from '@/src/constants';

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

  useEffect(() => {
    const fetchWalletData = async () => {
      try {
        setIsLoading(true);
        const [bal, txs] = await Promise.all([
          api.fetchWalletBalance(),
          api.fetchWalletTransactions()
        ]);
        setBalance(bal);
        setTransactions(txs);
      } catch (error) {
        console.error('Failed to fetch wallet data', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWalletData();
  }, []);

  const addTransaction = async (tx: Omit<Transaction, 'id' | 'date' | 'status'>) => {
    const newTx: Transaction = {
      ...tx,
      id: `TX-${Math.floor(LOGIC_CONSTANTS.TX_ID_MIN + Math.random() * LOGIC_CONSTANTS.TX_ID_MAX)}`,
      date: new Date().toLocaleString(),
      status: 'PENDING',
    };
    
    // Simulate backend processing delay for adding transaction
    await new Promise(resolve => setTimeout(resolve, LOGIC_CONSTANTS.API_DELAY_SHORT));
    
    if (tx.type === 'WITHDRAWAL') {
      setBalance((prev) => prev - tx.amount);
    } else if (tx.type === 'PAYOUT' || tx.type === 'DEPOSIT') {
      setBalance((prev) => prev + tx.amount);
    }

    setTransactions((prev) => [newTx, ...prev]);
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
