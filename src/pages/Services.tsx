import { useState, useEffect, ReactElement } from "react";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import Cart from "../components/Cart";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Search, Filter, Star, Calculator, Sparkles } from "lucide-react";
import { motion, Variants } from "framer-motion";
import { SiInstagram, SiYoutube, SiDiscord, SiTwitch, SiSpotify, SiWhatsapp, SiSnapchat, SiX } from "react-icons/si";
import { useCurrency } from "../context/CurrencyContext";
import { Badge } from "@/components/ui/badge";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../firebase";
import { Button } from "@/components/ui/button";

// --- Interfaces (Exported for reuse in other components) ---
export interface ServiceTier {
  quantity: number;
  price: number;
}
export interface Service {
  id: number;
  title: string;
  platform: string;
  icon?: ReactElement;
  iconName: string;
  tiers?: ServiceTier[]; // IMPORTANT: Made tiers optional to handle bad data
  rating: number;
  reviews: number;
  features: string[];
  description: string;
  badge: string;
}

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

const iconMap: { [key: string]: ReactElement } = {
  SiInstagram: <SiInstagram className="w-8 h-8 text-[#E4405F]" />,
  SiYoutube: <SiYoutube className="w-8 h-8 text-[#FF0000]" />,
  SiX: <SiX className="w-8 h-8 text-[#000000]" />,
  SiDiscord: <SiDiscord className="w-8 h-8 text-[#7289DA]" />,
  SiTwitch: <SiTwitch className="w-8 h-8 text-[#9146FF]" />,
  SiSpotify: <SiSpotify className="w-8 h-8 text-[#1DB954]" />,
  SiWhatsapp: <SiWhatsapp className="w-8 h-8 text-[#25D366]" />,
  SiSnapchat: <SiSnapchat className="w-8 h-8 text-[#FFFC00]" />,
};

// --- Reusable Modal Component (Exported and Safe) ---
export const ServiceCalculatorModal = ({ service, onAddToCart }: { service: Service, onAddToCart: (service: Service, quantity: number, price: number) => void }) => {
  // CRITICAL FIX: Safety check to prevent crash if tiers are missing or empty.
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
          <button onClick={() => onAddToCart(service, quantity, price)} className="w-full glass-button group"><Sparkles className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform duration-300" />Add to Cart</button>
        </div>
      </DialogContent>
  );
};

// --- MAIN SERVICES PAGE COMPONENT ---
const Services = () => {
  const { getSymbol, convert } = useCurrency();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlatform, setSelectedPlatform] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("popular");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [selectedServiceForCalc, setSelectedServiceForCalc] = useState<Service | null>(null);

  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      try {
        const q = query(collection(db, "services"), orderBy("id"));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({
          ...(doc.data() as Omit<Service, 'icon'>),
          icon: iconMap[doc.data().iconName],
          tiers: doc.data().tiers || [] // CRITICAL FIX: Ensure tiers is always an array
        }));
        setServices(data);
      } catch (error) { console.error("Error fetching services: ", error); }
      setLoading(false);
    };
    fetchServices();
  }, []);

  const addToCart = (service: Service, quantity: number, price: number) => {
    const cartItem = {
      id: service.id,
      title: service.title,
      platform: service.platform,
      icon: service.icon,
      price: price,
      quantity: 1, // Always 1 item, regardless of service quantity
      maxQuantity: 10,
      serviceQuantity: quantity // Store the actual service quantity separately
    };
    setCartItems(prev => [...prev, cartItem]);
    setSelectedServiceForCalc(null);
    setIsCartOpen(true);
  };

  const filteredServices = services
      .filter(s => (selectedPlatform === "all" || s.platform === selectedPlatform) && s.title.toLowerCase().includes(searchTerm.toLowerCase()))
      .sort((a, b) => {
        // CRITICAL FIX: Safe access to price for sorting
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
        <Navigation cartItemCount={cartItems.length} onCartClick={() => setIsCartOpen(true)} />
        <section className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12"><h1 className="font-clash text-5xl md:text-7xl font-bold text-primary mb-6">Our Services</h1><p className="text-xl text-muted-foreground max-w-3xl mx-auto">Premium social media growth services to elevate your online presence.</p></div>
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
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-secondary text-secondary-foreground hover:bg-primary/80'
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
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-background/80 backdrop-blur-sm focus:ring-2 focus:ring-accent-peach/50 focus:border-accent-peach" 
                  />
                </div>
                <div className="relative min-w-[180px]">
                  <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <select 
                    value={sortBy} 
                    onChange={e => setSortBy(e.target.value)} 
                    className="w-full pl-10 pr-8 py-3 rounded-xl border border-border bg-background/80 backdrop-blur-sm appearance-none focus:ring-2 focus:ring-accent-peach/50 focus:border-accent-peach"
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
                  <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6" initial="hidden" animate="visible" variants={listVariants}>
                    {filteredServices.map((service) => (
                        <DialogTrigger asChild key={service.id}>
                          <motion.div onClick={() => setSelectedServiceForCalc(service)} className="stagger-item service-card group relative cursor-pointer" variants={itemVariants}>
                            <Badge className="absolute top-4 right-4">{service.badge}</Badge>
                            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">{service.icon}</div>
                            <h3 className="font-clash text-lg font-semibold text-primary mb-2">{service.title}</h3>
                            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{service.description}</p>
                            <div className="flex justify-between items-center mb-4"><div className="flex items-center gap-1"><Star className="w-4 h-4 fill-accent-peach text-accent-peach" /><span className="text-sm font-medium">{service.rating}</span><span className="text-xs text-muted-foreground">({service.reviews})</span></div></div>
                            <div className="mt-auto">
                              {service.tiers?.length > 0 ? (<div className="flex items-baseline gap-2 mb-4"><span className="text-2xl font-bold text-primary font-clash">{getSymbol()}{convert(service.tiers[0].price)}</span><span className="text-sm text-muted-foreground">/ {service.tiers[0].quantity.toLocaleString()}</span></div>) : <div className="h-[36px] flex items-center text-muted-foreground">Not Available</div>}
                              <Button className="w-full glass-button group/btn" disabled={!service.tiers || service.tiers.length === 0}><Calculator className="w-4 h-4 mr-2" />Customize</Button>
                            </div>
                          </motion.div>
                        </DialogTrigger>
                    ))}
                  </motion.div>
                  {selectedServiceForCalc && (<ServiceCalculatorModal service={selectedServiceForCalc} onAddToCart={addToCart} />)}
                </Dialog>
            )}
          </div>
        </section>
        <Footer />
        <Cart 
          isOpen={isCartOpen} 
          onClose={() => setIsCartOpen(false)} 
          items={cartItems} 
          onUpdateQuantity={(id, newQuantity) => {
            setCartItems(prev => prev.map(item => 
              item.id === id ? { ...item, quantity: newQuantity } : item
            ));
          }}
          onRemoveItem={(id) => {
            setCartItems(prev => prev.filter(item => item.id !== id));
          }}
          onClearCart={() => setCartItems([])} 
        />
      </div>
  );
};

export default Services;