import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '@/src/services';

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
  isLoading: boolean;
  addFarmer: (farmer: Farmer) => Promise<void>;
  findFarmerByNRC: (nrc: string) => Farmer | undefined;
}

const FarmerContext = createContext<FarmerContextType | undefined>(undefined);

export const FarmerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [farmers, setFarmers] = useState<Farmer[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFarmers = async () => {
      try {
        setIsLoading(true);
        const registeredFarmers = await api.fetchFarmers();
        const mappedFarmers = registeredFarmers.map(f => ({
          nrc: f.nrc,
          firstName: f.first_name,
          lastName: f.last_name,
          gender: f.gender || 'Unknown',
          district: 'Choma',
          camp: 'Central',
          farmSize: '5.0',
          crops: ['Maize']
        }));
        setFarmers(mappedFarmers);
      } catch (error) {
        console.error('Failed to fetch farmers', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFarmers();
  }, []);

  const addFarmer = async (farmer: Farmer) => {
    await api.registerFarmer(farmer);
    setFarmers((prev) => [farmer, ...prev]);
  };

  const findFarmerByNRC = (nrc: string) => {
    const normalizedNRC = nrc.trim();
    return farmers.find(f => f.nrc === normalizedNRC);
  };

  return (
    <FarmerContext.Provider value={{ farmers, isLoading, addFarmer, findFarmerByNRC }}>
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
