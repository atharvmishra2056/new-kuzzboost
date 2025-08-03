import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, ShoppingCart, Trash2, ArrowRight } from "lucide-react";
import { useWishlist } from "@/hooks/useWishlist";
import { useCart } from "@/context/CartContext";
import { useCurrency } from "@/context/CurrencyContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SiInstagram, SiYoutube, SiX, SiDiscord, SiTwitch, SiSpotify, SiWhatsapp, SiSnapchat } from 'react-icons/si';
import { motion } from "framer-motion";

// Icon mapping to recreate icons from iconName
const iconMap: { [key: string]: React.ReactElement } = {
  SiInstagram: <SiInstagram className="text-4xl text-[#E4405F]" />,
  SiYoutube: <SiYoutube className="text-4xl text-[#FF0000]" />,
  SiX: <SiX className="text-4xl text-[#000000]" />,
  SiDiscord: <SiDiscord className="text-4xl text-[#7289DA]" />,
  SiTwitch: <SiTwitch className="text-4xl text-[#9146FF]" />,
  SiSpotify: <SiSpotify className="text-4xl text-[#1DB954]" />,
  SiWhatsapp: <SiWhatsapp className="text-4xl text-[#25D366]" />,
  SiSnapchat: <SiSnapchat className="text-4xl text-[#FFFC00]" />,
};

const Wishlist = () => {
  const { wishlistItems, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart: addServiceToCart } = useCart();
  const { getSymbol, convert } = useCurrency();
  const navigate = useNavigate();

  const handleAddToCart = (item: any) => {
    // Find the lowest priced tier to add to cart by default from wishlist
    if (!item.tiers || item.tiers.length === 0) {
      console.error("Service has no pricing tiers.");
      // Optionally, show a toast notification to the user
      return;
    }

    const lowestPriceTier = item.tiers.reduce((lowest: any, current: any) => {
      return current.price < lowest.price ? current : lowest;
    }, item.tiers[0]);

    addServiceToCart(item, lowestPriceTier.quantity, lowestPriceTier.price, '');
    removeFromWishlist(item.id);
  };

  if (wishlistItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-hero">
        <div className="pt-16 pb-8 px-4 sm:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="glass rounded-2xl p-8">
              <Heart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h1 className="font-clash text-2xl font-bold text-primary mb-3">
                Your Wishlist is Empty
              </h1>
              <p className="text-muted-foreground mb-6">
                Start browsing our services and save your favorites for later!
              </p>
              <Button 
                onClick={() => navigate('/dashboard/services')}
                className="glass-button py-2 px-4 text-base"
              >
                Browse Services
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-hero">
      
      <div className="pt-20 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="font-clash text-2xl font-bold text-primary mb-2">
                Your Wishlist
              </h1>
              <p className="text-muted-foreground text-sm">
                {wishlistItems.length} saved {wishlistItems.length === 1 ? 'service' : 'services'}
              </p>
            </div>
            
            <div className="flex gap-2">
              <Button 
                onClick={() => navigate('/dashboard/services')}
                className="glass-button py-2 px-3 text-sm"
              >
                Continue Shopping
              </Button>
              <Button 
                variant="outline" 
                onClick={clearWishlist}
                className="flex items-center gap-2 py-2 px-3 text-sm"
              >
                <Trash2 className="w-4 h-4" />
                Clear All
              </Button>
            </div>
          </div>

          {/* Wishlist Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {wishlistItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass rounded-xl p-4 hover:scale-105 transition-all duration-300 group"
              >
                <div className="flex items-start justify-between mb-3">
                  <Badge className="bg-accent-peach/20 text-accent-peach border-accent-peach/30 text-xs">
                    {item.badge}
                  </Badge>
                  <button
                    onClick={() => removeFromWishlist(item.id)}
                    className="p-1 rounded-full hover:bg-red-500/20 transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                </div>

                <div className="mb-3 text-center">
                  {iconMap[item.iconName] || <div className="w-12 h-12 bg-accent-peach/20 rounded-full flex items-center justify-center text-accent-peach font-bold text-lg">{item.platform.charAt(0)}</div>}
                </div>

                <h3 className="font-clash text-base font-semibold text-primary mb-2">
                  {item.title}
                </h3>

                <p className="text-muted-foreground text-xs mb-3 line-clamp-2">
                  {item.description}
                </p>

                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-medium text-accent-peach">
                      ⭐ {item.rating}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      ({item.reviews})
                    </span>
                  </div>
                          <span className="text-base font-bold text-primary">
                            From {getSymbol()}100
                          </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/dashboard/service/${item.id}`)}
                    className="flex items-center gap-1 py-2 text-xs"
                  >
                    <ArrowRight className="w-3 h-3" />
                    View
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleAddToCart(item)}
                    className="glass-button flex items-center gap-1 py-2 text-xs"
                  >
                    <ShoppingCart className="w-3 h-3" />
                    Add to Cart
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Wishlist;