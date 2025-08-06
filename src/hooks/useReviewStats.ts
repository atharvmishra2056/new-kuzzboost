import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface ReviewStats {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: { [key: number]: number };
}

export const useReviewStats = (serviceId: number) => {
  return useQuery<ReviewStats>({
    queryKey: ['reviewStats', serviceId],
    queryFn: async (): Promise<ReviewStats> => {
      const { data, error } = await supabase
        .from('reviews')
        .select('rating')
        .eq('service_id', serviceId);
        
      if (error) {
        console.error('Error fetching review stats:', error);
        throw error;
      }
      
      if (!data || data.length === 0) {
        return {
          averageRating: 0,
          totalReviews: 0,
          ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
        };
      }
      
      const totalReviews = data.length;
      const averageRating = data.reduce((acc, review) => acc + review.rating, 0) / totalReviews;
      
      const ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
      data.forEach(review => {
        ratingDistribution[review.rating] = (ratingDistribution[review.rating] || 0) + 1;
      });
      
      return {
        averageRating: Number(averageRating.toFixed(1)),
        totalReviews,
        ratingDistribution
      };
    },
    enabled: serviceId > 0,
    refetchOnWindowFocus: false,
  });
};

export const useAllServicesReviewStats = () => {
  return useQuery<{ [serviceId: number]: ReviewStats }>({
    queryKey: ['allServicesReviewStats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('reviews')
        .select('service_id, rating');
        
      if (error) {
        console.error('Error fetching all review stats:', error);
        throw error;
      }
      
      if (!data || data.length === 0) {
        return {};
      }
      
      const serviceStats: { [serviceId: number]: ReviewStats } = {};
      
      // Group reviews by service_id
      const reviewsByService = data.reduce((acc, review) => {
        if (!acc[review.service_id]) {
          acc[review.service_id] = [];
        }
        acc[review.service_id].push(review);
        return acc;
      }, {} as { [serviceId: number]: any[] });
      
      // Calculate stats for each service
      Object.entries(reviewsByService).forEach(([serviceId, reviews]) => {
        const totalReviews = reviews.length;
        const averageRating = reviews.reduce((acc, review) => acc + review.rating, 0) / totalReviews;
        
        const ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        reviews.forEach(review => {
          ratingDistribution[review.rating] = (ratingDistribution[review.rating] || 0) + 1;
        });
        
        serviceStats[parseInt(serviceId)] = {
          averageRating: Number(averageRating.toFixed(1)),
          totalReviews,
          ratingDistribution
        };
      });
      
      return serviceStats;
    },
    refetchOnWindowFocus: false,
  });
};