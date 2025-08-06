import { ReactElement } from "react";

export interface Review {
  id: string;
  created_at: string | null;
  service_id: number;
  user_id: string;
  rating: number;
  title?: string | null;
  comment?: string | null;
  is_verified_purchase?: boolean;
  media_urls?: string[] | null;
  user?: {
    full_name?: string | null;
    avatar_url?: string | null;
    [key: string]: any;
  };
  [key: string]: any;
}

export interface QnA {
  id: string;
  created_at: string;
  question: string;
  answer: string | null;
  user: {
    full_name: string | null;
    avatar_url: string | null;
  } | null;
}

export interface ServiceTier {
  id?: string;
  quantity: number;
  price: number;
}

export interface Service {
  id: number;
  created_at: string;
  updated_at: string;
  title: string;
  platform: string;
  description: string;
  features: string[] | null;
  icon?: ReactElement;
  iconName: string;
  rating: number | null;
  reviews: number | null;
  badge: string | null;
  refill_eligible: boolean | null;
  isActive?: boolean | null;
  rules?: string[] | null;
  estimatedDelivery?: string | null;
  tiers?: ServiceTier[];
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

export interface RefillRequest {
  id: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  requested_at: string;
  current_count?: number;
  screenshot_url?: string;
  admin_notes?: string | null;
  processed_by?: string | null;
  processed_at?: string | null;
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
    refill_eligible?: boolean;
  }>;
  total_amount: number;
  status: 'pending' | 'processing' | 'shipped' | 'completed' | 'cancelled';
  transaction_id?: string;
  payment_verified: boolean;
  tracking_info: TrackingInfo[];
  refill_requests?: RefillRequest[];
  created_at: string;
  updated_at: string;
}