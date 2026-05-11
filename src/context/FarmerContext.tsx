import React, { createContext, useContext, useState, useEffect } from 'react';
import { REGISTERED_FARMERS } from '@/src/data/mockData';

interface Farmer {
  nrc: string;
  firstName: string;
  lastName: string;
  gender: string;
  district: string;
  camp: string;
  farmSize: string;
  gps?: string;
  crops: string[];
}

interface FarmerContextType {
  farmers: Farmer[];
  addFarmer: (farmer: Farmer) => void;
  findFarmerByNRC: (nrc: string) => Farmer | undefined;
}

const FarmerContext = createContext<FarmerContextType | undefined>(undefined);

const STORAGE_KEY = 'agritech_farmers';

export const FarmerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [farmers, setFarmers] = useState<Farmer[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved !== null ? JSON.parse(saved) : REGISTERED_FARMERS.map(f => ({
        nrc: f.nrc,
        firstName: f.first_name,
        lastName: f.last_name,
        gender: f.gender || 'Unknown',
        district: 'Choma',
        camp: 'Central',
        farmSize: '5.0',
        crops: ['Maize']
    }));
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(farmers));
  }, [farmers]);

  const addFarmer = (farmer: Farmer) => {
    setFarmers((prev) => [farmer, ...prev]);
  };

  const findFarmerByNRC = (nrc: string) => {
    return farmers.find(f => f.nrc === nrc);
  };

  return (
    <FarmerContext.Provider value={{ farmers, addFarmer, findFarmerByNRC }}>
      {children}
    </FarmerContext.Provider>
  );
};

export const useFarmers = () => {
  const context = useContext(FarmerContext);
  if (context === undefined) {
    throw new Error('useFarmers must be used within a FarmerProvider');
  }
  return context;
};
