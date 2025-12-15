// User types
export interface User {
  id: string;
  username: string;
  email: string;
  role?: string;
  createdAt?: string;
}

// Image types
export interface ImageInfo {
  id: string;
  url: string;
  thumbnailUrl?: string;
  title?: string;
  description?: string;
  uploadedBy: string;
  uploadedAt: string;
  promptText?: string;
  metadata?: Record<string, any>;
  tags?: string[];
  status?: 'processing' | 'completed' | 'failed';
}

// Upload types
export interface UploadRequest {
  file?: File;
  promptText: string;
  metadata?: Record<string, any>;
}

export interface UploadHistory {
  id: string;
  imageId?: string;
  promptText: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  createdAt: string;
  completedAt?: string;
  errorMessage?: string;
  imageUrl?: string;
  thumbnailUrl?: string;
}

// Auth types
export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken?: string;
}

// API response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// WebSocket message types
export interface RealTimeUpdate {
  type: 'image_processed' | 'upload_progress' | 'status_update';
  payload: any;
  timestamp: string;
}
