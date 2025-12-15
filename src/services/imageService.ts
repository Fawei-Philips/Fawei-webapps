import apiClient from './api';
import type { ImageInfo, PaginatedResponse, ApiResponse } from '../types';
import { API_ENDPOINTS } from '../utils/config';

export const imageService = {
  getImages: async (page: number = 1, pageSize: number = 20, filters?: Record<string, unknown>): Promise<PaginatedResponse<ImageInfo>> => {
    const params = {
      page,
      pageSize,
      ...filters,
    };
    const response = await apiClient.get<ApiResponse<PaginatedResponse<ImageInfo>>>(
      API_ENDPOINTS.IMAGES,
      { params }
    );
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to fetch images');
  },

  getImageById: async (id: string): Promise<ImageInfo> => {
    const response = await apiClient.get<ApiResponse<ImageInfo>>(
      API_ENDPOINTS.IMAGE_DETAIL(id)
    );
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to fetch image');
  },

  uploadImage: async (file: File, promptText: string, metadata?: Record<string, unknown>): Promise<ImageInfo> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('promptText', promptText);
    if (metadata) {
      formData.append('metadata', JSON.stringify(metadata));
    }

    const response = await apiClient.post<ApiResponse<ImageInfo>>(
      API_ENDPOINTS.IMAGE_UPLOAD,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to upload image');
  },

  deleteImage: async (id: string): Promise<void> => {
    const response = await apiClient.delete<ApiResponse<void>>(
      API_ENDPOINTS.IMAGE_DETAIL(id)
    );
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to delete image');
    }
  },
};
