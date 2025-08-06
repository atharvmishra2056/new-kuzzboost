import React, { useState } from 'react';
import { Star, MoreVertical, Edit, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
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
  currentUserProfileId?: string;
}

const ReviewItem: React.FC<ReviewItemProps> = ({ 
  review, 
  onEdit, 
  onDelete, 
  currentUserProfileId 
}) => {
  const { currentUser } = useAuth();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showAllImages, setShowAllImages] = useState(false);
  const [expandedImage, setExpandedImage] = useState<string | null>(null);
  
  const isOwner = currentUser?.id === review.user_id || currentUserProfileId === review.user_id;
  
  // Extract name from email or use full_name
  const getUserDisplayName = () => {
    if (review.user?.full_name && !review.user.full_name.includes('@')) {
      return review.user.full_name;
    }
    
    // If full_name is an email, extract the name part
    if (review.user?.full_name?.includes('@')) {
      const namePart = review.user.full_name.split('@')[0];
      // Capitalize first letter and replace dots/underscores with spaces
      return namePart
        .replace(/[._]/g, ' ')
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    }
    
    return 'Anonymous User';
  };

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
        className={`w-4 h-4 ${i < review.rating ? 'text-accent-peach fill-accent-peach' : 'text-gray-400'}`}
      />
    ));
  };

  const images = review.media_urls ? (Array.isArray(review.media_urls) ? review.media_urls : []) : [];
  const displayImages = showAllImages ? images : images.slice(0, 3);

  return (
    <div className="bg-background/90 backdrop-blur-sm rounded-xl p-6 border border-white/10 shadow-lg">
      <div className="flex gap-4">
        {/* Avatar */}
        <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-primary/20 to-accent-peach/20 rounded-full flex items-center justify-center font-bold text-primary text-lg border border-white/10">
          {getUserDisplayName().charAt(0).toUpperCase()}
        </div>
        
        <div className="flex-grow">
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div>
              <h4 className="font-semibold text-primary text-lg">{getUserDisplayName()}</h4>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex items-center gap-1">
                  {renderStars()}
                </div>
                <span className="text-sm text-muted-foreground">
                  {new Date(review.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
                {review.is_verified_purchase && (
                  <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full border border-green-500/30">
                    Verified Purchase
                  </span>
                )}
              </div>
            </div>
            
            {/* Actions Menu */}
            {isOwner && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="glass border-white/10">
                  <DropdownMenuItem onSelect={() => onEdit(review)}>
                    <Edit className="mr-2 h-4 w-4" />
                    <span>Edit</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onSelect={handleDelete} 
                    disabled={isDeleting} 
                    className="text-red-400 focus:text-red-400 focus:bg-red-500/10"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    <span>{isDeleting ? 'Deleting...' : 'Delete'}</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {/* Review Content */}
          <div className="space-y-3">
            {review.title && (
              <h5 className="font-semibold text-lg text-primary">{review.title}</h5>
            )}
            
            <p className="text-muted-foreground leading-relaxed">{review.comment}</p>
            
            {/* Images */}
            {images.length > 0 && (
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-2">
                  {displayImages.map((url, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={url}
                        alt={`Review image ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg border border-white/20 cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => setExpandedImage(url)}
                      />
                      {index === 2 && images.length > 3 && !showAllImages && (
                        <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                          <span className="text-white font-semibold">+{images.length - 3}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                
                {images.length > 3 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowAllImages(!showAllImages)}
                    className="text-primary hover:text-primary/80"
                  >
                    {showAllImages ? (
                      <>
                        <ChevronUp className="w-4 h-4 mr-1" />
                        Show Less
                      </>
                    ) : (
                      <>
                        <ChevronDown className="w-4 h-4 mr-1" />
                        View All {images.length} Photos
                      </>
                    )}
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Expanded Image Modal */}
      {expandedImage && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setExpandedImage(null)}
        >
          <div className="relative max-w-4xl max-h-full">
            <img
              src={expandedImage}
              alt="Expanded review image"
              className="max-w-full max-h-full object-contain rounded-lg"
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white"
              onClick={() => setExpandedImage(null)}
            >
              ×
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewItem;