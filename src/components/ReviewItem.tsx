import React, { useState } from 'react';
import { Star, MoreVertical, Edit, Trash2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Review } from '@/types/service';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ReviewItemProps {
  review: Review;
  onEdit: (review: Review) => void;
  onDelete: (reviewId: string) => Promise<void>;
}

const ReviewItem: React.FC<ReviewItemProps> = ({ review, onEdit, onDelete }) => {
  const { currentUser } = useAuth();
  const [isDeleting, setIsDeleting] = useState(false);
  const isOwner = currentUser?.id === review.user_id;

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      setIsDeleting(true);
      await onDelete(review.id);
      setIsDeleting(false);
    }
  };

  const renderStars = () => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-5 h-5 ${i < review.rating ? 'text-accent-peach fill-accent-peach' : 'text-gray-400'}`}
      />
    ));
  };

  return (
    <div className="glass rounded-lg p-6 flex flex-col sm:flex-row gap-6 relative">
        <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center font-bold text-primary text-xl">
            {review.user?.full_name?.charAt(0).toUpperCase() || 'A'}
        </div>
        <div className="flex-grow">
            <div className="flex items-center justify-between">
                <div>
                    <h4 className="font-semibold text-primary">{review.user?.full_name || 'Anonymous'}</h4>
                    <p className="text-sm text-muted-foreground">{new Date(review.created_at).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-1">
                    {renderStars()}
                </div>
            </div>
            <h5 className="font-semibold text-lg mt-3">{review.title}</h5>
            <p className="text-muted-foreground mt-1">{review.comment}</p>
        </div>
        {isOwner && (
            <div className="absolute top-4 right-4">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <MoreVertical className="h-5 w-5" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onSelect={() => onEdit(review)}>
                            <Edit className="mr-2 h-4 w-4" />
                            <span>Edit</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onSelect={handleDelete} disabled={isDeleting} className="text-red-500 focus:text-red-500 focus:bg-red-100">
                            <Trash2 className="mr-2 h-4 w-4" />
                            <span>{isDeleting ? 'Deleting...' : 'Delete'}</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        )}
    </div>
  );
};

export default ReviewItem;
