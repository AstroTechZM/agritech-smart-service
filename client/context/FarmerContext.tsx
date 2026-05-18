// client/context/FarmerContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '@/services';

// Mock fallback farmers — used when backend is not available
import mockFarmersData from '@/data/users.json';

export interface Farmer {
  nrc: string;
  firstName: string;
  lastName: string;
  gender: string;
  district: string;
  camp: string;
  farmSize: string;
  gps?: string;
  crops: string[];

  /**
   * Generated farmer reference number.
   */
  farmerID?: string;

  /**
   * Farmer login PIN created during registration.
   */
  pin?: string;

  /**
   * Base64 profile photo captured/uploaded during registration.
   */
  photo?: string;

  /**
   * Base64 signature image captured during registration.
   */
  signature?: string;
}
interface FarmerContextType {
  farmers: Farmer[];
  isLoading: boolean;
  addFarmer: (farmer: Farmer) => Promise<void>;
  findFarmerByNRC: (nrc: string) => Farmer | undefined;
}

const FARMER_STORAGE_KEY = 'agritech_registered_farmers_v1';

const FarmerContext = createContext<FarmerContextType | undefined>(undefined);

const normalizeNRC = (nrc: string) => nrc.trim().replace(/\s+/g, '').toLowerCase();

const readStoredFarmers = (): Farmer[] => {
  try {
    const raw = localStorage.getItem(FARMER_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.map(mapToFarmer) : [];
  } catch {
    console.warn('[FarmerContext] Could not read locally registered farmers');
    return [];
  }
};

const writeStoredFarmers = (farmers: Farmer[]) => {
  localStorage.setItem(FARMER_STORAGE_KEY, JSON.stringify(farmers));
};

const mergeFarmers = (...groups: Farmer[][]): Farmer[] => {
  const byNrc = new Map<string, Farmer>();

  groups.flat().forEach((farmer) => {
    if (!farmer.nrc) return;
    byNrc.set(normalizeNRC(farmer.nrc), farmer);
  });

  return Array.from(byNrc.values());
};

// Map raw JSON/API data to the Farmer interface
const mapToFarmer = (f: any): Farmer => ({
  nrc: f.nrc,
  firstName: f.first_name || f.firstName || 'Unknown',
  lastName: f.last_name || f.lastName || '',
  gender: f.gender || 'Unknown',
  district: f.district || 'Lusaka',
  camp: f.camp || 'Central',
  farmSize: String(f.farm_size || f.farmSize || '5.0'),
  gps: f.gps,
  crops: f.crops || ['Maize'],
  farmerID: f.farmerID || f.farmer_id || f.id,
  pin: f.pin,
  photo: f.photo,
  signature: f.signature,
});

// Build fallback list from local JSON.
// Your users.json is an object keyed by role, not an array, so this supports both shapes.
const FALLBACK_FARMERS: Farmer[] = Array.isArray(mockFarmersData)
  ? mockFarmersData
      .filter((u: any) => u.role === 'FARMER' || u.nrc)
      .map(mapToFarmer)
  : Object.values(mockFarmersData as Record<string, any>)
      .filter((u: any) => u.role === 'FARMER' || u.nrc)
      .map(mapToFarmer);

export const FarmerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [farmers, setFarmers] = useState<Farmer[]>(() =>
    mergeFarmers(readStoredFarmers(), FALLBACK_FARMERS)
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFarmers = async () => {
      try {
        setIsLoading(true);
        const registeredFarmers = (await api.fetchFarmers()) as any[];
        setFarmers(
          mergeFarmers(
            readStoredFarmers(),
            registeredFarmers.map(mapToFarmer),
            FALLBACK_FARMERS
          )
        );
      } catch {
        // Backend not available — keep locally registered farmers plus fallback data silently
        console.warn('[FarmerContext] Using local/mock farmer data (backend unavailable)');
        setFarmers(mergeFarmers(readStoredFarmers(), FALLBACK_FARMERS));
      } finally {
        setIsLoading(false);
      }
    };

    fetchFarmers();
  }, []);

  const addFarmer = async (farmer: Farmer) => {
    const normalizedFarmer = mapToFarmer(farmer);

    try {
      await api.registerFarmer(normalizedFarmer as any);
    } catch {
      // Backend unavailable — register locally only
      console.warn('[FarmerContext] Farmer saved locally (backend unavailable)');
    }

    setFarmers((prev) => {
      const next = mergeFarmers([normalizedFarmer], prev);

      // Store real self-registrations locally.
      // This avoids filling localStorage with all mock/backend farmers.
      writeStoredFarmers(next.filter((f) => f.pin || f.photo || f.signature));

      return next;
    });
  };

  const findFarmerByNRC = (nrc: string) => {
    const normalizedNrc = normalizeNRC(nrc);
    return farmers.find((f) => normalizeNRC(f.nrc) === normalizedNrc);
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