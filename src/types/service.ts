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

export interface Order {
  id: string;
  orderId: string;
  userId: string;
  userEmail: string;
  customerInfo: {
    fullName: string;
    email: string;
    phone: string;
  };
  items: Array<{
    id: number;
    title: string;
    platform: string;
    quantity: number;
    serviceQuantity: number;
    price: number;
  }>;
  totalAmount: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  transactionId?: string;
  estimatedDelivery?: string;
  createdAt: string;
  updatedAt: string;
}