// client/services/profile.api.ts
import { apiClient } from './api-client';
import { User } from '@/types';

export const profileApi = {
  /**
   * GET /api/v1/user/profile
   */
  getProfile: async () =>
    apiClient.get<User>('/user/profile'),

  /**
   * PUT /api/v1/user/profile
   */
  updateProfile: async (data: Partial<User>) =>
    apiClient.put<User>('/user/profile', data),
};