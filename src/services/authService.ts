import apiClient from './api';
import type { LoginCredentials, AuthResponse, User, ApiResponse } from '../types';
import { API_ENDPOINTS, STORAGE_KEYS } from '../utils/config';

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await apiClient.post<ApiResponse<AuthResponse>>(
      API_ENDPOINTS.LOGIN,
      credentials
    );
    
    if (response.data.success && response.data.data) {
      const { token, refreshToken, user } = response.data.data;
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
      if (refreshToken) {
        localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
      }
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
      return response.data.data;
    }
    
    throw new Error(response.data.message || 'Login failed');
  },

  logout: async (): Promise<void> => {
    try {
      await apiClient.post(API_ENDPOINTS.LOGOUT);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);
    }
  },

  getCurrentUser: (): User | null => {
    const userStr = localStorage.getItem(STORAGE_KEYS.USER);
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch (error) {
        console.error('Error parsing user data:', error);
        return null;
      }
    }
    return null;
  },

  isAuthenticated: (): boolean => {
    const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    return !!token;
  },

  getProfile: async (): Promise<User> => {
    const response = await apiClient.get<ApiResponse<User>>(API_ENDPOINTS.USER_PROFILE);
    if (response.data.success && response.data.data) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.data.data));
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to get profile');
  },

  updateProfile: async (userData: Partial<User>): Promise<User> => {
    const response = await apiClient.put<ApiResponse<User>>(
      API_ENDPOINTS.USER_UPDATE,
      userData
    );
    if (response.data.success && response.data.data) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.data.data));
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to update profile');
  },
};
