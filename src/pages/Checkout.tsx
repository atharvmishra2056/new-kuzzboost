import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, CreditCard, Wallet, Smartphone, CheckCircle, Lock, Shield } from "lucide-react";
import { SiInstagram, SiYoutube, SiDiscord, SiTwitch, SiSpotify, SiWhatsapp, SiSnapchat, SiX } from "react-icons/si";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { useCurrency } from "../context/CurrencyContext";
import { useAuth } from "../context/AuthContext";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";

// Icon mapping for checkout page
const iconMap: { [key: string]: React.ReactElement } = {
  SiInstagram: <SiInstagram className="w-8 h-8 text-[#E4405F]" />,
  SiYoutube: <SiYoutube className="w-8 h-8 text-[#FF0000]" />,
  SiX: <SiX className="w-8 h-8 text-[#000000]" />,
  SiDiscord: <SiDiscord className="w-8 h-8 text-[#7289DA]" />,
  SiTwitch: <SiTwitch className="w-8 h-8 text-[#9146FF]" />,
  SiSpotify: <SiSpotify className="w-8 h-8 text-[#1DB954]" />,
  SiWhatsapp: <SiWhatsapp className="w-8 h-8 text-[#25D366]" />,
  SiSnapchat: <SiSnapchat className="w-8 h-8 text-[#FFFC00]" />,
  placeholder: <div className="w-8 h-8 bg-accent-peach rounded-full" />
};

interface CheckoutItem {
  id: number;
  title: string;
  platform: string;
  iconName?: string;
  icon?: React.ReactElement;
  price: number;
  quantity: number;
  serviceQuantity?: number;
}

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { getSymbol, convert } = useCurrency();
  const { currentUser } = useAuth();
  
  const [items, setItems] = useState<CheckoutItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: currentUser?.email || "",
    firstName: "",
    lastName: "",
    phone: "",
    country: "India",
    address: "",
    city: "",
    postalCode: ""
  });

  useEffect(() => {
    // Get cart items from localStorage and reconstruct with icons
    const cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
    if (cartItems.length === 0) {
      navigate('/services');
      return;
    }
    
    // Reconstruct items with icons
    const itemsWithIcons = cartItems.map((item: any) => ({
      ...item,
      icon: iconMap[item.iconName || 'placeholder']
    }));
    
    setItems(itemsWithIcons);
  }, [navigate]);

  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.18; // 18% GST
  const total = subtotal + tax;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Clear cart and redirect to success
      localStorage.removeItem('cartItems');
      navigate('/checkout/success', { 
        state: { 
          orderDetails: { items, total, paymentMethod },
          customerInfo: formData
        }
      });
    } catch (error) {
      console.error('Payment failed:', error);
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return <div>Loading...</div>;
  }

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
            <h1 className="font-clash text-3xl md:text-4xl font-bold text-primary">
              Checkout
            </h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Order Summary - Mobile First */}
            <div className="lg:col-span-1 order-2 lg:order-1">
              <div className="glass rounded-2xl p-6 sticky top-24">
                <h2 className="font-clash text-xl font-semibold text-primary mb-4">
                  Order Summary
                </h2>
                
                <div className="space-y-4 mb-6">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 p-3 glass rounded-xl">
                      <div className="text-2xl">{item.icon}</div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-primary text-sm truncate">
                          {item.title}
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          {item.platform} • Qty: {item.quantity}
                        </p>
                        {item.serviceQuantity && (
                          <p className="text-xs text-accent-peach">
                            {item.serviceQuantity.toLocaleString()} units
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-primary">
                          {getSymbol()}{convert(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator className="my-4" />

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>{getSymbol()}{convert(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>GST (18%)</span>
                    <span>{getSymbol()}{convert(tax)}</span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span className="text-primary">{getSymbol()}{convert(total)}</span>
                  </div>
                </div>

                <div className="mt-6 p-3 bg-accent-mint/20 rounded-xl">
                  <div className="flex items-center gap-2 text-sm text-success">
                    <Shield className="w-4 h-4" />
                    <span>Secure 256-bit SSL encryption</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Checkout Form */}
            <div className="lg:col-span-2 order-1 lg:order-2">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Customer Information */}
                <div className="glass rounded-2xl p-6">
                  <h2 className="font-clash text-xl font-semibold text-primary mb-6">
                    Customer Information
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        className="mt-1"
                        placeholder="your@email.com"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="mt-1"
                        placeholder="+91 9876543210"
                      />
                    </div>
                    <div>
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        required
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="mt-1"
                        placeholder="John"
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        required
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="mt-1"
                        placeholder="Doe"
                      />
                    </div>
                  </div>
                </div>

                {/* Billing Address */}
                <div className="glass rounded-2xl p-6">
                  <h2 className="font-clash text-xl font-semibold text-primary mb-6">
                    Billing Address
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <Label htmlFor="address">Address *</Label>
                      <Input
                        id="address"
                        name="address"
                        required
                        value={formData.address}
                        onChange={handleInputChange}
                        className="mt-1"
                        placeholder="Street address"
                      />
                    </div>
                    <div>
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        name="city"
                        required
                        value={formData.city}
                        onChange={handleInputChange}
                        className="mt-1"
                        placeholder="Mumbai"
                      />
                    </div>
                    <div>
                      <Label htmlFor="postalCode">Postal Code *</Label>
                      <Input
                        id="postalCode"
                        name="postalCode"
                        required
                        value={formData.postalCode}
                        onChange={handleInputChange}
                        className="mt-1"
                        placeholder="400001"
                      />
                    </div>
                  </div>
                </div>

                {/* Payment Method */}
                <div className="glass rounded-2xl p-6">
                  <h2 className="font-clash text-xl font-semibold text-primary mb-6">
                    Payment Method
                  </h2>
                  
                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3 p-4 glass rounded-xl">
                        <RadioGroupItem value="card" id="card" />
                        <Label htmlFor="card" className="flex items-center gap-3 cursor-pointer flex-1">
                          <CreditCard className="w-5 h-5" />
                          <div>
                            <div className="font-medium">Credit/Debit Card</div>
                            <div className="text-sm text-muted-foreground">
                              Visa, Mastercard, Rupay
                            </div>
                          </div>
                        </Label>
                        <Badge variant="secondary">Recommended</Badge>
                      </div>
                      
                      <div className="flex items-center space-x-3 p-4 glass rounded-xl">
                        <RadioGroupItem value="upi" id="upi" />
                        <Label htmlFor="upi" className="flex items-center gap-3 cursor-pointer flex-1">
                          <Smartphone className="w-5 h-5" />
                          <div>
                            <div className="font-medium">UPI</div>
                            <div className="text-sm text-muted-foreground">
                              Pay with any UPI app
                            </div>
                          </div>
                        </Label>
                      </div>
                      
                      <div className="flex items-center space-x-3 p-4 glass rounded-xl">
                        <RadioGroupItem value="wallet" id="wallet" />
                        <Label htmlFor="wallet" className="flex items-center gap-3 cursor-pointer flex-1">
                          <Wallet className="w-5 h-5" />
                          <div>
                            <div className="font-medium">Digital Wallet</div>
                            <div className="text-sm text-muted-foreground">
                              Paytm, PhonePe, Google Pay
                            </div>
                          </div>
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                {/* Submit Button */}
                <div className="glass rounded-2xl p-6">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full glass-button text-lg py-6 mb-4"
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Processing Payment...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Lock className="w-5 h-5" />
                        Pay {getSymbol()}{convert(total)}
                      </div>
                    )}
                  </Button>
                  
                  <p className="text-xs text-center text-muted-foreground">
                    By placing your order, you agree to our Terms of Service and Privacy Policy
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Checkout;