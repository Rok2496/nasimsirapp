// TypeScript interfaces for SmartTech E-commerce API

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  specifications: Record<string, unknown>;
  images: string[];
  video_url: string | null;
  is_active: boolean;
  stock_quantity: number;
  created_at: string;
  updated_at: string | null;
}

export interface Customer {
  id?: number;
  full_name: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
  country?: string;
  created_at?: string;
}

export interface Order {
  id: number;
  customer_id: number;
  product_id: number;
  quantity: number;
  total_price: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  special_requirements?: string;
  delivery_address?: string;
  order_date: string;
  updated_at?: string;
  customer: Customer;
  product: Product;
}

export interface OrderCreate {
  customer: Customer;
  product_id: number;
  quantity: number;
  special_requirements?: string;
  delivery_address?: string;
}

export interface ChatMessage {
  id: number;
  message: string;
  response: string | null;
  language: string;
  timestamp: string;
}

export interface ChatSession {
  id: number;
  session_id: string;
  created_at: string;
  messages: ChatMessage[];
}

export interface ChatMessageCreate {
  message: string;
  session_id?: string;
  language?: string;
}

export interface ChatMessageResponse {
  response: string;
  session_id: string;
}

export interface Admin {
  id: number;
  username: string;
  email: string;
  is_active: boolean;
  is_superuser: boolean;
  created_at: string;
}

export interface AdminLogin {
  username: string;
  password: string;
}

export interface Token {
  access_token: string;
  token_type: string;
}

export interface DashboardStats {
  total_orders: number;
  pending_orders: number;
  confirmed_orders: number;
  shipped_orders: number;
  delivered_orders: number;
  cancelled_orders: number;
  total_revenue: number;
  total_customers: number;
  recent_orders: Order[];
}

export interface FileUploadResponse {
  filename: string;
  original_filename: string;
  url: string;
  message: string;
}

export interface ApiError {
  detail: string;
}

export interface FileItem {
  filename: string;
  size: number;
  url: string;
  type: 'images' | 'videos';
}