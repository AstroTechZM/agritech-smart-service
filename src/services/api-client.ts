import { LOGIC_CONSTANTS } from '../constants';

/**
 * BASE API CLIENT
 * This file handles the simulated network layer. 
 * In a production app, this would use 'fetch' or 'axios' to talk to the real backend.
 */

// Simulated delay helper
export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock response wrapper to simulate fetch/axios behavior
export const apiClient = {
  get: async <T>(url: string, delayMs: number = LOGIC_CONSTANTS.API_DELAY_SHORT): Promise<T> => {
    console.log(`[API] GET ${url}`);
    await delay(delayMs);
    return null as any; // This will be overridden by the domain services
  },
  
  post: async <T>(url: string, data: any, delayMs: number = LOGIC_CONSTANTS.API_DELAY_MEDIUM): Promise<T> => {
    console.log(`[API] POST ${url}`, data);
    await delay(delayMs);
    return null as any; // This will be overridden by the domain services
  }
};
