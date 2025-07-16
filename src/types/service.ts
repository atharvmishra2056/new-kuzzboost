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
  iconName: string;
  tiers?: ServiceTier[];
  rating: number;
  reviews: number;
  features: string[];
  description: string;
  badge: string;
  isActive?: boolean;
}

export interface TrackingInfo {
  status: string;
  timestamp: string;
  description: string;
}

// This is the interface we are fixing
export interface Order {
  id: string;
  order_id: string;
  user_id: string;
  user_email: string;
  customer_info: {
    fullName: string;
    email: string;
    phone: string;
  };
  items: Array<{
    id: number;
    title: string;
    platform: string;
    iconName: string; // This was the missing property
    quantity: number;
    service_quantity: number;
    price: number;
  }>;
  total_amount: number;
  status: 'pending' | 'processing' | 'shipped' | 'completed' | 'cancelled';
  transaction_id?: string;
  payment_verified: boolean;
  tracking_info: TrackingInfo[];
  created_at: string;
  updated_at: string;
}