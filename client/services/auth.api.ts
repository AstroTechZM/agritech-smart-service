// client/services/auth.api.ts
import { apiClient } from './api-client';

export const authApi = {
  /**
   * POST /api/v1/auth/login
   * Returns { token, user }
   */
  login: async (identifier: string, password: string, role: string) =>
    apiClient.post<{ token: string; user: any }>('/auth/login', {
      identifier,
      password,
      role,
    }),

  /**
   * POST /api/v1/auth/logout
   */
  logout: async () =>
    apiClient.post('/auth/logout'),
};