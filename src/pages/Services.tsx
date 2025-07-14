import { useState, useEffect, ReactElement } from "react";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import Cart from "../components/Cart";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Search, Filter, Star, Calculator, Sparkles, Users, ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, Variants } from "framer-motion";
import { SiInstagram, SiYoutube, SiDiscord, SiTwitch, SiSpotify, SiWhatsapp, SiSnapchat, SiX } from "react-icons/si";
import { useCurrency } from "../context/CurrencyContext";
import { useCart } from "../context/CartContext";
import { Badge } from "@/components/ui/badge";
import SaveForLater from "@/components/SaveForLater";
import { useServices } from "@/components/Services";
import { Button } from "@/components/ui/button";
import { Service } from "@/types/service";

// --- Data & Mappings ---
const platforms = [
  { name: "All", icon: <Star className="w-5 h-5" />, filter: "all" },
  { name: "Instagram", icon: <SiInstagram className="w-5 h-5" />, filter: "instagram" },
  { name: "YouTube", icon: <SiYoutube className="w-5 h-5" />, filter: "youtube" },
  { name: "X (Twitter)", icon: <SiX className="w-5 h-5" />, filter: "twitter" },
  { name: "Discord", icon: <SiDiscord className="w-5 h-5" />, filter: "discord" },
  { name: "Twitch", icon: <SiTwitch className="w-5 h-5" />, filter: "twitch" },
  { name: "Spotify", icon: <SiSpotify className="w-5 h-5" />, filter: "spotify" },
  { name: "Whatsapp", icon: <SiWhatsapp className="w-5 h-5" />, filter: "whatsapp" },
  { name: "Snapchat", icon: <SiSnapchat className="w-5 h-5" />, filter: "snapchat" },
];

// --- Reusable Modal Component ---
export const ServiceCalculatorModal = ({ service, onAddToCart }: { service: Service, onAddToCart: (service: Service, quantity: number, price: number) => void }) => {
  if (!service?.tiers || service.tiers.length === 0) {
    return (
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Error</DialogTitle>
          </DialogHeader>
          <p>Pricing information for this service is not available. Please contact support.</p>
        </DialogContent>
    );
  }

  const { getSymbol, convert } = useCurrency();
  const minTier = service.tiers[0];
  const maxTier = service.tiers[service.tiers.length - 1];

  const [quantity, setQuantity] = useState(minTier.quantity);
  const [price, setPrice] = useState(minTier.price);

  const calculatePrice = (q: number): number => {
    const sortedTiers = [...service.tiers].sort((a, b) => a.quantity - b.quantity);
    if (q <= sortedTiers[0].quantity) return (q / sortedTiers[0].quantity) * sortedTiers[0].price;
    if (q >= sortedTiers[sortedTiers.length - 1].quantity) {
      const lastTier = sortedTiers[sortedTiers.length - 1];
      return (q / lastTier.quantity) * lastTier.price;
    }
    let lowerTier = sortedTiers[0], upperTier = sortedTiers[sortedTiers.length - 1];
    for (let i = 0; i < sortedTiers.length - 1; i++) {
      if (q >= sortedTiers[i].quantity && q <= sortedTiers[i + 1].quantity) {
        lowerTier = sortedTiers[i]; upperTier = sortedTiers[i + 1]; break;
      }
    }
    const quantityRange = upperTier.quantity - lowerTier.quantity;
    if (quantityRange === 0) return lowerTier.price;
    const priceRange = upperTier.price - lowerTier.price;
    const quantityAboveLower = q - lowerTier.quantity;
    return lowerTier.price + (quantityAboveLower / quantityRange) * priceRange;
  };

  useEffect(() => { setPrice(calculatePrice(quantity)); }, [quantity, service.tiers]);

  return (
      <DialogContent className="glass">
        <DialogHeader>
          <DialogTitle className="font-clash text-2xl text-primary flex items-center gap-2">
            <span className="text-3xl">{service.icon}</span>{service.title}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6 pt-4">
          <div>
            <label className="block text-sm font-medium text-primary mb-3">Quantity: {quantity.toLocaleString()}</label>
            <input type="range" min={minTier.quantity} max={maxTier.quantity} step={minTier.quantity > 10 ? minTier.quantity / 10 : 1} value={quantity} onChange={(e) => setQuantity(parseInt(e.target.value))} className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer slider" />
          </div>
          <div className="text-center">
            <p className="text-muted-foreground">Total Price</p>
            <p className="text-4xl font-bold font-clash text-primary">{getSymbol()}{convert(price)}</p>
          </div>
          <button onClick={() => onAddToCart(service, quantity, price)} className="w-full glass-button group">
            <ShoppingCart className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300" />
            Add to Cart
          </button>
        </div>
      </DialogContent>
  );
};

