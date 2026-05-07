import React, { createContext, useContext, useState } from 'react';
import { Transaction } from '@/src/types';
import { MOCK_TRANSACTIONS } from '@/src/data/mockData';

interface WalletContextType {
  balance: number;
  transactions: Transaction[];
  addTransaction: (tx: Omit<Transaction, 'id' | 'date' | 'status'>) => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [balance, setBalance] = useState<number>(4850.00);
  const [transactions, setTransactions] = useState<Transaction[]>(MOCK_TRANSACTIONS);

  const addTransaction = (tx: Omit<Transaction, 'id' | 'date' | 'status'>) => {
    const newTx: Transaction = {
      ...tx,
      id: `TX-${Math.floor(1000 + Math.random() * 9000)}`,
      date: 'Just now',
      status: 'PENDING',
    };
    
    // If it's a withdrawal, deduct from balance
    if (tx.type === 'WITHDRAWAL') {
      setBalance((prev) => prev - tx.amount);
    } else if (tx.type === 'PAYOUT' || tx.type === 'DEPOSIT') {
      setBalance((prev) => prev + tx.amount);
    }

    setTransactions((prev) => [newTx, ...prev]);
  };

  return (
    <WalletContext.Provider value={{ balance, transactions, addTransaction }}>
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
