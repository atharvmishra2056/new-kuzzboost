import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '../context/AuthContext';
import { Service } from '@/types/service';

export const useWishlist = () => {
  const { currentUser } = useAuth();
  const [wishlistItems, setWishlistItems] = useState<Service[]>([]);
  const [loading, setLoading] = useState(false);

  // Load wishlist when user changes
  useEffect(() => {
    if (currentUser) {
      loadWishlist();
    } else {
      setWishlistItems([]);
    }
  }, [currentUser]);

  const loadWishlist = async () => {
    if (!currentUser) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('wishlists')
        .select(`
          services (
            id,
            title,
            platform,
            icon_name,
            description,
            rating,
            reviews,
            badge,
            features,
            service_tiers (
              quantity,
              price
            )
          )
        `)
        .eq('user_id', currentUser.id);

      if (error) throw error;

      const formattedItems: Service[] = data?.map(item => {
        const service = item.services as any;
        return {
          id: service.id,
          title: service.title,
          platform: service.platform,
          iconName: service.icon_name,
          description: service.description,
          rating: service.rating,
          reviews: service.reviews,
          badge: service.badge,
          features: service.features || [],
          tiers: service.service_tiers?.map((tier: any) => ({
            quantity: tier.quantity,
            price: Number(tier.price)
          })) || []
        };
      }) || [];

      setWishlistItems(formattedItems);
    } catch (error) {
      console.error('Error loading wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToWishlist = async (service: Service): Promise<boolean> => {
    if (!currentUser) return false;
    
    const isAlreadyInWishlist = wishlistItems.some(item => item.id === service.id);
    if (isAlreadyInWishlist) return false;

    try {
      const { error } = await supabase
        .from('wishlists')
        .insert({
          user_id: currentUser.id,
          service_id: service.id
        });

      if (error) throw error;

      await loadWishlist(); // Reload to get updated data
      return true;
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      return false;
    }
  };

  const removeFromWishlist = async (serviceId: number) => {
    if (!currentUser) return;

    try {
      const { error } = await supabase
        .from('wishlists')
        .delete()
        .eq('user_id', currentUser.id)
        .eq('service_id', serviceId);

      if (error) throw error;

      setWishlistItems(prev => prev.filter(item => item.id !== serviceId));
    } catch (error) {
      console.error('Error removing from wishlist:', error);
    }
  };

  const isInWishlist = (serviceId: number) => {
    return wishlistItems.some(item => item.id === serviceId);
  };

  const clearWishlist = async () => {
    if (!currentUser) return;

    try {
      const { error } = await supabase
        .from('wishlists')
        .delete()
        .eq('user_id', currentUser.id);

      if (error) throw error;

      setWishlistItems([]);
    } catch (error) {
      console.error('Error clearing wishlist:', error);
    }
  };

  return {
    wishlistItems,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    clearWishlist,
    wishlistCount: wishlistItems.length,
    loading
  };
};