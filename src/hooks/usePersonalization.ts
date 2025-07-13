import { useState, useEffect } from 'react';
import { Service } from '@/pages/Services';

interface UserPreferences {
  favoriteCategories: string[];
  priceRange: { min: number; max: number };
  viewHistory: { serviceId: number; timestamp: number; category: string }[];
}

export const usePersonalization = () => {
  const [preferences, setPreferences] = useState<UserPreferences>({
    favoriteCategories: [],
    priceRange: { min: 0, max: 1000 },
    viewHistory: []
  });

  // Load preferences from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('userPreferences');
    if (saved) {
      try {
        setPreferences(JSON.parse(saved));
      } catch (error) {
        console.error('Error loading preferences:', error);
      }
    }
  }, []);

  // Save preferences to localStorage
  useEffect(() => {
    localStorage.setItem('userPreferences', JSON.stringify(preferences));
  }, [preferences]);

  const trackServiceView = (service: Service) => {
    setPreferences(prev => ({
      ...prev,
      viewHistory: [
        { serviceId: service.id, timestamp: Date.now(), category: service.platform },
        ...prev.viewHistory.slice(0, 49) // Keep last 50 views
      ]
    }));
  };

  const updateFavoriteCategories = (category: string) => {
    setPreferences(prev => {
      const favorites = prev.favoriteCategories.includes(category)
        ? prev.favoriteCategories.filter(c => c !== category)
        : [...prev.favoriteCategories, category];
      return { ...prev, favoriteCategories: favorites };
    });
  };

  const getRecommendations = (allServices: Service[]): Service[] => {
    // Get frequently viewed categories
    const categoryFrequency = preferences.viewHistory.reduce((acc, view) => {
      acc[view.category] = (acc[view.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Sort services by relevance
    return allServices
      .filter(service => !preferences.viewHistory.some(v => v.serviceId === service.id))
      .sort((a, b) => {
        const aFreq = categoryFrequency[a.platform] || 0;
        const bFreq = categoryFrequency[b.platform] || 0;
        if (aFreq !== bFreq) return bFreq - aFreq;
        
        // Secondary sort by rating
        return b.rating - a.rating;
      })
      .slice(0, 6);
  };

  return {
    preferences,
    trackServiceView,
    updateFavoriteCategories,
    getRecommendations
  };
};