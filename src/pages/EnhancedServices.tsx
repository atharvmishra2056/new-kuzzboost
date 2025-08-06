import { useEffect, useState } from "react";
import { motion, Variants } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { useServices } from "@/components/Services";
import { Badge } from "@/components/ui/badge";
import { useCurrency } from "../context/CurrencyContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { SiInstagram, SiYoutube, SiDiscord, SiTwitch, SiSpotify, SiWhatsapp, SiSnapchat, SiX } from "react-icons/si";
import { Star, ShoppingCart, Heart } from "lucide-react";
import ServiceFAQ from "@/components/ServiceFAQ";
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

const iconMap = {
  SiInstagram: <SiInstagram className="w-8 h-8 text-[#E4405F]" />,
  SiYoutube: <SiYoutube className="w-8 h-8 text-[#FF0000]" />,
  SiX: <SiX className="w-8 h-8 text-[#000000]" />,
  SiDiscord: <SiDiscord className="w-8 h-8 text-[#7289DA]" />,
  SiTwitch: <SiTwitch className="w-8 h-8 text-[#9146FF]" />,
  SiSpotify: <SiSpotify className="w-8 h-8 text-[#1DB954]" />,
  SiWhatsapp: <SiWhatsapp className="w-8 h-8 text-[#25D366]" />,
  SiSnapchat: <SiSnapchat className="w-8 h-8 text-[#FFFC00]" />,
};

