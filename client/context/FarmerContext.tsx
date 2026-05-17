// client/context/FarmerContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '@/services';

// Mock fallback farmers — used when backend is not available
import mockFarmersData from '@/data/users.json';

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

// Map raw JSON/API data to the Farmer interface
const mapToFarmer = (f: any): Farmer => ({
  nrc: f.nrc,
  firstName: f.first_name || f.firstName || 'Unknown',
  lastName: f.last_name || f.lastName || '',
  gender: f.gender || 'Unknown',
  district: f.district || 'Lusaka',
  camp: f.camp || 'Central',
  farmSize: f.farm_size || f.farmSize || '5.0',
  gps: f.gps,
  crops: f.crops || ['Maize'],
});

// Build fallback list from local JSON (only farmer-role entries)
const FALLBACK_FARMERS: Farmer[] = Array.isArray(mockFarmersData)
  ? mockFarmersData
      .filter((u: any) => u.role === 'FARMER' || u.nrc)
      .map(mapToFarmer)
  : [];

export const FarmerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [farmers, setFarmers] = useState<Farmer[]>(FALLBACK_FARMERS);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFarmers = async () => {
      try {
        setIsLoading(true);
        const registeredFarmers = (await api.fetchFarmers()) as any[];
        setFarmers(registeredFarmers.map(mapToFarmer));
      } catch {
        // Backend not available — keep fallback data silently
        console.warn('[FarmerContext] Using mock farmer data (backend unavailable)');
        setFarmers(FALLBACK_FARMERS);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFarmers();
  }, []);

  const addFarmer = async (farmer: Farmer) => {
    try {
      await api.registerFarmer(farmer);
    } catch {
      // Backend unavailable — register locally only
      console.warn('[FarmerContext] Farmer saved locally (backend unavailable)');
    }
    setFarmers((prev) => [farmer, ...prev]);
  };

  const findFarmerByNRC = (nrc: string) => {
    return farmers.find((f) => f.nrc === nrc.trim());
  };

  return (
    <FarmerContext.Provider value={{ farmers, isLoading, addFarmer, findFarmerByNRC }}>
      {children}
    </FarmerContext.Provider>
  );
};

export const useFarmers = () => {
  const context = useContext(FarmerContext);
  if (!context) throw new Error('useFarmers must be used within a FarmerProvider');
  return context;
};