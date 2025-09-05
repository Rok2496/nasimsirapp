// API Service Layer for SmartTech E-commerce Backend Integration

import {
  Product,
  Order,
  OrderCreate,
  ChatMessageCreate,
  ChatMessageResponse,
  ChatMessage,
  AdminLogin,
  Token,
  Admin,
  DashboardStats,
  FileUploadResponse,
  FileItem
} from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

// Generic API request handler
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  const config: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    console.log(`Making API request to: ${url}`, config);
    const response = await fetch(url, config);
    
    console.log(`API response status: ${response.status}`);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: 'Unknown error' }));
      console.error('API error response:', errorData);
      throw new ApiError(response.status, errorData.detail || 'Request failed');
    }

    const data = await response.json();
    console.log(`API response data:`, data);
    return data;
  } catch (error) {
    console.error('API request error:', error);
    if (error instanceof ApiError) {
      throw error;
    }
    // Handle network errors
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new ApiError(0, 'Network error - Unable to connect to the server');
    }
    throw new ApiError(0, 'Network error');
  }
}

// Authentication utilities
function getAuthHeaders(): Record<string, string> {
  const token = localStorage.getItem('admin_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// Public API endpoints (no authentication required)
export const publicApi = {
  // Products
  async getProducts(): Promise<Product[]> {
    return apiRequest<Product[]>('/api/products/');
  },

  async getProduct(id: number): Promise<Product> {
    return apiRequest<Product>(`/api/products/${id}`);
  },

  // Orders
  async createOrder(orderData: OrderCreate): Promise<Order> {
    return apiRequest<Order>('/api/orders/', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  },

  // Chatbot
  async sendChatMessage(messageData: ChatMessageCreate): Promise<ChatMessageResponse> {
    try {
      console.log('Sending chat message data:', messageData);
      const response = await apiRequest<ChatMessageResponse>('/api/chat/', {
        method: 'POST',
        body: JSON.stringify({
          message: messageData.message,
          session_id: messageData.session_id,
          language: messageData.language || 'en'
        }),
      });
      console.log('Chat response received:', response);
      return response;
    } catch (error) {
      console.error('Chat API error:', error);
      // Return a more user-friendly error message
      if (error instanceof ApiError) {
        if (error.status === 500) {
          throw new ApiError(error.status, 'I\'m experiencing technical difficulties. Please try again in a moment or contact us directly at 01678-134547.');
        }
      }
      throw error;
    }
  },

  async getChatHistory(sessionId: string): Promise<ChatMessage[]> {
    return apiRequest<ChatMessage[]>(`/api/chat/history/${sessionId}`);
  },

  // Health check
  async healthCheck(): Promise<{ status: string; service: string }> {
    return apiRequest<{ status: string; service: string }>('/health');
  },
};

// Admin API endpoints (authentication required)
export const adminApi = {
  // Authentication
  async login(credentials: AdminLogin): Promise<Token> {
    const response = await apiRequest<Token>('/api/admin/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    // Store token in localStorage
    localStorage.setItem('admin_token', response.access_token);
    return response;
  },

  async getProfile(): Promise<Admin> {
    return apiRequest<Admin>('/api/admin/me', {
      headers: getAuthHeaders(),
    });
  },

  // Orders management
  async getOrders(params?: {
    skip?: number;
    limit?: number;
    status?: string;
  }): Promise<Order[]> {
    const queryParams = new URLSearchParams();
    if (params?.skip) queryParams.append('skip', params.skip.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.status) queryParams.append('status', params.status);

    const endpoint = `/api/orders/${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    
    return apiRequest<Order[]>(endpoint, {
      headers: getAuthHeaders(),
    });
  },

  async updateOrder(orderId: number, updates: Partial<Order>): Promise<Order> {
    return apiRequest<Order>(`/api/orders/${orderId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(updates),
    });
  },

  async deleteOrder(orderId: number): Promise<{ message: string }> {
    return apiRequest<{ message: string }>(`/api/orders/${orderId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
  },

  // Dashboard
  async getDashboardStats(): Promise<DashboardStats> {
    return apiRequest<DashboardStats>('/api/dashboard/stats', {
      headers: getAuthHeaders(),
    });
  },

  // File Management
  async uploadImage(file: File): Promise<FileUploadResponse> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/api/admin/files/upload-image`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: 'Upload failed' }));
      throw new ApiError(response.status, errorData.detail);
    }

    return response.json();
  },

  async uploadVideo(file: File): Promise<FileUploadResponse> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/api/admin/files/upload-video`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: 'Upload failed' }));
      throw new ApiError(response.status, errorData.detail);
    }

    return response.json();
  },

  async listFiles(fileType: 'images' | 'videos'): Promise<{ files: FileItem[] }> {
    return apiRequest<{ files: FileItem[] }>(`/api/admin/files/list/${fileType}`, {
      headers: getAuthHeaders(),
    });
  },

  async deleteFile(fileType: 'images' | 'videos', filename: string): Promise<{ message: string }> {
    return apiRequest<{ message: string }>(`/api/admin/files/delete/${fileType}/${filename}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
  },

  async updateProductMedia(
    productId: number,
    data: { images?: string[]; video_url?: string }
  ): Promise<Product> {
    return apiRequest<Product>(`/api/admin/files/update-product-media/${productId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
  },
};

// Utility functions
export const authUtils = {
  isAuthenticated(): boolean {
    return !!localStorage.getItem('admin_token');
  },

  logout(): void {
    localStorage.removeItem('admin_token');
  },

  getToken(): string | null {
    return localStorage.getItem('admin_token');
  },
};

export { ApiError };