const Services = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { services, loading } = useServices();
  const { getSymbol, convert } = useCurrency();
  const [selectedService, setSelectedService] = useState(null);
  const [quantity, setQuantity] = useState(100);
  const [userInput, setUserInput] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [validationError, setValidationError] = useState("");

  // Fetch review statistics for all services
  const { data: reviewStats } = useQuery({
    queryKey: ['allServicesReviewStats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('reviews')
        .select('service_id, rating');
        
      if (error) {
        console.error('Error fetching review stats:', error);
        return {};
      }
      
      if (!data || data.length === 0) {
        return {};
      }
      
      const serviceStats: { [serviceId: number]: { averageRating: number; totalReviews: number } } = {};
      
      // Group reviews by service_id
      const reviewsByService = data.reduce((acc, review) => {
        if (!acc[review.service_id]) {
          acc[review.service_id] = [];
        }
        acc[review.service_id].push(review);
        return acc;
      }, {} as { [serviceId: number]: any[] });
      
      // Calculate stats for each service
      Object.entries(reviewsByService).forEach(([serviceId, reviews]) => {
        const totalReviews = reviews.length;
        const averageRating = reviews.reduce((acc, review) => acc + review.rating, 0) / totalReviews;
        
        serviceStats[parseInt(serviceId)] = {
          averageRating: Number(averageRating.toFixed(1)),
          totalReviews
        };
      });
      
      return serviceStats;
    },
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (currentUser) {
      navigate('/dashboard');
    }
  }, [currentUser, navigate]);

  if (loading) {
    return <div className="text-center py-20 text-lg font-semibold">Loading Services...</div>;
  }

  const allServices = services
    .map(service => ({
      ...service,
      // Use real review stats if available, otherwise fall back to service.rating
      rating: reviewStats?.[service.id]?.averageRating || service.rating || 0,
      reviews: reviewStats?.[service.id]?.totalReviews || service.reviews || 0
    }))
    .sort((a, b) => b.reviews - a.reviews);

  const listVariants: Variants = { visible: { transition: { staggerChildren: 0.1 } } };
  const itemVariants: Variants = { hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } };

  const handleServiceClick = (service) => {
    setSelectedService(service);
    if (service.tiers && service.tiers.length > 0) {
      setQuantity(service.tiers[0].quantity);
    } else {
      setQuantity(100);
    }
    setUserInput("");
    setTermsAccepted(false);
    setValidationError("");
  };

  const calculatePrice = (qty) => {
    if (!selectedService?.tiers || selectedService.tiers.length === 0) return 0;
    
    const sortedTiers = [...selectedService.tiers].sort((a, b) => a.quantity - b.quantity);
    
    if (qty <= sortedTiers[0].quantity) {
      return qty * (sortedTiers[0].price / sortedTiers[0].quantity);
    }
    
    if (qty >= sortedTiers[sortedTiers.length - 1].quantity) {
      const lastTier = sortedTiers[sortedTiers.length - 1];
      return qty * (lastTier.price / lastTier.quantity);
    }
    
    for (let i = 0; i < sortedTiers.length - 1; i++) {
      if (qty >= sortedTiers[i].quantity && qty <= sortedTiers[i + 1].quantity) {
        const lower = sortedTiers[i];
        const upper = sortedTiers[i + 1];
        const ratio = (qty - lower.quantity) / (upper.quantity - lower.quantity);
        return lower.price + ratio * (upper.price - lower.price);
      }
    }
    
    return sortedTiers[0].price;
  };

  const presetQuantities = [100, 1000, 5000, 10000, 50000, 100000];

  const validateInput = (input) => {
    if (!input.trim()) {
      setValidationError("This field is required");
      return false;
    }
    if (selectedService?.platform === "instagram" && !input.startsWith("@") && !input.includes("instagram.com")) {
      setValidationError("Please enter a valid Instagram username (@username) or post URL");
      return false;
    }
    if (selectedService?.platform === "youtube" && !input.includes("youtube.com") && !input.includes("youtu.be")) {
      setValidationError("Please enter a valid YouTube URL");
      return false;
    }
    setValidationError("");
    return true;
  };

  const handleAddToCart = () => {
    if (!validateInput(userInput) || !termsAccepted) {
      if (!termsAccepted) setValidationError("Please accept the terms and conditions");
      return;
    }
    const { icon, ...restOfService } = selectedService;
    navigate('/auth', {
      state: {
        returnTo: '/dashboard/cart',
        action: 'addToCart',
        service: restOfService,
        quantity,
        price: finalPrice,
        userInput,
      },
    });
  };

  const handleSaveForLater = () => {
    if (!validateInput(userInput)) {
      return;
    }
    const { icon, ...restOfService } = selectedService;
    navigate('/auth', {
      state: {
        returnTo: '/dashboard/wishlist',
        action: 'saveForLater',
        service: restOfService,
      },
    });
  };

  const finalPrice = selectedService ? calculatePrice(quantity) : 0;

  // Determine service type for FAQ based on selected service
  const getServiceType = (serviceTitle: string): string => {
    const serviceMap: Record<string, string> = {
      'instagram': 'instagram-followers',
      'youtube': 'youtube-views',
      'spotify': 'spotify-playlist',
      'default': 'instagram-followers'
    };

    const serviceKey = serviceTitle.toLowerCase();
    for (const [key, value] of Object.entries(serviceMap)) {
      if (serviceKey.includes(key)) {
        return value;
      }
    }
    return serviceMap['default'];
  };

  const serviceType = selectedService ? getServiceType(selectedService.title) : 'instagram-followers';
  const serviceName = selectedService?.title || 'Our Services';

  return (
    <div className="min-h-screen bg-gradient-hero overflow-hidden pt-24 md:pt-20">
      {/* Sign-in prompt at the top */}
      <div className="bg-primary/10 border-b border-primary/20 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-primary font-medium">
            Sign in or create an account to place orders, save services to your wishlist, and track your purchases
          </p>
          {/* Show buttons only on mobile */}
          <div className="mt-3 flex justify-center gap-4 md:hidden">
            <Link to="/auth" className="glass-button text-sm px-4 py-2">
              Sign In
            </Link>
            <Link to="/auth?tab=signup" className="glass-button text-sm px-4 py-2">
              Create Account
            </Link>
          </div>
        </div>
      </div>
      
      <section className="pt-12 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="font-clash text-5xl md:text-7xl font-bold text-primary mb-6">Our Services</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">Premium social media growth services to elevate your online presence.</p>
          </div>
        </div>
      </section>
      <section className="pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" initial="hidden" animate="visible" variants={listVariants}>
            {allServices.map((service) => (
              <motion.div
                key={service.id}
                className="service-card group relative cursor-pointer h-full"
                variants={itemVariants}
                onClick={() => handleServiceClick(service)}
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <div className="service-card-inner absolute inset-0 rounded-3xl overflow-hidden border border-white/10 transition-all duration-500 flex flex-col p-6 bg-gradient-to-br from-background/80 to-accent/20">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-sm">
                      {service.icon}
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 mb-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{service.rating.toFixed(1)}</span>
                        <span className="text-xs text-muted-foreground">({service.reviews})</span>
                      </div>
                      <Badge className="bg-accent-peach/90 text-white">{service.badge}</Badge>
                    </div>
                  </div>
                  <h3 className="font-clash text-xl font-semibold text-primary mb-2 line-clamp-2">
                    {service.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {service.description}
                  </p>
                  {service.tiers && service.tiers.length > 0 && (
                    <div className="mt-auto pt-4 border-t border-border/20">
                      <div className="flex items-baseline justify-center gap-2">
                        <span className="text-lg font-bold text-primary font-clash">
                          Starting from {getSymbol()}{convert(service.tiers[0].price)}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Service Detail Modal */}
      <Dialog open={!!selectedService} onOpenChange={(open) => !open && setSelectedService(null)}>
        <DialogContent className="glass max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedService && (
            <>
              <DialogHeader>
                <DialogTitle className="font-clash text-2xl text-primary flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-white/10">
                    {iconMap[selectedService.iconName] || iconMap.SiInstagram}
                  </div>
                  {selectedService.title}
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-6 py-4">
                <p className="text-muted-foreground">{selectedService.description}</p>
                
                {/* User Input */}
                <div className="space-y-2">
                  <Label htmlFor="userInput" className="text-sm font-medium">
                    {selectedService.platform === "instagram" ? "Instagram Username or Post URL" : "Profile URL or Username"}
                  </Label>
                  <Input 
                    id="userInput" 
                    value={userInput} 
                    onChange={(e) => { setUserInput(e.target.value); setValidationError(""); }} 
                    placeholder={selectedService.platform === "instagram" ? "@username or https://..." : "Enter URL or username"} 
                    className={validationError ? "border-red-500" : ""} 
                  />
                  {validationError && <p className="text-red-500 text-sm">{validationError}</p>}
                </div>
                
                {/* Quantity Selection with Slider */}
                <div className="space-y-4">
                  <Label className="text-sm font-medium">Quantity: {quantity.toLocaleString()}</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {presetQuantities.map((preset) => (
                      <Button 
                        key={preset} 
                        variant={quantity === preset ? "default" : "outline"} 
                        size="sm" 
                        onClick={() => setQuantity(preset)} 
                        className="text-xs"
                      >
                        {preset >= 1000 ? `${preset / 1000}K` : preset}
                      </Button>
                    ))}
                  </div>
                  <Slider 
                    value={[quantity]} 
                    onValueChange={(value) => setQuantity(value[0])} 
                    max={1000000} 
                    min={10} 
                    step={10} 
                    className="w-full" 
                  />
                  <Input 
                    type="number" 
                    value={quantity} 
                    onChange={(e) => setQuantity(Number(e.target.value) || 10)} 
                    min={10} 
                    max={1000000} 
                    placeholder="Enter custom quantity" 
                  />
                </div>
                
                {/* Price Display */}
                <div className="glass rounded-xl p-4 text-center">
                  <p className="text-muted-foreground mb-1">Total Price</p>
                  <p className="text-2xl font-bold font-clash text-primary">{getSymbol()}{convert(finalPrice)}</p>
                  <p className="text-xs text-muted-foreground mt-1">{getSymbol()}{finalPrice > 0 ? (finalPrice / quantity).toFixed(4) : '0.0000'} per unit</p>
                </div>
                
                {/* Terms Checkbox */}
                <div className="flex items-start space-x-3">
                  <Checkbox 
                    id="terms" 
                    checked={termsAccepted} 
                    onCheckedChange={(checked) => setTermsAccepted(checked as boolean)} 
                  />
                  <label htmlFor="terms" className="text-sm text-muted-foreground">
                    I agree to the terms and conditions and understand the delivery process
                  </label>
                </div>
                
                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <Button 
                    className="flex-1 glass-button"
                    onClick={handleAddToCart}
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Add to Cart - {getSymbol()}{convert(finalPrice)}
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex-1 border-primary/50 text-primary hover:bg-primary/10"
                    onClick={handleSaveForLater}
                  >
                    <Heart className="w-4 h-4 mr-2" />
                    Save for Later
                  </Button>
                </div>
                
                {/* Auth Prompt */}
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 text-center">
                  <p className="text-primary font-medium mb-2">Sign in to place your order</p>
                  <p className="text-sm text-muted-foreground mb-3">Create an account or sign in to save services and track your orders</p>
                  <div className="flex flex-col sm:flex-row gap-2 justify-center">
                    <Link to="/auth" className="glass-button text-sm px-4 py-2">
                      Sign In
                    </Link>
                    <Link to="/auth?tab=signup" className="glass-button text-sm px-4 py-2">
                      Create Account
                    </Link>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Service FAQ Section */}
      <div className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ServiceFAQ 
            serviceType={getServiceType(selectedService?.title || '')} 
            serviceName={selectedService?.title || 'Our Services'} 
          />
        </div>
      </div>
    </div>
  );
};

export default Services;