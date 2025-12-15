import apiClient from './api';
import type { UploadHistory, PaginatedResponse, ApiResponse } from '../types';
import { API_ENDPOINTS } from '../utils/config';

export const historyService = {
  getUploadHistory: async (page: number = 1, pageSize: number = 20): Promise<PaginatedResponse<UploadHistory>> => {
    const params = { page, pageSize };
    const response = await apiClient.get<ApiResponse<PaginatedResponse<UploadHistory>>>(
      API_ENDPOINTS.UPLOAD_HISTORY,
      { params }
    );
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to fetch upload history');
  },

  getHistoryById: async (id: string): Promise<UploadHistory> => {
    const response = await apiClient.get<ApiResponse<UploadHistory>>(
      API_ENDPOINTS.HISTORY_DETAIL(id)
    );
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to fetch history item');
  },
};
