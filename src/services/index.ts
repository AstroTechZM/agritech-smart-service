export * from './api-client';
export * from './wallet.api';
export * from './registration.api';
export * from './stock.api';
export * from './production.api';
export * from './admin.api';

// Legacy compatibility object (optional, but helpful for migration)
import { walletApi } from './wallet.api';
import { registrationApi } from './registration.api';
import { stockApi } from './stock.api';
import { productionApi } from './production.api';
import { adminApi } from './admin.api';

export const api = {
  ...walletApi,
  ...registrationApi,
  ...stockApi,
  ...productionApi,
  ...adminApi,
};
