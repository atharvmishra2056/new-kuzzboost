import React from 'react';
import ReviewItem from './ReviewItem';
import { Review } from '@/types/service';

interface ReviewListProps {
  reviews: Review[];
  onEdit: (review: Review) => void;
  onDelete: (reviewId: string) => Promise<void>;
}

const ReviewList: React.FC<ReviewListProps> = ({ reviews, onEdit, onDelete }) => {
  if (!reviews || reviews.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No reviews yet. Be the first to leave one!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <ReviewItem key={review.id} review={review} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  );
};

export default ReviewList;