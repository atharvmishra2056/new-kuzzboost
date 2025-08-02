import { useState, useEffect, ReactElement, useMemo } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Star, Shield, Clock, AlertCircle, ChevronDown, ChevronUp, ShoppingCart, MessageSquarePlus, MessageSquareOff, Loader2 } from "lucide-react";
import { SiInstagram, SiYoutube, SiDiscord, SiTwitch, SiSpotify, SiWhatsapp, SiSnapchat, SiX } from "react-icons/si";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { useRecentlyViewed } from "@/hooks/useRecentlyViewed";
import { usePersonalization } from "@/hooks/usePersonalization";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/hooks/use-toast";
import { useCurrency } from "@/context/CurrencyContext";


import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Service, Review } from "@/types/service";
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';

import ReviewList from "../components/ReviewList";
import ReviewModal from "../components/ReviewModal";
import SaveForLater from "../components/SaveForLater";
import Cart from "../components/Cart";



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

interface ServiceDetailProps {}

const ServiceDetail: React.FC<ServiceDetailProps> = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { getSymbol, convert } = useCurrency();
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const serviceId = id ? parseInt(id, 10) : -1;

  // State
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1000);
  const [userInput, setUserInput] = useState('');
  const [selectedPackage, setSelectedPackage] = useState("standard");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showRules, setShowRules] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [validationError, setValidationError] = useState("");
  const [isReviewModalOpen, setReviewModalOpen] = useState(false);
  const [reviewToEdit, setReviewToEdit] = useState<Review | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Delete review mutation
  const deleteReviewMutation = useMutation({
    mutationFn: async (reviewId: string) => {
      const { error } = await (supabase.rpc as any)('delete_review', { 
        review_id_to_delete: reviewId 
      });
      
      if (error) {
        throw new Error(error.message);
      }
      return true;
    },
    onSuccess: () => {
      toast({ 
        title: 'Success', 
        description: 'Your review has been deleted.' 
      });
      queryClient.invalidateQueries({ 
        queryKey: ['reviews', serviceId] 
      });
    },
    onError: (error: Error) => {
      toast({ 
        variant: 'destructive', 
        title: 'Error', 
        description: error.message 
      });
    },
  });

  const handleDeleteReview = async (reviewId: string) => {
    if (!window.confirm('Are you sure you want to delete this review?')) {
      return;
    }
    
    try {
      await deleteReviewMutation.mutateAsync(reviewId);
    } catch (error) {
      console.error('Error deleting review:', error);
    }
  };

  const handleEditReview = (review: Review) => {
    setReviewToEdit(review);
    setReviewModalOpen(true);
  };

  const handleOpenReviewModal = () => {
    setReviewToEdit(null);
    setReviewModalOpen(true);
  };

  // Hooks
  const { addToRecentlyViewed } = useRecentlyViewed();
  const { trackServiceView } = usePersonalization();
  const { addToCart } = useCart();

  // Fetch reviews with proper error handling and type safety
  const { data: reviews, ...reviewsQuery } = useQuery<Review[]>({
    queryKey: ['reviews', serviceId],
    queryFn: async (): Promise<Review[]> => {
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          *,
          profiles ( id, full_name, avatar_url )
        `)
        .eq('service_id', serviceId)
        .order('created_at', { ascending: false });
        
      if (error) {
        console.error('Error fetching reviews:', error);
        throw error;
      }
      
      if (!data) return [];
      
      // Transform the data to match the Review type from service.ts
      return data.map((review: any) => ({
        id: review.id,
        created_at: review.created_at,
        service_id: review.service_id,
        user_id: review.user_id,
        rating: review.rating,
        title: review.title || null,
        comment: review.comment || null,
        is_verified_purchase: review.is_verified_purchase || false,
        user: {
          full_name: review.profiles?.full_name || 'Anonymous',
          avatar_url: review.profiles?.avatar_url || null
        }
      }));
    },
    enabled: serviceId !== -1,
    refetchOnWindowFocus: false,
  });

  const { averageRating, reviewCount, userHasReviewed } = useMemo(() => {
    if (!reviews || !Array.isArray(reviews)) {
      return { averageRating: 0, reviewCount: 0, userHasReviewed: false };
    }
    
    const reviewCount = reviews.length;
    const averageRating = reviewCount > 0 ? 
      reviews.reduce((acc, r) => acc + (r.rating || 0), 0) / reviewCount : 0;
    const userHasReviewed = reviews.some(r => r.user_id === currentUser?.id);
    
    return { 
      averageRating: Number(averageRating.toFixed(1)),
      reviewCount,
      userHasReviewed 
    };
  }, [reviews, currentUser?.id]);

  const presetQuantities = [100, 1000, 5000, 10000, 50000, 100000];

  useEffect(() => {
    const fetchServiceData = async () => {
      if (serviceId === -1) return;

      setLoading(true);
      try {
        const { data: serviceData, error: serviceError } = await supabase
            .from('services')
            .select('*, service_tiers(quantity, price)')
            .eq('id', serviceId)
            .single();

        if (serviceError) throw serviceError;

        if (serviceData) {
          const formattedService: Service = {
            ...serviceData,
            iconName: serviceData.icon_name,
            tiers: serviceData.service_tiers || [],
            rules: (serviceData as { rules?: string[] }).rules || [
              "Keep your profile/content public during delivery",
              "Do not change username/URL after placing order",
              "Allow 1-3 business days for completion",
              "Contact support if you have any issues"
            ],
            estimatedDelivery: (serviceData as { estimatedDelivery?: string }).estimatedDelivery || "1-3 days",
            packageTypes: (serviceData as { packageTypes?: { name: string; description: string; multiplier: number }[] }).packageTypes || []
          };
          setService(formattedService);
          addToRecentlyViewed(formattedService);
          trackServiceView(formattedService);
          if (formattedService.tiers && formattedService.tiers.length > 0) {
            setQuantity(formattedService.tiers[0].quantity);
          }
        }



      } catch (error) {
        console.error("Error fetching service data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchServiceData();
  }, [serviceId, addToRecentlyViewed, trackServiceView]);

  // Handle navigation to dashboard if user is authenticated but not in dashboard
  useEffect(() => {
    // Only redirect once when user becomes authenticated and we're not already on dashboard
    if (currentUser && !location.pathname.startsWith('/dashboard')) {
      const newPath = `/dashboard/service/${id}`;
      // Use setTimeout to avoid navigation during render
      const timeoutId = setTimeout(() => {
        navigate(newPath, { replace: true });
      }, 0);
      
      return () => clearTimeout(timeoutId);
    }
  }, [currentUser, id, navigate]); // Only depend on currentUser and id, not location

  const calculatePrice = (qty: number): number => {
    if (!service?.tiers || service.tiers.length === 0) return 0;
    const sortedTiers = [...service.tiers].sort((a, b) => a.quantity - b.quantity);
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

  const validateInput = (input: string): boolean => {
    if (!input.trim()) {
      setValidationError("This field is required");
      return false;
    }
    if (service?.platform === "instagram" && !input.startsWith("@") && !input.includes("instagram.com")) {
      setValidationError("Please enter a valid Instagram username (@username) or post URL");
      return false;
    }
    if (service?.platform === "youtube" && !input.includes("youtube.com") && !input.includes("youtu.be")) {
      setValidationError("Please enter a valid YouTube URL");
      return false;
    }
    setValidationError("");
    return true;
  };

  const handleStartOrder = () => {
    if (!validateInput(userInput) || !termsAccepted) {
      if (!termsAccepted) setValidationError("Please accept the terms and conditions");
      return;
    }
    if (!currentUser) {
      navigate('/auth', { state: { returnTo: location.pathname } });
      return;
    }
    setShowConfirmation(true);
  };

  const confirmOrder = () => {
    if (!service) return;
    const finalPrice = calculatePrice(quantity);
    addToCart(service, quantity, finalPrice, userInput);
    setShowConfirmation(false);
    setIsCartOpen(true);
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
        <div className="pt-20 text-center">
          <h1 className="text-2xl font-bold text-primary">Service not found</h1>
          <Button onClick={() => navigate('/services')} className="mt-4">Back to Services</Button>
        </div>
      </div>
    );
  }

  const finalPrice = calculatePrice(quantity);

  return (
    <div className="min-h-screen bg-gradient-hero">
      <div className="pt-8 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Button variant="ghost" size="sm" onClick={() => navigate(currentUser ? '/dashboard/services' : '/services')} className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Services
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-8">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-2xl p-8">
                <div className="flex items-center gap-4 mb-6">
                  {iconMap[service.iconName]}
                  <div>
                    <h1 className="font-clash text-3xl md:text-4xl font-bold text-primary">{service.title}</h1>
                    <p className="text-lg text-muted-foreground mt-2">{service.platform.charAt(0).toUpperCase() + service.platform.slice(1)}</p>
                  </div>
                  <div className="ml-auto flex items-center gap-2">
                    <SaveForLater service={service} />
                    <Badge className="bg-accent-peach/20 text-accent-peach border-accent-peach/30">{service.badge}</Badge>
                  </div>
                </div>
                <p className="text-muted-foreground mb-6 text-lg leading-relaxed">{service.description}</p>
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 fill-accent-peach text-accent-peach" />
                    <span className="font-semibold">{averageRating.toFixed(1)}</span>
                    <span className="text-muted-foreground">({reviewCount} reviews)</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>{service.estimatedDelivery || "1-3 days"}</span>
                  </div>
                </div>
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

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass rounded-2xl p-6">
                <button onClick={() => setShowRules(!showRules)} className="w-full flex items-center justify-between text-left">
                  <h3 className="font-semibold text-primary flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Rules & Guidelines
                  </h3>
                  {showRules ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </button>
                {showRules && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} className="mt-4 space-y-2">
                    {(service.rules || []).map((rule, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-accent-peach mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">{rule}</span>
                      </div>
                    ))}
                  </motion.div>
                )}
              </motion.div>
            </div>

            <div className="lg:sticky lg:top-24 h-fit">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass rounded-2xl p-8 space-y-6">
                <h2 className="font-clash text-2xl font-bold text-primary">Customize Your Order</h2>
                <div className="space-y-4">
                  <Label htmlFor="userInput" className="text-base font-medium">
                    {service.platform === "instagram" ? "Instagram Username or Post URL" : "Profile URL or Username"}
                  </Label>
                  <Input id="userInput" value={userInput} onChange={(e) => { setUserInput(e.target.value); setValidationError(""); }} placeholder={service.platform === "instagram" ? "@username or https://..." : "Enter URL or username"} className={validationError ? "border-red-500" : ""} />
                  {validationError && <p className="text-red-500 text-sm">{validationError}</p>}
                </div>
                {service.packageTypes && service.packageTypes.length > 0 && (
                  <div className="space-y-3">
                    <Label className="text-base font-medium">Package Type</Label>
                    <div className="space-y-2">
                      {service.packageTypes.map((pkg, index) => (
                        <label key={index} className="flex items-center space-x-3 cursor-pointer">
                          <input type="radio" name="package" value={pkg.name.toLowerCase()} checked={selectedPackage === pkg.name.toLowerCase()} onChange={(e) => setSelectedPackage(e.target.value)} className="text-primary" />
                          <div>
                            <span className="font-medium">{pkg.name}</span>
                            <p className="text-sm text-muted-foreground">{pkg.description}</p>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
                <div className="space-y-4">
                  <Label className="text-base font-medium">Quantity: {quantity.toLocaleString()}</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {presetQuantities.map((preset) => (
                      <Button key={preset} variant={quantity === preset ? "default" : "outline"} size="sm" onClick={() => setQuantity(preset)} className="text-xs">
                        {preset >= 1000 ? `${preset / 1000}K` : preset}
                      </Button>
                    ))}
                  </div>
                  <Slider value={[quantity]} onValueChange={(value) => setQuantity(value[0])} max={1000000} min={10} step={10} className="w-full" />
                  <Input type="number" value={quantity} onChange={(e) => setQuantity(Number(e.target.value) || 10)} min={10} max={1000000} placeholder="Enter custom quantity" />
                </div>
                <div className="glass rounded-xl p-6 text-center">
                  <p className="text-muted-foreground mb-2">Total Price</p>
                  <p className="text-4xl font-bold font-clash text-primary">{getSymbol()}{convert(finalPrice)}</p>
                  <p className="text-sm text-muted-foreground mt-2">{getSymbol()}{(finalPrice / quantity).toFixed(4)} per unit</p>
                </div>
                <label className="flex items-start space-x-3 cursor-pointer">
                  <Checkbox checked={termsAccepted} onCheckedChange={(checked) => setTermsAccepted(checked as boolean)} />
                  <span className="text-sm text-muted-foreground">I agree to the terms and conditions and understand the delivery process</span>
                </label>
                <Button onClick={handleStartOrder} disabled={!userInput.trim() || !termsAccepted} className="w-full glass-button text-lg py-6">
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Add to Cart - {getSymbol()}{convert(finalPrice)}
                </Button>
              </motion.div>
            </div>
          </div>

          <div className="mt-16 space-y-8">
            <hr className="border-white/10" />
            <div>
              <div className="space-y-6 mt-12">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h3 className="text-2xl font-bold font-clash text-white">Customer Reviews</h3>
                  {reviewCount > 0 && (
                    <div className="flex items-center mt-2">
                      <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-5 w-5 ${
                              star <= Math.round(averageRating) ? 'text-yellow-400 fill-current' : 'text-gray-500'
                            }`}
                          />
                        ))}
                        <span className="ml-2 text-gray-300">
                          {averageRating.toFixed(1)} ({reviewCount} {reviewCount === 1 ? 'review' : 'reviews'})
                        </span>
                      </div>
                    </div>
                  )}
                </div>
                <Button 
                  onClick={() => setReviewModalOpen(true)}
                  className="mt-4 md:mt-0 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20"
                >
                  <MessageSquarePlus className="mr-2 h-4 w-4" />
                  Write a Review
                </Button>
              </div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass rounded-2xl p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold text-primary">Reviews ({reviewCount})</h3>
                  {!userHasReviewed && currentUser && (
                    <Button variant="outline" size="sm" onClick={handleOpenReviewModal}>
                      Write a Review
                    </Button>
                  )}
                </div>
                {reviewsQuery.isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-8 h-8 animate-spin" />
                  </div>
                ) : reviewsQuery.isError ? (
                  <div className="text-center py-8 text-red-500">
                    <p>Could not load reviews. Please try again later.</p>
                  </div>
                ) : reviews && reviews.length > 0 ? (
                  <ReviewList 
                    reviews={reviews} 
                    onEdit={handleEditReview} 
                    onDelete={handleDeleteReview} 
                  />
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No reviews yet. Be the first to leave one!</p>
                    {currentUser && (
                      <Button variant="outline" size="sm" onClick={handleOpenReviewModal} className="mt-4">
                        Write a Review
                      </Button>
                    )}
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>

      {service && (
        <ReviewModal
          isOpen={isReviewModalOpen}
          onClose={() => setReviewModalOpen(false)}
          serviceId={serviceId}
          reviewToEdit={reviewToEdit}
          onReviewSubmitted={async () => {
            setReviewModalOpen(false);
            setReviewToEdit(null);
            await queryClient.invalidateQueries({ queryKey: ['reviews', serviceId] });
          }}
        />
      )}

      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent className="glass">
          <DialogHeader>
            <DialogTitle className="font-clash text-2xl text-primary">Confirm Your Order</DialogTitle>
          </DialogHeader>
          <div className="mt-4 space-y-4">
            <p>You are about to add the following to your cart:</p>
            <div className="border border-white/10 rounded-lg p-4 space-y-2">
              <p><span className="font-semibold">Service:</span> {service.title}</p>
              <p><span className="font-semibold">Quantity:</span> {quantity.toLocaleString()}</p>
              <p><span className="font-semibold">For:</span> {userInput}</p>
              <p className="text-lg font-bold"><span className="font-semibold">Total:</span> {getSymbol()}{convert(finalPrice)}</p>
            </div>
            <div className="flex justify-end gap-4">
              <Button variant="ghost" onClick={() => setShowConfirmation(false)}>Cancel</Button>
              <Button onClick={confirmOrder}>Confirm & Add to Cart</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Cart 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)}
        items={[]}
        onUpdateQuantity={() => {}}
        onRemoveItem={() => {}}
        onClearCart={() => {}}
      />
    </div>
  );
};

export default ServiceDetail;
