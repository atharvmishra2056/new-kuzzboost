import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Star, Shield, Clock, Users, AlertCircle, ChevronDown, ChevronUp, ShoppingCart } from "lucide-react";
import { SiInstagram, SiYoutube, SiDiscord, SiTwitch, SiSpotify, SiWhatsapp, SiSnapchat, SiX } from "react-icons/si";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import SaveForLater from "@/components/SaveForLater";
import { useRecentlyViewed } from "@/hooks/useRecentlyViewed";
import { usePersonalization } from "@/hooks/usePersonalization";
import { useCart } from "@/context/CartContext";
import { motion } from "framer-motion";
import { useCurrency } from "../context/CurrencyContext";
import { useAuth } from "../context/AuthContext";
import { supabase } from '@/integrations/supabase/client';
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const iconMap: { [key: string]: React.ReactElement } = {
  SiInstagram: <SiInstagram className="w-12 h-12 text-[#E4405F]" />,
  SiYoutube: <SiYoutube className="w-12 h-12 text-[#FF0000]" />,
  SiX: <SiX className="w-12 h-12 text-[#000000]" />,
  SiDiscord: <SiDiscord className="w-12 h-12 text-[#7289DA]" />,
  SiTwitch: <SiTwitch className="w-12 h-12 text-[#9146FF]" />,
  SiSpotify: <SiSpotify className="w-12 h-12 text-[#1DB954]" />,
  SiWhatsapp: <SiWhatsapp className="w-12 h-12 text-[#25D366]" />,
  SiSnapchat: <SiSnapchat className="w-12 h-12 text-[#FFFC00]" />,
};

interface Service {
  id: number;
  title: string;
  platform: string;
  iconName: string;
  description: string;
  features: string[];
  rating: number;
  reviews: number;
  badge: string;
  tiers: { quantity: number; price: number }[];
  rules?: string[];
  estimatedDelivery?: string;
  packageTypes?: { name: string; description: string; multiplier: number }[];
}

const ServiceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getSymbol, convert } = useCurrency();
  const { currentUser } = useAuth();
  const { addToRecentlyViewed } = useRecentlyViewed();
  const { trackServiceView } = usePersonalization();
  const { addToCart } = useCart();
  
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1000);
  const [userInput, setUserInput] = useState("");
  const [selectedPackage, setSelectedPackage] = useState("standard");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showRules, setShowRules] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [validationError, setValidationError] = useState("");

  // Preset quantity options
  const presetQuantities = [100, 1000, 5000, 10000, 50000, 100000];
  
  useEffect(() => {
    const fetchService = async () => {
      if (!id) return;
      
      try {
        const { data: serviceData, error } = await supabase
          .from('services')
          .select('*, service_tiers(quantity, price)')
          .eq('id', parseInt(id))
          .single();
          
        if (error) throw error;
        
        if (serviceData) {
          const service = {
            ...serviceData,
            iconName: serviceData.icon_name,
            tiers: serviceData.service_tiers || []
          } as Service;
          
          setService(service);
          
          // Track for personalization and recently viewed
          addToRecentlyViewed(service);
          trackServiceView(service);
          
          if (service.tiers && service.tiers.length > 0) {
            setQuantity(service.tiers[0].quantity);
          }
        }
      } catch (error) {
        console.error("Error fetching service:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [id]);

  const calculatePrice = (qty: number): number => {
    if (!service?.tiers || service.tiers.length === 0) return 0;
    
    const sortedTiers = [...service.tiers].sort((a, b) => a.quantity - b.quantity);
    
    // Find the appropriate tier or interpolate
    if (qty <= sortedTiers[0].quantity) {
      return (qty / sortedTiers[0].quantity) * sortedTiers[0].price;
    }
    
    if (qty >= sortedTiers[sortedTiers.length - 1].quantity) {
      const lastTier = sortedTiers[sortedTiers.length - 1];
      return (qty / lastTier.quantity) * lastTier.price;
    }
    
    // Interpolate between tiers
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

  const validateInput = (input: string): boolean => {
    if (!input.trim()) {
      setValidationError("This field is required");
      return false;
    }
    
    if (service?.platform === "instagram") {
      if (!input.startsWith("@") && !input.includes("instagram.com")) {
        setValidationError("Please enter a valid Instagram username (@username) or post URL");
        return false;
      }
    } else if (service?.platform === "youtube") {
      if (!input.includes("youtube.com") && !input.includes("youtu.be")) {
        setValidationError("Please enter a valid YouTube URL");
        return false;
      }
    }
    
    setValidationError("");
    return true;
  };

  const handleStartOrder = () => {
    if (!currentUser) {
      navigate('/auth');
      return;
    }
    
    if (!validateInput(userInput) || !termsAccepted) {
      if (!termsAccepted) {
        setValidationError("Please accept the terms and conditions");
      }
      return;
    }
    
    setShowConfirmation(true);
  };

  const confirmOrder = () => {
    const basePrice = calculatePrice(quantity);
    const packageMultiplier = service?.packageTypes?.find(p => p.name.toLowerCase() === selectedPackage)?.multiplier || 1;
    const finalPrice = basePrice * packageMultiplier;
    
    // Add to cart using CartContext
    addToCart(service!, quantity, finalPrice);
    
    navigate('/checkout/review');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-gradient-hero">
        <Navigation />
        <div className="pt-20 text-center">
          <h1 className="text-2xl font-bold text-primary">Service not found</h1>
          <Button onClick={() => navigate('/services')} className="mt-4">
            Back to Services
          </Button>
        </div>
      </div>
    );
  }

  const currentPrice = calculatePrice(quantity);
  const packageMultiplier = service.packageTypes?.find(p => p.name.toLowerCase() === selectedPackage)?.multiplier || 1;
  const finalPrice = currentPrice * packageMultiplier;

  return (
    <div className="min-h-screen bg-gradient-hero">
      <Navigation />
      
      <div className="pt-20 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/services')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Services
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left Side - Service Info */}
            <div className="space-y-8">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass rounded-2xl p-8"
              >
                <div className="flex items-center gap-4 mb-6">
                  {iconMap[service.iconName]}
                  <div>
                    <h1 className="font-clash text-3xl md:text-4xl font-bold text-primary">
                      {service.title}
                    </h1>
                    <p className="text-lg text-muted-foreground mt-2">
                      {service.platform.charAt(0).toUpperCase() + service.platform.slice(1)}
                    </p>
                  </div>
                  <div className="ml-auto flex items-center gap-2">
                    <SaveForLater service={service} />
                    <Badge className="bg-accent-peach/20 text-accent-peach border-accent-peach/30">{service.badge}</Badge>
                  </div>
                </div>

                <p className="text-muted-foreground mb-6 text-lg leading-relaxed">
                  {service.description}
                </p>

                {/* Rating and Reviews */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 fill-accent-peach text-accent-peach" />
                    <span className="font-semibold">{service.rating}</span>
                    <span className="text-muted-foreground">({service.reviews} reviews)</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>{service.estimatedDelivery || "1-3 days"}</span>
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-primary">What's included:</h3>
                  <ul className="space-y-2">
                    {service.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-accent-peach rounded-full" />
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>

              {/* Rules and Guidelines */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="glass rounded-2xl p-6"
              >
                <button
                  onClick={() => setShowRules(!showRules)}
                  className="w-full flex items-center justify-between text-left"
                >
                  <h3 className="font-semibold text-primary flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Rules & Guidelines
                  </h3>
                  {showRules ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </button>
                
                {showRules && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    className="mt-4 space-y-2"
                  >
                    {(service.rules || [
                      "Keep your profile/content public during delivery",
                      "Do not change username/URL after placing order",
                      "Allow 1-3 business days for completion",
                      "Contact support if you have any issues"
                    ]).map((rule, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-accent-peach mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">{rule}</span>
                      </div>
                    ))}
                  </motion.div>
                )}
              </motion.div>
            </div>

            {/* Right Side - Order Form */}
            <div className="lg:sticky lg:top-24 h-fit">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="glass rounded-2xl p-8 space-y-6"
              >
                <h2 className="font-clash text-2xl font-bold text-primary">
                  Customize Your Order
                </h2>

                {/* Dynamic Input Fields */}
                <div className="space-y-4">
                  <Label htmlFor="userInput" className="text-base font-medium">
                    {service.platform === "instagram" ? "Instagram Username or Post URL" :
                     service.platform === "youtube" ? "YouTube Video/Channel URL" :
                     service.platform === "twitter" ? "Tweet URL or Username" :
                     "Profile URL or Username"}
                  </Label>
                  <Input
                    id="userInput"
                    value={userInput}
                    onChange={(e) => {
                      setUserInput(e.target.value);
                      setValidationError("");
                    }}
                    placeholder={
                      service.platform === "instagram" ? "@username or https://instagram.com/p/..." :
                      service.platform === "youtube" ? "https://youtube.com/watch?v=..." :
                      "Enter URL or username"
                    }
                    className={validationError ? "border-red-500" : ""}
                  />
                  {validationError && (
                    <p className="text-red-500 text-sm">{validationError}</p>
                  )}
                </div>

                {/* Package Type Selection */}
                {service.packageTypes && service.packageTypes.length > 0 && (
                  <div className="space-y-3">
                    <Label className="text-base font-medium">Package Type</Label>
                    <div className="space-y-2">
                      {service.packageTypes.map((pkg, index) => (
                        <label key={index} className="flex items-center space-x-3 cursor-pointer">
                          <input
                            type="radio"
                            name="package"
                            value={pkg.name.toLowerCase()}
                            checked={selectedPackage === pkg.name.toLowerCase()}
                            onChange={(e) => setSelectedPackage(e.target.value)}
                            className="text-primary"
                          />
                          <div>
                            <span className="font-medium">{pkg.name}</span>
                            <p className="text-sm text-muted-foreground">{pkg.description}</p>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quantity Selection */}
                <div className="space-y-4">
                  <Label className="text-base font-medium">
                    Quantity: {quantity.toLocaleString()}
                  </Label>
                  
                  {/* Preset Buttons */}
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

                  {/* Slider */}
                  <Slider
                    value={[quantity]}
                    onValueChange={(value) => setQuantity(value[0])}
                    max={1000000}
                    min={10}
                    step={10}
                    className="w-full"
                  />
                  
                  {/* Custom Input */}
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
                <div className="glass rounded-xl p-6 text-center">
                  <p className="text-muted-foreground mb-2">Total Price</p>
                  <p className="text-4xl font-bold font-clash text-primary">
                    {getSymbol()}{convert(finalPrice)}
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    {getSymbol()}{convert(finalPrice / quantity)} per unit
                  </p>
                </div>

                {/* Terms Checkbox */}
                <label className="flex items-start space-x-3 cursor-pointer">
                  <Checkbox
                    checked={termsAccepted}
                    onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
                  />
                  <span className="text-sm text-muted-foreground">
                    I agree to the terms and conditions and understand the delivery process
                  </span>
                </label>

                {/* Add to Cart Button */}
                <Button
                  onClick={handleStartOrder}
                  disabled={!userInput.trim() || !termsAccepted}
                  className="w-full glass-button text-lg py-6"
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Add to Cart - {getSymbol()}{convert(finalPrice)}
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent className="glass">
          <DialogHeader>
            <DialogTitle className="font-clash text-2xl text-primary">
              Confirm Your Order
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="glass rounded-xl p-4 space-y-2">
              <h4 className="font-semibold text-primary">Order Summary</h4>
              <p><span className="text-muted-foreground">Service:</span> {service.title}</p>
              <p><span className="text-muted-foreground">Platform:</span> {service.platform}</p>
              <p><span className="text-muted-foreground">Quantity:</span> {quantity.toLocaleString()}</p>
              <p><span className="text-muted-foreground">Input:</span> {userInput}</p>
              <p><span className="text-muted-foreground">Package:</span> {selectedPackage}</p>
              <p className="text-lg font-bold"><span className="text-muted-foreground">Total:</span> {getSymbol()}{convert(finalPrice)}</p>
            </div>
            
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setShowConfirmation(false)} className="flex-1">
                Go Back
              </Button>
              <Button onClick={confirmOrder} className="flex-1 glass-button">
                Proceed to Checkout
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default ServiceDetail;