import React, { createContext, useContext, useState, useEffect } from 'react';
import { Transaction } from '@/src/types';
import { MOCK_TRANSACTIONS } from '@/src/data/mockData';
import { LOGIC_CONSTANTS } from '@/src/constants';

interface WalletContextType {
  balance: number;
  transactions: Transaction[];
  addTransaction: (tx: Omit<Transaction, 'id' | 'date' | 'status'>) => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

const STORAGE_KEY_BALANCE = 'agritech_wallet_balance';
const STORAGE_KEY_TX = 'agritech_wallet_transactions';

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize state from localStorage or defaults
  const [balance, setBalance] = useState<number>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_BALANCE);
    return saved !== null ? parseFloat(saved) : LOGIC_CONSTANTS.INITIAL_WALLET_BALANCE;
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_TX);
    return saved !== null ? JSON.parse(saved) : MOCK_TRANSACTIONS;
  });

  // Persist to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_BALANCE, balance.toString());
  }, [balance]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_TX, JSON.stringify(transactions));
  }, [transactions]);

  const addTransaction = (tx: Omit<Transaction, 'id' | 'date' | 'status'>) => {
    const newTx: Transaction = {
      ...tx,
      id: `TX-${Math.floor(LOGIC_CONSTANTS.TX_ID_MIN + Math.random() * LOGIC_CONSTANTS.TX_ID_MAX)}`,
      date: new Date().toLocaleString(),
      status: 'PENDING',
    };
    
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
