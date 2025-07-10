import { useState, useEffect } from "react";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import Cart from "../components/Cart";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Search, Filter, Star, ShoppingCart, ArrowRight, Calculator, TrendingUp, Sparkles, X } from "lucide-react";

// (Keep the platforms and services arrays as they are)
const platforms = [
  { name: "All", icon: "🌟", filter: "all" },
  { name: "Instagram", icon: "📷", filter: "instagram" },
  { name: "YouTube", icon: "📺", filter: "youtube" },
  { name: "TikTok", icon: "🎵", filter: "tiktok" },
  { name: "Twitter", icon: "🐦", filter: "twitter" },
  { name: "Discord", icon: "🎮", filter: "discord" },
  { name: "Twitch", icon: "🎬", filter: "twitch" },
  { name: "Spotify", icon: "🎶", filter: "spotify" }
];

const services = [
  {
    id: 1,
    title: "Instagram Followers Premium",
    platform: "instagram",
    icon: "📷",
    price: 24.99,
    originalPrice: 34.99,
    rating: 4.9,
    reviews: 1284,
    features: ["Real Active Users", "Gradual Delivery", "30-Day Guarantee", "24/7 Support"],
    description: "High-quality, active followers from real accounts",
    badge: "Best Seller"
  },
  {
    id: 2,
    title: "YouTube Views Boost",
    platform: "youtube",
    icon: "📺",
    price: 19.99,
    originalPrice: 29.99,
    rating: 4.8,
    reviews: 892,
    features: ["High Retention", "Global Sources", "Fast Delivery", "Analytics Safe"],
    description: "Organic-looking views from diverse locations",
    badge: "Fast Delivery"
  },
  {
    id: 3,
    title: "TikTok Viral Package",
    platform: "tiktok",
    icon: "🎵",
    price: 39.99,
    originalPrice: 59.99,
    rating: 4.9,
    reviews: 756,
    features: ["Complete Package", "Viral Algorithm", "Engagement Boost", "Trending Support"],
    description: "Complete viral growth package for maximum impact",
    badge: "Premium"
  },
  {
    id: 4,
    title: "Twitter Engagement Boost",
    platform: "twitter",
    icon: "🐦",
    price: 18.99,
    originalPrice: 25.99,
    rating: 4.7,
    reviews: 634,
    features: ["Real Engagement", "Tweet Optimization", "Follower Growth", "Analytics"],
    description: "Boost your Twitter presence with real engagement",
    badge: "Popular"
  },
  {
    id: 5,
    title: "Discord Server Growth",
    platform: "discord",
    icon: "🎮",
    price: 29.99,
    originalPrice: 44.99,
    rating: 4.8,
    reviews: 445,
    features: ["Active Members", "Server Optimization", "Community Building", "Moderation"],
    description: "Grow your Discord community with active members",
    badge: "Community"
  },
  {
    id: 6,
    title: "Twitch Channel Boost",
    platform: "twitch",
    icon: "🎬",
    price: 35.99,
    originalPrice: 49.99,
    rating: 4.9,
    reviews: 323,
    features: ["Live Viewers", "Follower Growth", "Chat Engagement", "Stream Optimization"],
    description: "Boost your Twitch channel with real viewers",
    badge: "Streamer Choice"
  },
  {
    id: 7,
    title: "Spotify Plays & Followers",
    platform: "spotify",
    icon: "🎶",
    price: 22.99,
    originalPrice: 32.99,
    rating: 4.8,
    reviews: 567,
    features: ["Real Plays", "Playlist Placement", "Artist Growth", "Royalty Safe"],
    description: "Grow your Spotify presence with real plays",
    badge: "Artist Approved"
  },
  {
    id: 8,
    title: "Instagram Stories Views",
    platform: "instagram",
    icon: "📷",
    price: 15.99,
    originalPrice: 22.99,
    rating: 4.7,
    reviews: 789,
    features: ["Story Engagement", "Real Views", "Quick Delivery", "Safe Method"],
    description: "Boost your Instagram stories visibility",
    badge: "Quick Start"
  }
];


