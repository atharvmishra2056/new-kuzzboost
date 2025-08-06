import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Service, Review } from '@/types/service';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Star, Loader2 } from 'lucide-react';
import ReviewList from '@/components/ReviewList';
import { Progress } from '@/components/ui/progress';
import ReviewModal from '@/components/ReviewModal';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'; 

const ServiceReviews = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const serviceId = id ? parseInt(id, 10) : -1;
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [isReviewModalOpen, setReviewModalOpen] = useState(false);
  const [reviewToEdit, setReviewToEdit] = useState<Review | null>(null);
  const [sortOrder, setSortOrder] = useState('newest');

  const { data: service, isLoading: isLoadingService } = useQuery<Service, Error>({
    queryKey: ['service', serviceId],
    queryFn: async () => {
      if (!serviceId) throw new Error('Service ID is required');
      const { data, error } = await supabase
        .from('services')
        .select(`
          id, created_at, updated_at, title, platform, description, features, 
          icon_name as "iconName", 
          rating, reviews, badge, 
          refill_eligible as "refill_eligible", 
          is_active as "isActive", 
          rules, estimatedDelivery, tiers, packageTypes
        `)
        .eq('id', serviceId)
        .single();

      if (error) {
        console.error('Error fetching service:', error);
        throw new Error(error.message);
      }
      if (!data) {
        throw new Error('Service not found');
      }
      return data as unknown as Service;
    },
    enabled: !!serviceId,
  });

  const { data: reviews, isLoading: areReviewsLoading, isError: areReviewsError } = useQuery<Review[]>({
    queryKey: ['reviews', serviceId],
    queryFn: async () => {
      if (!serviceId) return [];
      const { data, error } = await supabase
        .from('reviews')
        .select('*, user:profiles(full_name, avatar_url)')
        .eq('service_id', serviceId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      if (!data) return [];
      return data.map(r => {
        const reviewData: Review = {
          id: r.id,
          created_at: r.created_at,
          service_id: r.service_id,
          user_id: r.user_id,
          rating: r.rating,
          title: r.title,
          comment: r.comment,
          media_urls: Array.isArray(r.media_urls) ? r.media_urls.filter((url): url is string => typeof url === 'string') : [],
          is_verified_purchase: r.is_verified_purchase || false,
          user: r.user ? { full_name: r.user.full_name, avatar_url: r.user.avatar_url } : { full_name: 'Anonymous' },
        };
        return reviewData;
      });
    },
    enabled: !!serviceId,
  });

  const sortedReviews = useMemo(() => {
    if (!reviews) return [];
    return [...reviews].sort((a, b) => {
      switch (sortOrder) {
        case 'highest':
          return b.rating - a.rating;
        case 'lowest':
          return a.rating - b.rating;
        case 'newest':
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
    });
  }, [reviews, sortOrder]);

  const deleteReviewMutation = useMutation({
    mutationFn: async (reviewId: string) => {
      const { error } = await (supabase.rpc as any)('delete_review', { 
        review_id_to_delete: reviewId 
      });
      if (error) throw new Error(error.message);
      return true;
    },
    onSuccess: () => {
      toast({ title: 'Success', description: 'Your review has been deleted.' });
      queryClient.invalidateQueries({ queryKey: ['reviews', serviceId] });
    },
    onError: (error: Error) => {
      toast({ variant: 'destructive', title: 'Error', description: error.message });
    },
  });

  const handleDeleteReview = async (reviewId: string) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;
    try {
      await deleteReviewMutation.mutateAsync(reviewId);
    } catch (error) {
      console.error('Error deleting review:', error);
    }
  };

  const handleEditReview = (review: Review) => {
    setReviewToEdit(review);
    setReviewModalOpen(true);
  };

  const handleOpenReviewModal = () => {
    setReviewToEdit(null);
    setReviewModalOpen(true);
  };

  const { averageRating, reviewCount, ratingDistribution, userHasReviewed } = useMemo(() => {
    if (!reviews) return { averageRating: 0, reviewCount: 0, ratingDistribution: [], userHasReviewed: false };

    const reviewCount = reviews.length;
    const averageRating = reviewCount > 0 ? reviews.reduce((acc, r) => acc + (r.rating || 0), 0) / reviewCount : 0;
    const userHasReviewed = currentUser ? reviews.some(r => r.user_id === currentUser.id) : false;

    const distribution = [5, 4, 3, 2, 1].map(star => {
      const count = reviews.filter(r => r.rating === star).length;
      return {
        star,
        count,
        percentage: reviewCount > 0 ? (count / reviewCount) * 100 : 0,
      };
    });

    return {
      averageRating: parseFloat(averageRating.toFixed(1)),
      reviewCount,
      ratingDistribution: distribution,
      userHasReviewed,
    };
  }, [reviews, currentUser]);

  if (isLoadingService) {
    return <div className="flex justify-center items-center h-screen"><Loader2 className="w-12 h-12 animate-spin" /></div>;
  }

  if (!service) {
    return <div>Service not found.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 text-white">
      <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6 flex items-center">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Service
      </Button>

      <div className="mb-8">
        <h1 className="text-3xl font-bold font-clash mb-2">Reviews for {service.title}</h1>
        {reviewCount > 0 && (
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
            <span className="font-bold text-xl">{averageRating.toFixed(1)}</span>
            <span className="text-muted-foreground">({reviewCount} reviews)</span>
          </div>
        )}
      </div>

      {reviews && reviews.length > 0 && (
        <div className="my-8 p-6 glass rounded-2xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div className="flex flex-col items-center justify-center md:border-r md:border-white/10 md:pr-6">
              <p className="text-5xl font-bold font-clash text-primary">{averageRating}</p>
              <div className="flex items-center my-2">
                {[1, 2, 3, 4, 5].map(star => (
                  <Star key={star} className={`h-6 w-6 ${star <= Math.round(averageRating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}`} />
                ))}
              </div>
              <p className="text-muted-foreground">based on {reviewCount} reviews</p>
            </div>
            <div className="md:col-span-2 space-y-2">
              {ratingDistribution.map(({ star, count, percentage }) => (
                <div key={star} className="flex items-center gap-4">
                  <span className="text-sm text-muted-foreground whitespace-nowrap w-16">{star} star{star > 1 ? 's' : ''}</span>
                  <Progress value={percentage} className="w-full h-2 bg-gray-700" />
                  <span className="text-sm text-primary font-medium w-12 text-right">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="w-full mt-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-primary mb-4 md:mb-0">All Reviews ({reviewCount})</h2>
          <div className="flex items-center gap-4">
            <Select value={sortOrder} onValueChange={setSortOrder}>
              <SelectTrigger className="w-[180px] glass">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Most Recent</SelectItem>
                <SelectItem value="highest">Highest Rating</SelectItem>
                <SelectItem value="lowest">Lowest Rating</SelectItem>
              </SelectContent>
            </Select>
            {!userHasReviewed && currentUser && (
              <Button onClick={handleOpenReviewModal} className="glass-button">Write a Review</Button>
            )}
          </div>
        </div>
        {areReviewsLoading ? (
          <div className="text-center py-10"><Loader2 className="w-8 h-8 animate-spin mx-auto" /></div>
        ) : areReviewsError ? (
          <div className="text-center py-10 text-red-500">Could not load reviews.</div>
        ) : sortedReviews.length > 0 ? (
          <ReviewList 
            reviews={sortedReviews} 
            onEdit={handleEditReview}
            onDelete={handleDeleteReview}
            currentUserProfileId={currentUser?.id}
          />
        ) : (
          <div className="text-center py-10 glass rounded-2xl">
            <p className="text-muted-foreground mb-4">This service doesn't have any reviews yet.</p>
            {!userHasReviewed && currentUser && (
               <Button onClick={handleOpenReviewModal} variant="outline">Be the first to write a review</Button>
            )}
          </div>
        )}
      </div>

      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        serviceId={serviceId}
        reviewToEdit={reviewToEdit}
        onReviewSubmitted={async () => {
          setReviewModalOpen(false);
          setReviewToEdit(null);
          await queryClient.invalidateQueries({ queryKey: ['reviews', serviceId] });
        }}
      />
    </div>
  );
};

export default ServiceReviews;
