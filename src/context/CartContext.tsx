import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';
import { Service } from '@/types/service';

export interface CartItem {
  id: string;
  service_id: number;
  title: string;
  platform: string;
  iconName: string;
  quantity: number;
  service_quantity: number;
  price: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (service: Service, serviceQuantity: number, price: number) => Promise<void>;
  removeFromCart: (cartItemId: string) => Promise<void>;
  updateCartItemQuantity: (cartItemId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  cartCount: number;
  loading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const { currentUser } = useAuth();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);

  // Load cart items when user changes
  useEffect(() => {
    if (currentUser) {
      loadCartItems();
    } else {
      setCartItems([]);
    }
  }, [currentUser]);

  const loadCartItems = async () => {
    if (!currentUser) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('carts')
        .select(`
          id,
          service_id,
          quantity,
          service_quantity,
          price,
          services (
            title,
            platform,
            icon_name
          )
        `)
        .eq('user_id', currentUser.id);

      if (error) throw error;

      const formattedItems: CartItem[] = data?.map(item => ({
        id: item.id,
        service_id: item.service_id,
        title: (item.services as any)?.title || 'Unknown Service',
        platform: (item.services as any)?.platform || 'unknown',
        iconName: (item.services as any)?.icon_name || 'SiInstagram',
        quantity: item.quantity,
        service_quantity: item.service_quantity,
        price: Number(item.price),
      })) || [];

      setCartItems(formattedItems);
    } catch (error) {
      console.error('Error loading cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (service: Service, serviceQuantity: number, price: number) => {
    if (!currentUser) return;

    try {
      const { data, error } = await supabase
        .from('carts')
        .upsert({
          user_id: currentUser.id,
          service_id: service.id,
          quantity: 1,
          service_quantity: serviceQuantity,
          price: price
        }, {
          onConflict: 'user_id,service_id'
        })
        .select();

      if (error) throw error;

      await loadCartItems(); // Reload to get updated data
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const removeFromCart = async (cartItemId: string) => {
    if (!currentUser) return;

    try {
      const { error } = await supabase
        .from('carts')
        .delete()
        .eq('id', cartItemId)
        .eq('user_id', currentUser.id);

      if (error) throw error;

      setCartItems(prev => prev.filter(item => item.id !== cartItemId));
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  };

  const updateCartItemQuantity = async (cartItemId: string, quantity: number) => {
    if (!currentUser || quantity <= 0) return;

    try {
      const { error } = await supabase
        .from('carts')
        .update({ quantity })
        .eq('id', cartItemId)
        .eq('user_id', currentUser.id);

      if (error) throw error;

      setCartItems(prev => 
        prev.map(item => 
          item.id === cartItemId ? { ...item, quantity } : item
        )
      );
    } catch (error) {
      console.error('Error updating cart quantity:', error);
    }
  };

  const clearCart = async () => {
    if (!currentUser) return;

    try {
      const { error } = await supabase
        .from('carts')
        .delete()
        .eq('user_id', currentUser.id);

      if (error) throw error;

      setCartItems([]);
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  };

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateCartItemQuantity,
    clearCart,
    cartCount: cartItems.length,
    loading,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};