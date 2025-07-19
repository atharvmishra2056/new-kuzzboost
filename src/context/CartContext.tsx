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
  userInput: string; // ADDED: To store the target URL/username
}

interface CartContextType {
  cartItems: CartItem[];
  // MODIFIED: Added userInput to the function signature
  addToCart: (service: Service, serviceQuantity: number, price: number, userInput: string) => Promise<void>;
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
          userInput,
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
        userInput: item.userInput || '', // ADDED
      })) || [];

      setCartItems(formattedItems);
    } catch (error) {
      console.error('Error loading cart:', error);
    } finally {
      setLoading(false);
    }
  };

  // MODIFIED: Added userInput parameter and logic to handle it
  const addToCart = async (service: Service, serviceQuantity: number, price: number, userInput: string) => {
    if (!currentUser) return;

    try {
      // Check for an existing item with the same service AND same userInput
      const { data: existingItem, error: findError } = await supabase
          .from('carts')
          .select('id, quantity')
          .eq('user_id', currentUser.id)
          .eq('service_id', service.id)
          .eq('userInput', userInput)
          .single();

      // Ignore "no rows found" error, but throw others
      if (findError && findError.code !== 'PGRST116') {
        throw findError;
      }

      if (existingItem) {
        // If it exists, update the quantity
        const { error: updateError } = await supabase
            .from('carts')
            .update({ quantity: existingItem.quantity + 1 })
            .eq('id', existingItem.id);

        if (updateError) throw updateError;
      } else {
        // Otherwise, insert a new row
        const { error } = await supabase
            .from('carts')
            .insert({
              user_id: currentUser.id,
              service_id: service.id,
              quantity: 1,
              service_quantity: serviceQuantity,
              price: price,
              userInput: userInput // ADDED
            });

        if (error) throw error;
      }

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
    if (!currentUser) return;

    // MODIFIED: If quantity is 0 or less, remove the item instead of doing nothing
    if (quantity <= 0) {
      return removeFromCart(cartItemId);
    }

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