// --- MAIN SERVICES PAGE COMPONENT ---
const Services = () => {
  const navigate = useNavigate();
  const { getSymbol, convert } = useCurrency();
  const { services, loading } = useServices();
  const { addToCart, cartCount } = useCart();
  const [selectedPlatform, setSelectedPlatform] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("popular");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedServiceForCalc, setSelectedServiceForCalc] = useState<Service | null>(null);

  const handleAddToCart = async (service: Service, quantity: number, price: number) => {
    await addToCart(service, quantity, price);
    setSelectedServiceForCalc(null);
    setIsCartOpen(true);
  };

  const filteredServices = services
      .filter(s => (selectedPlatform === "all" || s.platform === selectedPlatform) && s.title.toLowerCase().includes(searchTerm.toLowerCase()))
      .sort((a, b) => {
        const priceA = a.tiers?.[0]?.price ?? 0;
        const priceB = b.tiers?.[0]?.price ?? 0;
        switch (sortBy) {
          case "price-low": return priceA - priceB;
          case "price-high": return priceB - priceA;
          case "rating": return b.rating - a.rating;
          default: return b.reviews - a.reviews;
        }
      });

  const listVariants: Variants = { visible: { transition: { staggerChildren: 0.1 } } };
  const itemVariants: Variants = { hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } };

  return (
      <div className="min-h-screen bg-gradient-hero">
        <Navigation cartItemCount={cartCount} onCartClick={() => setIsCartOpen(true)} />
        <section className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="font-clash text-5xl md:text-7xl font-bold text-primary mb-6">Our Services</h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">Premium social media growth services to elevate your online presence.</p>
            </div>
            {/* Mobile-friendly filters */}
            <div className="space-y-4 mb-8">
              {/* Platform filters - horizontal scroll on mobile */}
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {platforms.map(p => (
                  <button
                    key={p.filter}
                    onClick={() => setSelectedPlatform(p.filter)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors duration-300 whitespace-nowrap ${
                      selectedPlatform === p.filter 
                        ? 'bg-accent-peach text-white' 
                        : 'glass text-primary hover:bg-accent-peach/20'
                    }`}
                  >
                    {p.icon}
                    <span className="hidden sm:inline">{p.name}</span>
                  </button>
                ))}
              </div>
              
              {/* Search and sort - stacked on mobile */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input 
                    type="text" 
                    placeholder="Search services..." 
                    value={searchTerm} 
                    onChange={e => setSearchTerm(e.target.value)} 
                    className="w-full pl-10 pr-4 py-3 rounded-xl glass focus:ring-2 focus:ring-accent-peach/50 focus:border-accent-peach" 
                  />
                </div>
                <div className="relative min-w-[180px]">
                  <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <select 
                    value={sortBy} 
                    onChange={e => setSortBy(e.target.value)} 
                    className="w-full pl-10 pr-8 py-3 rounded-xl glass appearance-none focus:ring-2 focus:ring-accent-peach/50 focus:border-accent-peach"
                  >
                    <option value="popular">Most Popular</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="pb-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {loading ? (<div className="text-center py-20 text-lg font-semibold">Loading Services...</div>) : (
                <Dialog onOpenChange={(isOpen) => !isOpen && setSelectedServiceForCalc(null)}>
                  <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" initial="hidden" animate="visible" variants={listVariants}>
                    {filteredServices.map((service) => (
                        <motion.div 
                          key={service.id} 
                          className="service-card group relative cursor-pointer h-full" 
                          variants={itemVariants}
                          whileHover={{ y: -8, scale: 1.02 }}
                          transition={{ duration: 0.2 }}
                          onClick={() => navigate(`/service/${service.id}`)}
                        >
                          <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
                            <SaveForLater service={service} />
                            <Badge className="bg-accent-peach/90 text-white">{service.badge}</Badge>
                          </div>
                          
                          {/* Service Icon with Platform Color */}
                          <div className="relative mb-6">
                            <div className="text-5xl mb-2 group-hover:scale-110 transition-transform duration-300 flex justify-center">
                              {service.icon}
                            </div>
                            <div className="text-center">
                              <span className="text-xs px-2 py-1 bg-accent-peach/20 rounded-full text-primary font-medium">
                                {service.platform.charAt(0).toUpperCase() + service.platform.slice(1)}
                              </span>
                            </div>
                          </div>
                          
                          {/* Service Content */}
                          <div className="space-y-4 flex-1 flex flex-col">
                            <div>
                              <h3 className="font-clash text-xl font-semibold text-primary mb-2 line-clamp-2 min-h-[3.5rem]">
                                {service.title}
                              </h3>
                              <p className="text-sm text-muted-foreground line-clamp-3 min-h-[4rem]">
                                {service.description}
                              </p>
                            </div>
                            
                            {/* Rating and Reviews */}
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1">
                                <Star className="w-4 h-4 fill-accent-peach text-accent-peach" />
                                <span className="text-sm font-medium">{service.rating}</span>
                                <span className="text-xs text-muted-foreground">({service.reviews})</span>
                              </div>
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Users className="w-3 h-3" />
                                <span>{service.reviews}</span>
                              </div>
                            </div>
                            
                            {/* Pricing */}
                            <div className="mt-auto space-y-4">
                              {service.tiers?.length > 0 ? (
                                <div className="text-center">
                                  <div className="flex items-baseline justify-center gap-2 mb-2">
                                    <span className="text-2xl font-bold text-primary font-clash">
                                      {getSymbol()}{convert(service.tiers[0].price)}
                                    </span>
                                    <span className="text-sm text-muted-foreground">
                                      / {service.tiers[0].quantity.toLocaleString()}
                                    </span>
                                  </div>
                                  <span className="text-xs text-accent-peach">
                                    Starting from ₹{(service.tiers[0].price / service.tiers[0].quantity).toFixed(4)} per unit
                                  </span>
                                </div>
                              ) : (
                                <div className="h-[60px] flex items-center justify-center text-muted-foreground">
                                  <span className="text-sm">Contact for pricing</span>
                                </div>
                              )}
                              
                              <Button 
                                className="w-full glass-button group/btn" 
                                disabled={!service.tiers || service.tiers.length === 0}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedServiceForCalc(service);
                                }}
                              >
                                <ShoppingCart className="w-4 h-4 mr-2 group-hover/btn:scale-110 transition-transform duration-300" />
                                Add to Cart
                              </Button>
                            </div>
                          </div>
                        </motion.div>
                    ))}
                  </motion.div>
                  {selectedServiceForCalc && (<ServiceCalculatorModal service={selectedServiceForCalc} onAddToCart={handleAddToCart} />)}
                </Dialog>
            )}
          </div>
        </section>
        <Footer />
        <Cart 
          isOpen={isCartOpen} 
          onClose={() => setIsCartOpen(false)}
          items={[]} // Cart context manages items internally
          onUpdateQuantity={() => {}} // Cart context handles this
          onRemoveItem={() => {}} // Cart context handles this
          onClearCart={() => {}} // Cart context handles this
        />
      </div>
  );
};

export default Services;