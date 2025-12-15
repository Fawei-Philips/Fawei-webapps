// API configuration
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
export const WS_BASE_URL = import.meta.env.VITE_WS_BASE_URL || 'ws://localhost:8080/ws';
export const RABBITMQ_WS_URL = import.meta.env.VITE_RABBITMQ_WS_URL || 'http://localhost:15674/stomp';

// Storage keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  REFRESH_TOKEN: 'refresh_token',
  USER: 'user',
} as const;

// API endpoints
export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/auth/login',
  LOGOUT: '/auth/logout',
  REFRESH: '/auth/refresh',
  REGISTER: '/auth/register',
  
  // User
  USER_PROFILE: '/user/profile',
  USER_UPDATE: '/user/update',
  
  // Images
  IMAGES: '/images',
  IMAGE_DETAIL: (id: string) => `/images/${id}`,
  IMAGE_UPLOAD: '/images/upload',
  
  // History
  UPLOAD_HISTORY: '/history/uploads',
  HISTORY_DETAIL: (id: string) => `/history/${id}`,
} as const;

// Application constants
export const APP_CONFIG = {
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_FILE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  PAGE_SIZE: 20,
  MAX_PROMPT_LENGTH: 1000,
} as const;
