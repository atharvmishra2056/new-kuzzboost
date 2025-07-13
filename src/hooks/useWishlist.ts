import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

interface WishlistItem {
  id: number;
  title: string;
  platform: string;
  iconName: string;
  icon?: any;
  description: string;
  rating: number;
  reviews: number;
  badge: string;
  basePrice: number;
}

export const useWishlist = () => {
  const { currentUser } = useAuth();
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);

  // Load wishlist from localStorage on component mount
  useEffect(() => {
    if (currentUser) {
      const savedWishlist = localStorage.getItem(`wishlist_${currentUser.uid}`);
      if (savedWishlist) {
        setWishlistItems(JSON.parse(savedWishlist));
      }
    }
  }, [currentUser]);

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(`wishlist_${currentUser.uid}`, JSON.stringify(wishlistItems));
    }
  }, [wishlistItems, currentUser]);

  const addToWishlist = (item: WishlistItem) => {
    if (!currentUser) return false;
    
    const isAlreadyInWishlist = wishlistItems.some(wishlistItem => wishlistItem.id === item.id);
    if (isAlreadyInWishlist) return false;

    setWishlistItems(prev => [...prev, item]);
    return true;
  };

  const removeFromWishlist = (itemId: number) => {
    setWishlistItems(prev => prev.filter(item => item.id !== itemId));
  };

  const isInWishlist = (itemId: number) => {
    return wishlistItems.some(item => item.id === itemId);
  };

  const clearWishlist = () => {
    setWishlistItems([]);
  };

  return {
    wishlistItems,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    clearWishlist,
    wishlistCount: wishlistItems.length
  };
};