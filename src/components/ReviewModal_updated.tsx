import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Review } from '@/types/service';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Star, Upload, X, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceId: number;
  onReviewSubmitted: () => Promise<void>;
  reviewToEdit?: Review | null;
}

const ReviewModal: React.FC<ReviewModalProps> = ({ 
  isOpen, 
  onClose, 
  serviceId, 
  onReviewSubmitted, 
  reviewToEdit 
}) => {
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const { currentUser } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (reviewToEdit) {
      setRating(reviewToEdit.rating);
      setTitle(reviewToEdit.title || '');
      setComment(reviewToEdit.comment || '');
      setUploadedImages(reviewToEdit.media_urls ? JSON.parse(JSON.stringify(reviewToEdit.media_urls)) : []);
    } else {
      setRating(5);
      setTitle('');
      setComment('');
      setUploadedImages([]);
    }
  }, [reviewToEdit, isOpen]);

  if (!isOpen) return null;

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const newImageUrls: string[] = [];

    try {
      for (const file of Array.from(files)) {
        if (file.size > 5 * 1024 * 1024) { // 5MB limit
          toast({ variant: 'destructive', title: 'Error', description: 'Image size must be less than 5MB' });
          continue;
        }

        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `review-images/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('review-images')
          .upload(filePath, file);

        if (uploadError) {
          console.error('Upload error:', uploadError);
          continue;
        }

        const { data: { publicUrl } } = supabase.storage
          .from('review-images')
          .getPublicUrl(filePath);

        newImageUrls.push(publicUrl);
      }

      setUploadedImages(prev => [...prev, ...newImageUrls]);
    } catch (error) {
      console.error('Error uploading images:', error);
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to upload images' });
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (indexToRemove: number) => {
    setUploadedImages(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      setError('You must be logged in to leave a review.');
      return;
    }
    setIsLoading(true);
    setError('');

    try {
      const mediaUrls = uploadedImages.length > 0 ? uploadedImages : null;

      if (reviewToEdit) {
        // Update existing review
        const { error: rpcError } = await (supabase.rpc as any)('update_review', {
          p_review_id: reviewToEdit.id,
          p_rating: rating,
          p_title: title,
          p_comment: comment,
        });

        if (rpcError) throw rpcError;
        toast({ title: 'Success', description: 'Your review has been updated.' });
      } else {
        // Submit new review
        const { error: rpcError } = await supabase.rpc('submit_review', {
          p_service_id: serviceId,
          p_rating: rating,
          p_title: title,
          p_comment: comment,
          p_media_urls: mediaUrls,
        });

        if (rpcError) throw rpcError;
        toast({ title: 'Success', description: 'Thank you for your review!' });
      }
      await onReviewSubmitted();
      onClose();
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
      toast({ variant: 'destructive', title: 'Error', description: err.message });
    } finally {
      setIsLoading(false);
    }
  };

  const renderStars = () => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-8 h-8 cursor-pointer transition-colors ${
          i < rating ? 'text-accent-peach fill-accent-peach' : 'text-gray-400 hover:text-accent-peach'
        }`}
        onClick={() => setRating(i + 1)}
      />
    ));
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="glass p-8 rounded-2xl shadow-xl w-full max-w-2xl border border-white/10 max-h-[90vh] overflow-y-auto">
        <h2 className="font-clash text-3xl font-bold text-primary mb-6">
          {reviewToEdit ? 'Edit Your Review' : 'Write a Review'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Rating */}
          <div>
            <Label className="text-base font-medium text-muted-foreground mb-3 block">
              Rating
            </Label>
            <div className="flex gap-1">
              {renderStars()}
            </div>
          </div>

          {/* Title */}
          <div>
            <Label htmlFor="title" className="text-base font-medium text-muted-foreground mb-2 block">
              Review Title
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Summarize your experience"
              required
              className="bg-transparent border-white/20 focus:border-accent-peach"
            />
          </div>

          {/* Comment */}
          <div>
            <Label htmlFor="comment" className="text-base font-medium text-muted-foreground mb-2 block">
              Your Review
            </Label>
            <Textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Tell others about your experience with this service"
              required
              rows={4}
              className="bg-transparent border-white/20 focus:border-accent-peach resize-none"
            />
          </div>

          {/* Image Upload */}
          <div>
            <Label className="text-base font-medium text-muted-foreground mb-2 block">
              Add Photos (Optional)
            </Label>
            <div className="space-y-4">
              {/* Upload Button */}
              <div className="flex items-center gap-4">
                <label className="cursor-pointer">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={uploading || uploadedImages.length >= 5}
                  />
                  <div className="flex items-center gap-2 px-4 py-2 border border-white/20 rounded-lg hover:border-accent-peach transition-colors">
                    {uploading ? (
                      <div className="w-4 h-4 border-2 border-accent-peach border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Upload className="w-4 h-4" />
                    )}
                    <span className="text-sm">
                      {uploading ? 'Uploading...' : 'Add Photos'}
                    </span>
                  </div>
                </label>
                <span className="text-xs text-muted-foreground">
                  Max 5 photos, 5MB each
                </span>
              </div>

              {/* Image Preview */}
              {uploadedImages.length > 0 && (
                <div className="grid grid-cols-3 gap-3">
                  {uploadedImages.map((url, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={url}
                        alt={`Review image ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg border border-white/20"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              disabled={isLoading}
              className="text-muted-foreground hover:text-primary"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || uploading}
              className="glass-button px-6 py-2 font-semibold text-primary hover:bg-primary/20 transition disabled:opacity-50"
            >
              {isLoading ? 'Submitting...' : (reviewToEdit ? 'Update Review' : 'Submit Review')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewModal;