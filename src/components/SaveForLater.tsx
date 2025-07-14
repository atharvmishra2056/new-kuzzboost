import { useState } from "react";
import { Bookmark, BookmarkCheck, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useWishlist } from "@/hooks/useWishlist";
import { Service } from "@/types/service";
import { useToast } from "@/hooks/use-toast";

interface SaveForLaterProps {
  service: Service;
  className?: string;
}

const SaveForLater = ({ service, className = "" }: SaveForLaterProps) => {
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { toast } = useToast();
  const [isAnimating, setIsAnimating] = useState(false);
  
  const saved = isInWishlist(service.id);

  const handleToggleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 300);

    if (saved) {
      removeFromWishlist(service.id);
      toast({
        title: "Removed from Saved",
        description: `${service.title} removed from your saved items`,
      });
    } else {
      const wishlistItem = {
        ...service,
        basePrice: service.tiers?.[0]?.price || 0
      };
      const success = addToWishlist(wishlistItem);
      if (success) {
        toast({
          title: "Saved for Later",
          description: `${service.title} saved to your wishlist`,
        });
      } else {
        toast({
          title: "Already Saved",
          description: "This service is already in your wishlist",
          variant: "destructive"
        });
      }
    }
  };

  return (
    <motion.button
      onClick={handleToggleSave}
      className={`relative p-2 rounded-full glass hover:bg-accent-peach/20 transition-all duration-200 group ${className}`}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      <AnimatePresence mode="wait">
        {saved ? (
          <motion.div
            key="saved"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            transition={{ duration: 0.3 }}
            className="text-accent-peach"
          >
            <BookmarkCheck className="w-5 h-5" />
          </motion.div>
        ) : (
          <motion.div
            key="unsaved"
            initial={{ scale: 0, rotate: 180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: -180 }}
            transition={{ duration: 0.3 }}
            className="text-muted-foreground group-hover:text-accent-peach"
          >
            <Bookmark className="w-5 h-5" />
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Tooltip */}
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-foreground text-background text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
        {saved ? 'Remove from Saved' : 'Save for Later'}
      </div>
    </motion.button>
  );
};

export default SaveForLater;