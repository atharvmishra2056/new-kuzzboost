import React, { useState } from 'react';
import { Star, MoreVertical, Edit, Trash2, ChevronDown, ChevronUp, User } from 'lucide-react';
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
  
  const isOwner = currentUserProfileId === review.user_id;
  
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

  const renderStars = (size: 'sm' | 'md' = 'sm') => {
    const starSize = size === 'md' ? 'w-5 h-5' : 'w-4 h-4';
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`${starSize} ${i < review.rating ? 'text-orange-400 fill-orange-400' : 'text-gray-300'}`}
      />
    ));
  };

  const images = review.media_urls ? (Array.isArray(review.media_urls) ? review.media_urls : []) : [];
  const displayImages = showAllImages ? images : images.slice(0, 5);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="border-b border-gray-200 py-6 last:border-b-0">
      <div className="flex gap-4">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
            <User className="w-6 h-6 text-gray-500" />
          </div>
        </div>
        
        <div className="flex-grow min-w-0">
          {/* Header */}
          <div className="flex items-start justify-between mb-2">
            <div className="flex-grow">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-medium text-gray-900 text-sm">{getUserDisplayName()}</h4>
                {isOwner && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-6 w-6 text-gray-400 hover:text-gray-600">
                        <MoreVertical className="h-3 w-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-32">
                      <DropdownMenuItem onSelect={() => onEdit(review)} className="text-sm">
                        <Edit className="mr-2 h-3 w-3" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onSelect={handleDelete} 
                        disabled={isDeleting} 
                        className="text-sm text-red-600 focus:text-red-600"
                      >
                        <Trash2 className="mr-2 h-3 w-3" />
                        {isDeleting ? 'Deleting...' : 'Delete'}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
              
              {/* Rating and Date */}
              <div className="flex items-center gap-3 mb-2">
                <div className="flex items-center gap-1">
                  {renderStars()}
                </div>
                {review.is_verified_purchase && (
                  <span className="text-xs text-orange-600 font-medium">Verified Purchase</span>
                )}
              </div>
              
              <div className="text-xs text-gray-500 mb-3">
                Reviewed in India on {formatDate(review.created_at)}
              </div>
            </div>
          </div>

          {/* Review Content */}
          <div className="space-y-3">
            {/* Title */}
            {review.title && (
              <h5 className="font-semibold text-gray-900 text-base leading-tight">
                {review.title}
              </h5>
            )}
            
            {/* Comment */}
            <div className="text-gray-700 text-sm leading-relaxed">
              {review.comment}
            </div>
            
            {/* Images */}
            <div className="space-y-3 mt-4">
              {images.length === 0 ? (
                <div className="w-full border border-dashed border-gray-300 rounded-md p-4 text-center text-xs text-gray-500">
                  No images yet
                </div>
              ) : (
                <>
                  <div className="flex gap-2 flex-wrap">
                    {displayImages.map((url, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={url}
                          alt={`Customer image ${index + 1}`}
                          className="w-20 h-20 object-cover rounded border border-gray-200 cursor-pointer hover:opacity-90 transition-opacity"
                          onClick={() => setExpandedImage(url)}
                        />
                        {index === 4 && images.length > 5 && !showAllImages && (
                          <div className="absolute inset-0 bg-black/60 rounded flex items-center justify-center">
                            <span className="text-white text-xs font-medium">+{images.length - 5}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  {images.length > 5 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowAllImages(!showAllImages)}
                      className="text-blue-600 hover:text-blue-700 text-sm p-0 h-auto font-normal"
                    >
                      {showAllImages ? (
                        <>Show fewer images</>
                      ) : (
                        <>See all {images.length} images</>
                      )}
                    </Button>
                  )}
                </>
              )}
            </div>

            {/* Helpful section */}
            <div className="flex items-center gap-4 mt-4 pt-3 border-t border-gray-100">
              <span className="text-xs text-gray-500">Was this review helpful to you?</span>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="text-xs px-3 py-1 h-7">
                  Helpful
                </Button>
                <Button variant="outline" size="sm" className="text-xs px-3 py-1 h-7">
                  Report
                </Button>
              </div>
            </div>
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