const ServiceCalculatorModal = ({ service, onAddToCart }: any) => {
  const [quantity, setQuantity] = useState(1000);
  const [price, setPrice] = useState(0);

  useEffect(() => {
    // A more dynamic pricing model
    const baseRate = service.price / 1000; // Assuming the base price is for 1000 units
    const calculatedPrice = Math.max(5.99, quantity * baseRate);
    setPrice(Math.round(calculatedPrice * 100) / 100);
  }, [quantity, service]);

  const handleQuantityChange = (value: number) => {
    setQuantity(Math.max(100, Math.min(100000, value)));
  };

  return (
    <DialogContent className="glass">
      <DialogHeader>
        <DialogTitle className="font-clash text-2xl text-primary flex items-center gap-2">
          <span className="text-3xl">{service.icon}</span>
          {service.title}
        </DialogTitle>
      </DialogHeader>
      <div className="space-y-6 pt-4">
        <div>
          <label className="block text-sm font-medium text-primary mb-3">
            Quantity: {quantity.toLocaleString()}
          </label>
          <input
            type="range"
            min="100"
            max="100000"
            step="100"
            value={quantity}
            onChange={(e) => handleQuantityChange(parseInt(e.target.value))}
            className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer slider"
          />
        </div>
        <div className="text-center">
          <p className="text-muted-foreground">Total Price</p>
          <p className="text-4xl font-bold font-clash text-primary">${price.toFixed(2)}</p>
        </div>
        <button
          onClick={() => onAddToCart(service, quantity, price)}
          className="w-full glass-button group"
        >
          <Sparkles className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform duration-300" />
          Add to Cart
        </button>
      </div>
    </DialogContent>
  );
};


const Services = () => {
  const [selectedPlatform, setSelectedPlatform] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("popular");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [selectedServiceForCalc, setSelectedServiceForCalc] = useState<any | null>(null);

  const addToCart = (service: any, quantity: number, price: number) => {
    const newItem = {
      id: service.id,
      title: service.title,
      platform: service.platform,
      icon: service.icon,
      price: price,
      quantity: quantity,
      maxQuantity: 1
    };
    
    setCartItems(prev => {
      const existing = prev.find(item => item.id === newItem.id);
      if (existing) {
        return prev.map(item =>
          item.id === newItem.id
            ? { ...item, quantity: item.quantity + newItem.quantity, price: item.price + newItem.price }
            : item
        );
      }
      return [...prev, newItem];
    });
    
    setSelectedServiceForCalc(null); // Close the modal
    setIsCartOpen(true);
  };

  const updateQuantity = (id: number, newQuantity: number) => {
    setCartItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeItem = (id: number) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const filteredServices = services
    .filter(service => 
      (selectedPlatform === "all" || service.platform === selectedPlatform) &&
      service.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "rating":
          return b.rating - a.rating;
        default:
          return b.reviews - a.reviews;
      }
    });

  return (
    <div className="min-h-screen bg-gradient-hero">
      <Navigation cartItemCount={cartItems.reduce((acc, item) => acc + item.quantity, 0)} onCartClick={() => setIsCartOpen(true)} />
      
      {/* Header */}
      <section className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="font-clash text-5xl md:text-7xl font-bold text-primary mb-6">
              Our Services
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Premium social media growth services designed to elevate your online presence. 
              Choose from our comprehensive selection of professional solutions.
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {filteredServices.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="font-clash text-2xl font-bold text-primary mb-2">
                No services found
              </h3>
              <p className="text-muted-foreground">
                Try adjusting your search or filter criteria
              </p>
            </div>
          ) : (
             <Dialog>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredServices.map((service, index) => (
                  <DialogTrigger asChild key={service.id}>
                    <div
                      onClick={() => setSelectedServiceForCalc(service)}
                      className="stagger-item service-card group relative cursor-pointer"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      {/* ... service card content remains the same */}
                      <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                        {service.icon}
                      </div>
                      <h3 className="font-clash text-lg font-semibold text-primary mb-2">
                        {service.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {service.description}
                      </p>
                      <div className="flex items-center gap-2 mb-4">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-accent-peach text-accent-peach" />
                          <span className="text-sm font-medium">{service.rating}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          ({service.reviews} reviews)
                        </span>
                      </div>
                      <div className="mt-auto">
                        <div className="flex items-center gap-2 mb-4">
                          <span className="text-2xl font-bold text-primary font-clash">
                            ${service.price}
                          </span>
                          <span className="text-sm text-muted-foreground line-through">
                            ${service.originalPrice}
                          </span>
                        </div>
                         <button className="w-full glass-button group/btn">
                          <span className="flex items-center justify-center gap-2">
                            <Calculator className="w-4 h-4" />
                            Customize
                          </span>
                        </button>
                      </div>
                    </div>
                  </DialogTrigger>
                ))}
              </div>
               {selectedServiceForCalc && (
                <ServiceCalculatorModal service={selectedServiceForCalc} onAddToCart={addToCart} />
              )}
            </Dialog>
          )}
        </div>
      </section>

      <Footer />
      
      <Cart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeItem}
        onClearCart={clearCart}
      />
    </div>
  );
};

export default Services;
