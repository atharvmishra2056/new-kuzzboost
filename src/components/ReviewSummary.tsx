import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Star } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface ReviewSummaryProps {
  serviceId: number;
}

const ReviewSummary: React.FC<ReviewSummaryProps> = ({ serviceId }) => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  type RatingRow = { rating: number };
  const { data: reviews } = useQuery<RatingRow[]>({
    queryKey: ['reviews', serviceId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('reviews')
        .select('rating')
        .eq('service_id', serviceId);
      if (error) throw error;
      return (data as RatingRow[]) || [];
    },
    enabled: !!serviceId,
    refetchOnWindowFocus: false,
  });

  const { averageRating, reviewCount, distribution } = useMemo(() => {
    const count = reviews?.length || 0;
    const avg = count > 0 ? (reviews!.reduce((acc: number, r: RatingRow) => acc + (r.rating || 0), 0) / count) : 0;
    const dist = [5, 4, 3, 2, 1].map(star => {
      const starCount = (reviews || []).filter((r: RatingRow) => r.rating === star).length;
      return { star, count: starCount, percentage: count ? (starCount / count) * 100 : 0 };
    });
    return { averageRating: Number(avg.toFixed(1)), reviewCount: count, distribution: dist };
  }, [reviews]);

  const seeAllPath = currentUser ? `/dashboard/service/${serviceId}/reviews` : `/service/${serviceId}/reviews`;

  return (
    <Card className="glass">
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <div className="flex flex-col items-center justify-center md:border-r md:border-white/10 md:pr-6">
            <p className="text-5xl font-bold font-clash text-primary">{averageRating.toFixed(1)}</p>
            <div className="flex items-center my-2">
              {[1,2,3,4,5].map(i => (
                <Star key={i} className={`h-6 w-6 ${i <= Math.round(averageRating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}`} />
              ))}
            </div>
            <p className="text-muted-foreground">based on {reviewCount} reviews</p>
          </div>
          <div className="md:col-span-2 space-y-2">
            {distribution.map(({ star, percentage, count }) => (
              <div key={star} className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground whitespace-nowrap w-16">{star} star{star>1?'s':''}</span>
                <Progress value={percentage} className="w-full h-2 bg-gray-700" />
                <span className="text-sm text-primary font-medium w-12 text-right">{count}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-6 text-center">
          <Button variant="outline" onClick={() => navigate(seeAllPath)}>See all reviews</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReviewSummary;