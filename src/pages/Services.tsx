import { useState, useEffect } from "react";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import Cart from "../components/Cart";
import { Search, Filter, Star, ShoppingCart, ArrowRight, Calculator, TrendingUp, Sparkles } from "lucide-react";

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

const Services = () => {
  const [selectedPlatform, setSelectedPlatform] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("popular");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<any[]>([]);
  
  // Calculator state
  const [selectedCalcPlatform, setSelectedCalcPlatform] = useState(platforms[0]);
  const [selectedService, setSelectedService] = useState("Followers");
  const [quantity, setQuantity] = useState(1000);
  const [calculatedPrice, setCalculatedPrice] = useState(0);

  // Price calculation for calculator
  useEffect(() => {
    const baseRates: { [key: string]: { [key: string]: number } } = {
      "Instagram": { "Followers": 0.02, "Likes": 0.005, "Views": 0.001, "Story Views": 0.001 },
      "YouTube": { "Subscribers": 0.05, "Views": 0.001, "Likes": 0.01, "Comments": 0.15 },
      "TikTok": { "Followers": 0.015, "Likes": 0.003, "Views": 0.0005, "Shares": 0.08 },
      "Twitter": { "Followers": 0.03, "Likes": 0.008, "Retweets": 0.02, "Views": 0.0008 }
    };

    const rate = baseRates[selectedCalcPlatform.name]?.[selectedService] || 0.01;
    const price = Math.max(5.99, quantity * rate);
    setCalculatedPrice(Math.round(price * 100) / 100);
  }, [selectedCalcPlatform, selectedService, quantity]);

  const addToCart = (service: any, calcQuantity?: number) => {
    const newItem = {
      id: service.id || Date.now(),
      title: calcQuantity ? `${selectedCalcPlatform.name} ${selectedService}` : service.title,
      platform: calcQuantity ? selectedCalcPlatform.name : service.platform,
      icon: calcQuantity ? selectedCalcPlatform.icon : service.icon,
      price: calcQuantity ? calculatedPrice : service.price,
      quantity: 1,
      maxQuantity: 10
    };

    setCartItems(prev => {
      const existing = prev.find(item => item.id === newItem.id);
      if (existing) {
        return prev.map(item =>
          item.id === newItem.id
            ? { ...item, quantity: Math.min(item.maxQuantity, item.quantity + 1) }
            : item
        );
      }
      return [...prev, newItem];
    });
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

  const handleQuantityChange = (value: number) => {
    setQuantity(Math.max(100, Math.min(100000, value)));
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
      <Navigation cartItemCount={cartItems.length} onCartClick={() => setIsCartOpen(true)} />
      
      {/* Calculator Section */}
      <section className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-accent-peach/20 rounded-full px-4 py-2 mb-6">
              <Calculator className="w-4 h-4 text-accent-lavender" />
              <span className="text-sm font-medium text-primary">Service Calculator</span>
            </div>
            
            <h2 className="font-clash text-3xl md:text-4xl font-bold text-primary mb-4">
              Calculate Your Growth
            </h2>
            <p className="text-lg text-muted-foreground">
              Get instant pricing for your social media growth needs
            </p>
          </div>

          <div className="glass rounded-3xl p-6 md:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Configuration Panel */}
              <div className="space-y-6">
                {/* Platform Selection */}
                <div>
                  <label className="block text-sm font-medium text-primary mb-3">
                    Select Platform
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {platforms.slice(1, 5).map((platform) => (
                      <button
                        key={platform.name}
                        onClick={() => {
                          setSelectedCalcPlatform(platform);
                          setSelectedService("Followers");
                        }}
                        className={`p-3 rounded-xl border-2 transition-all duration-300 ${
                          selectedCalcPlatform.name === platform.name
                            ? 'border-primary bg-primary/10'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <div className="text-xl mb-1">{platform.icon}</div>
                        <div className="text-xs font-medium text-primary">
                          {platform.name}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Service Selection */}
                <div>
                  <label className="block text-sm font-medium text-primary mb-3">
                    Select Service
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {["Followers", "Likes", "Views", "Comments"].map((service) => (
                      <button
                        key={service}
                        onClick={() => setSelectedService(service)}
                        className={`p-2 rounded-lg border transition-all duration-300 text-sm font-medium ${
                          selectedService === service
                            ? 'border-primary bg-primary/10 text-primary'
                            : 'border-border hover:border-primary/50 text-muted-foreground'
                        }`}
                      >
                        {service}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quantity Slider */}
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
                  <div className="flex justify-between text-xs text-muted-foreground mt-2">
                    <span>100</span>
                    <span>25K</span>
                    <span>50K</span>
                    <span>100K</span>
                  </div>
                </div>
              </div>

              {/* Pricing Panel */}
              <div className="space-y-6">
                <div className="glass rounded-2xl p-6 text-center">
                  <div className="text-4xl mb-3">{selectedCalcPlatform.icon}</div>
                  <h3 className="font-clash text-lg font-bold text-primary mb-2">
                    {selectedCalcPlatform.name} {selectedService}
                  </h3>
                  <div className="text-3xl font-bold text-primary font-clash mb-3">
                    ${calculatedPrice}
                  </div>
                  <div className="text-sm text-muted-foreground mb-4">
                    For {quantity.toLocaleString()} {selectedService.toLowerCase()}
                  </div>
                  
                  <button 
                    onClick={() => addToCart({}, quantity)}
                    className="glass-button w-full mb-3 group"
                  >
                    <Sparkles className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform duration-300" />
                    Add to Cart
                  </button>
                  
                  <div className="text-xs text-muted-foreground">
                    ⚡ Instant delivery • 🛡️ Money-back guarantee
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Header */}
      <section className="pb-12 px-4 sm:px-6 lg:px-8">
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

          {/* Search and Filters */}
          <div className="glass rounded-2xl p-6 mb-12">
            <div className="flex flex-col lg:flex-row gap-6 items-center">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search services..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-background/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-300"
                />
              </div>

              {/* Sort */}
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="pl-10 pr-8 py-3 bg-background/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-300 appearance-none"
                >
                  <option value="popular">Most Popular</option>
                  <option value="rating">Highest Rated</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>
            </div>
          </div>

          {/* Platform Filters */}
          <div className="flex flex-wrap gap-3 justify-center mb-12">
            {platforms.map((platform) => (
              <button
                key={platform.filter}
                onClick={() => setSelectedPlatform(platform.filter)}
                className={`platform-logo flex items-center gap-2 px-4 py-3 rounded-xl border-2 transition-all duration-300 ${
                  selectedPlatform === platform.filter
                    ? 'border-primary bg-primary/10 scale-105'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <span className="text-xl">{platform.icon}</span>
                <span className="font-medium text-primary">{platform.name}</span>
              </button>
            ))}
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredServices.map((service, index) => (
                <div
                  key={service.id}
                  className="stagger-item service-card group relative"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Badge */}
                  {service.badge && (
                    <div className="absolute -top-3 -right-3 z-10">
                      <div className="glass rounded-full px-3 py-1 text-xs font-bold text-primary border border-accent-peach/50">
                        {service.badge}
                      </div>
                    </div>
                  )}

                  {/* Service Icon */}
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    {service.icon}
                  </div>

                  {/* Service Title */}
                  <h3 className="font-clash text-lg font-semibold text-primary mb-2">
                    {service.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {service.description}
                  </p>

                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-accent-peach text-accent-peach" />
                      <span className="text-sm font-medium">{service.rating}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      ({service.reviews} reviews)
                    </span>
                  </div>

                  {/* Features */}
                  <div className="space-y-1 mb-6">
                    {service.features.slice(0, 3).map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs">
                        <div className="w-1.5 h-1.5 rounded-full bg-accent-peach" />
                        <span className="text-muted-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Pricing */}
                  <div className="mt-auto">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-2xl font-bold text-primary font-clash">
                        ${service.price}
                      </span>
                      <span className="text-sm text-muted-foreground line-through">
                        ${service.originalPrice}
                      </span>
                    </div>

                    {/* Add to Cart Button */}
                    <button 
                      onClick={() => addToCart(service)}
                      className="w-full glass-button group/btn"
                    >
                      <span className="flex items-center justify-center gap-2">
                        <ShoppingCart className="w-4 h-4" />
                        Add to Cart
                        <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-300" />
                      </span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
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