import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, ShoppingCart, Trash2, ArrowRight } from "lucide-react";
import { useWishlist } from "@/hooks/useWishlist";
import { useCurrency } from "@/context/CurrencyContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
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
  const { getSymbol, convert } = useCurrency();
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<any[]>([]);

  const addToCart = (item: any) => {
    setCartItems(prev => [...prev, { ...item, quantity: 1, price: item.basePrice }]);
    removeFromWishlist(item.id);
  };

  if (wishlistItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-hero">
        <Navigation cartItemCount={cartItems.length} />
        <div className="pt-20 pb-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="glass rounded-2xl p-12">
              <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-6" />
              <h1 className="font-clash text-3xl font-bold text-primary mb-4">
                Your Wishlist is Empty
              </h1>
              <p className="text-muted-foreground mb-8">
                Start browsing our services and save your favorites for later!
              </p>
              <Button 
                onClick={() => navigate('/services')}
                className="glass-button"
              >
                Browse Services
              </Button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-hero">
      <Navigation cartItemCount={cartItems.length} />
      
      <div className="pt-20 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-clash text-3xl font-bold text-primary mb-2">
                Your Wishlist
              </h1>
              <p className="text-muted-foreground">
                {wishlistItems.length} saved {wishlistItems.length === 1 ? 'service' : 'services'}
              </p>
            </div>
            
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={clearWishlist}
                className="flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Clear All
              </Button>
            </div>
          </div>

          {/* Wishlist Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlistItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass rounded-xl p-6 hover:scale-105 transition-all duration-300 group"
              >
                <div className="flex items-start justify-between mb-4">
                  <Badge className="bg-accent-peach/20 text-accent-peach border-accent-peach/30">
                    {item.badge}
                  </Badge>
                  <button
                    onClick={() => removeFromWishlist(item.id)}
                    className="p-1 rounded-full hover:bg-red-500/20 transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                </div>

                <div className="mb-4 text-center">
                  {iconMap[item.iconName] || <div className="w-16 h-16 bg-accent-peach/20 rounded-full flex items-center justify-center text-accent-peach font-bold">{item.platform.charAt(0)}</div>}
                </div>

                <h3 className="font-clash text-lg font-semibold text-primary mb-2">
                  {item.title}
                </h3>

                <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                  {item.description}
                </p>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-medium text-accent-peach">
                      ⭐ {item.rating}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      ({item.reviews})
                    </span>
                  </div>
                  <span className="text-lg font-bold text-primary">
                    {getSymbol()}{convert(item.basePrice)}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/service/${item.id}`)}
                    className="flex items-center gap-1"
                  >
                    <ArrowRight className="w-3 h-3" />
                    View
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => addToCart(item)}
                    className="glass-button flex items-center gap-1"
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

      <Footer />
    </div>
  );
};

export default Wishlist;