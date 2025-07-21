import { ReactElement } from "react";

export interface ServiceTier {
  id?: string;
  quantity: number;
  price: number;
}

export interface Service {
  id: number;
  title: string;
  platform: string;
  icon?: ReactElement;
  iconName: string; // This was a duplicate, but keeping it to match your existing code
  tiers?: ServiceTier[];
  rating: number;
  reviews: number;
  features: string[];
  description: string;
  badge: string;
  isActive?: boolean;
  // --- FIX: ADDED THE MISSING OPTIONAL PROPERTIES ---
  rules?: string[];
  estimatedDelivery?: string;
  packageTypes?: { name: string; description: string; multiplier: number }[];
}

export interface TrackingInfo {
  status: string;
  timestamp: string;
  description: string;
}

export interface Address {
  id: string;
  user_id: string;
  label: string;
  first_name: string;
  last_name: string;
  phone: string;
  address_line_1: string;
  address_line_2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  order_id: string;
  user_id: string;
  user_email: string;
  customer_info: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address?: string;
    city?: string;
    postalCode?: string;
    country?: string;
  };
  items: Array<{
    id: number;
    title: string;
    platform: string;
    iconName: string;
    quantity: number;
    service_quantity: number;
    price: number;
    userInput: string;
  }>;
  total_amount: number;
  status: 'pending' | 'processing' | 'shipped' | 'completed' | 'cancelled';
  transaction_id?: string;
  payment_verified: boolean;
  tracking_info: TrackingInfo[];
  created_at: string;
  updated_at: string;
}