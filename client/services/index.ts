// client/services/index.ts

// --- Named exports (for direct imports across the app) ---
export * from './api-client';
export * from './auth.api';
export * from './wallet.api';
export * from './registration.api';
export * from './stock.api';
export * from './production.api';
export * from './admin.api';
export * from './profile.api';
export * from './deliveries.api';
export * from './voucher.api';

// --- Individual API imports ---
import { authApi } from './auth.api';
import { walletApi } from './wallet.api';
import { registrationApi } from './registration.api';
import { stockApi } from './stock.api';
import { productionApi } from './production.api';
import { adminApi } from './admin.api';
import { profileApi } from './profile.api';
import { deliveriesApi } from './deliveries.api';
import { voucherApi } from './voucher.api';

/**
 * Unified API object — use this anywhere in the app:
 *   import { api } from '@/services';
 *   await api.login(...);
 *   await api.fetchDeliveries();
 */
export const api = {
  ...authApi,
  ...walletApi,
  ...registrationApi,
  ...stockApi,
  ...productionApi,
  ...adminApi,
  ...profileApi,
  ...deliveriesApi,
  ...voucherApi,
};