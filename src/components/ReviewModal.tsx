import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Review } from '@/types/service';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceId: number;
  onReviewSubmitted: () => Promise<void>;
  reviewToEdit?: Review | null;
}

const ReviewModal: React.FC<ReviewModalProps> = ({ isOpen, onClose, serviceId, onReviewSubmitted, reviewToEdit }) => {
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { currentUser } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (reviewToEdit) {
      setRating(reviewToEdit.rating);
      setTitle(reviewToEdit.title);
      setComment(reviewToEdit.comment);
    } else {
      setRating(5);
      setTitle('');
      setComment('');
    }
  }, [reviewToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      setError('You must be logged in to leave a review.');
      return;
    }
    setIsLoading(true);
    setError('');

    try {
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
          p_media_urls: null,
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

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="glass p-8 rounded-2xl shadow-xl w-full max-w-md border border-white/10">
        <h2 className="font-clash text-3xl font-bold text-primary mb-6">
          {reviewToEdit ? 'Edit Your Review' : 'Write a Review'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">Rating (1-5)</label>
            <input type="number" min="1" max="5" value={rating} onChange={(e) => setRating(Number(e.target.value))} required className="w-full p-3 bg-transparent border border-white/20 rounded-lg text-primary focus:ring-2 focus:ring-accent-peach focus:border-accent-peach transition"/>
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">Review Title</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required className="w-full p-3 bg-transparent border border-white/20 rounded-lg text-primary focus:ring-2 focus:ring-accent-peach focus:border-accent-peach transition"/>
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">Comment</label>
            <textarea value={comment} onChange={(e) => setComment(e.target.value)} required className="w-full p-3 bg-transparent border border-white/20 rounded-lg text-primary focus:ring-2 focus:ring-accent-peach focus:border-accent-peach transition" rows={4}></textarea>
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <div className="flex justify-end gap-4 pt-4">
            <button type="button" onClick={onClose} disabled={isLoading} className="text-muted-foreground hover:text-primary transition">
              Cancel
            </button>
            <button type="submit" disabled={isLoading} className="glass-button px-6 py-2 rounded-lg font-semibold text-primary hover:bg-primary/20 transition disabled:opacity-50">
              {isLoading ? 'Submitting...' : (reviewToEdit ? 'Update Review' : 'Submit Review')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewModal;
