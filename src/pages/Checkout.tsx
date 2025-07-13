import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Smartphone, CheckCircle, Shield, QrCode, CreditCard, Download } from "lucide-react";
import { SiInstagram, SiYoutube, SiDiscord, SiTwitch, SiSpotify, SiWhatsapp, SiSnapchat, SiX } from "react-icons/si";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { motion, AnimatePresence } from "framer-motion";
import { useCurrency } from "../context/CurrencyContext";
import { useAuth } from "../context/AuthContext";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

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

interface OrderData {
  orderId: string;
  items: CheckoutItem[];
  total: number;
  customerInfo: any;
  transactionId: string;
  timestamp: Date;
}

const Checkout = () => {
  const navigate = useNavigate();
  const { getSymbol, convert } = useCurrency();
  const { currentUser } = useAuth();
  
  const [items, setItems] = useState<CheckoutItem[]>([]);
  const [currentStep, setCurrentStep] = useState<'details' | 'payment' | 'verify' | 'success'>('details');
  const [loading, setLoading] = useState(false);
  const [transactionId, setTransactionId] = useState("");
  const [orderData, setOrderData] = useState<OrderData | null>(null);
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

  // Check authentication on component mount
  useEffect(() => {
    if (!currentUser) {
      navigate('/auth');
      return;
    }
  }, [currentUser, navigate]);

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
  const total = subtotal; // No GST as requested

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentStep('payment');
  };

  const handleProceedToPayment = () => {
    setCurrentStep('verify');
  };

  const handleVerifyPayment = async () => {
    if (!transactionId.trim()) {
      alert("Please enter a valid transaction ID");
      return;
    }

    // Simple validation for transaction ID format
    if (transactionId.length < 8) {
      alert("Transaction ID must be at least 8 characters long");
      return;
    }

    setLoading(true);
    try {
      // Mock transaction verification with more realistic validation
      const isValidTransaction = await new Promise((resolve) => {
        setTimeout(() => {
          // Simulate different validation outcomes
          const validFormats = ['UPI', 'TXN', 'REF'];
          const hasValidPrefix = validFormats.some(prefix => 
            transactionId.toUpperCase().startsWith(prefix)
          );
          
          // More nuanced validation
          if (transactionId.length < 8) {
            resolve(false);
          } else if (transactionId.toUpperCase().includes('TEST')) {
            resolve(false); // Test transactions are invalid
          } else if (hasValidPrefix && transactionId.length >= 10) {
            resolve(true); // Valid format
          } else {
            resolve(Math.random() > 0.3); // 70% success rate for other formats
          }
        }, 2000); // 2 second delay to simulate API call
      });

      if (!isValidTransaction) {
        alert("Invalid transaction ID. Please check your payment app and try again.");
        return;
      }

      // Generate order ID
      const orderId = `KZB-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
      
      // Save order to Firestore
      await addDoc(collection(db, "orders"), {
        orderId,
        userId: currentUser?.uid,
        customerInfo: formData,
        items: items.map(({ icon, ...item }) => item), // Remove icon for storage
        total,
        transactionId,
        status: "pending",
        createdAt: serverTimestamp(),
      });

      const newOrderData: OrderData = {
        orderId,
        items,
        total,
        customerInfo: formData,
        transactionId,
        timestamp: new Date(),
      };

      setOrderData(newOrderData);
      setCurrentStep('success');
      
      // Clear cart
      localStorage.removeItem('cartItems');
    } catch (error) {
      console.error('Error creating order:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      alert(`Error processing order: ${errorMessage}. Please try again or contact support.`);
    } finally {
      setLoading(false);
    }
  };

  const generateInvoicePDF = async () => {
    if (!orderData) return;

    const pdf = new jsPDF();
    
    // Header
    pdf.setFontSize(20);
    pdf.text('KuzzBoost - Order Invoice', 20, 30);
    
    // Order details
    pdf.setFontSize(12);
    pdf.text(`Order ID: ${orderData.orderId}`, 20, 50);
    pdf.text(`Date: ${orderData.timestamp.toLocaleString()}`, 20, 60);
    pdf.text(`Transaction ID: ${orderData.transactionId}`, 20, 70);
    
    // Customer info
    pdf.text('Customer Information:', 20, 90);
    pdf.text(`Name: ${orderData.customerInfo.firstName} ${orderData.customerInfo.lastName}`, 20, 100);
    pdf.text(`Email: ${orderData.customerInfo.email}`, 20, 110);
    pdf.text(`Phone: ${orderData.customerInfo.phone}`, 20, 120);
    
    // Items
    let yPos = 140;
    pdf.text('Order Items:', 20, yPos);
    yPos += 10;
    
    orderData.items.forEach((item, index) => {
      const unitPrice = item.serviceQuantity ? (item.price / item.serviceQuantity).toFixed(4) : item.price.toFixed(2);
      pdf.text(`${index + 1}. ${item.title} (${item.platform})`, 20, yPos);
      pdf.text(`Quantity: ${item.quantity} | Unit Price: ₹${unitPrice} | Total: ₹${(item.price * item.quantity).toFixed(2)}`, 25, yPos + 10);
      yPos += 20;
    });
    
    // Total
    yPos += 10;
    pdf.text(`Total Amount: ₹${orderData.total.toFixed(2)}`, 20, yPos);
    
    // Footer
    pdf.text('Thank you for choosing KuzzBoost!', 20, yPos + 20);
    
    pdf.save(`KuzzBoost-Invoice-${orderData.orderId}.pdf`);
  };

  if (items.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-hero">
      <Navigation />
      
      <div className="pt-20 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => currentStep === 'details' ? navigate('/services') : setCurrentStep('details')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              {currentStep === 'details' ? 'Back to Services' : 'Back'}
            </Button>
            <h1 className="font-clash text-3xl md:text-4xl font-bold text-primary">
              {currentStep === 'success' ? 'Order Successful!' : 'Checkout'}
            </h1>
          </div>

          <AnimatePresence mode="wait">
            {/* Step 1: Customer Details */}
            {currentStep === 'details' && (
              <motion.div
                key="details"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="grid grid-cols-1 lg:grid-cols-3 gap-8"
              >
                {/* Order Summary */}
                <div className="lg:col-span-1">
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
                            {item.serviceQuantity && (
                              <p className="text-xs text-muted-foreground">
                                ₹{((item.price * item.quantity) / item.serviceQuantity).toFixed(4)}/unit
                              </p>
                            )}
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
                      <Separator className="my-2" />
                      <div className="flex justify-between font-semibold text-lg">
                        <span>Total</span>
                        <span className="text-primary">{getSymbol()}{convert(total)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Customer Form */}
                <div className="lg:col-span-2">
                  <form onSubmit={handleDetailsSubmit} className="space-y-8">
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

                    <Button type="submit" className="w-full glass-button text-lg py-6">
                      Proceed to Payment
                    </Button>
                  </form>
                </div>
              </motion.div>
            )}

            {/* Step 2: UPI Payment */}
            {currentStep === 'payment' && (
              <motion.div
                key="payment"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="max-w-2xl mx-auto"
              >
                <div className="glass rounded-2xl p-8 text-center">
                  <div className="flex items-center justify-center gap-3 mb-6">
                    <Smartphone className="w-8 h-8 text-primary" />
                    <h2 className="font-clash text-2xl font-semibold text-primary">
                      UPI Payment
                    </h2>
                  </div>

                  <div className="mb-8">
                    <div className="w-64 h-64 mx-auto bg-white rounded-2xl p-4 flex items-center justify-center mb-4">
                      <QrCode className="w-48 h-48 text-gray-800" />
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">Scan QR code with any UPI app</p>
                    <div className="glass rounded-xl p-4">
                      <p className="font-medium text-primary">UPI ID: kuzzboost@paytm</p>
                      <p className="text-sm text-muted-foreground">Amount: ₹{total.toFixed(2)}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      After making the payment, click the button below to verify your transaction
                    </p>
                    <Button 
                      onClick={handleProceedToPayment}
                      className="w-full glass-button"
                    >
                      I have made the payment - Verify Now
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 3: Transaction Verification */}
            {currentStep === 'verify' && (
              <motion.div
                key="verify"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="max-w-2xl mx-auto"
              >
                <div className="glass rounded-2xl p-8">
                  <h2 className="font-clash text-2xl font-semibold text-primary text-center mb-6">
                    Verify Payment
                  </h2>

                  <div className="space-y-6">
                    <div>
                      <Label htmlFor="transactionId">Transaction ID / UTR Number *</Label>
                      <Input
                        id="transactionId"
                        value={transactionId}
                        onChange={(e) => setTransactionId(e.target.value)}
                        className="mt-1"
                        placeholder="Enter your transaction ID or UTR number"
                        required
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        You can find this in your UPI app under transaction history
                      </p>
                    </div>

                    <Button 
                      onClick={handleVerifyPayment}
                      disabled={loading || !transactionId.trim()}
                      className="w-full glass-button"
                    >
                      {loading ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Verifying Payment...
                        </div>
                      ) : (
                        'Verify Payment & Complete Order'
                      )}
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 4: Success */}
            {currentStep === 'success' && orderData && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-2xl mx-auto text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="w-24 h-24 bg-gradient-success rounded-full flex items-center justify-center mx-auto mb-6"
                >
                  <CheckCircle className="w-12 h-12 text-white" />
                </motion.div>

                <h2 className="font-clash text-3xl font-bold text-primary mb-4">
                  Order Placed Successfully!
                </h2>
                
                <div className="glass rounded-2xl p-6 mb-6">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Order ID:</span>
                      <span className="font-mono font-semibold">{orderData.orderId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Transaction ID:</span>
                      <span className="font-mono">{orderData.transactionId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Amount:</span>
                      <span className="font-semibold">₹{orderData.total.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Date:</span>
                      <span>{orderData.timestamp.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <Button 
                    onClick={generateInvoicePDF}
                    className="w-full glass-button flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Download Invoice (PDF)
                  </Button>
                  
                  <Button 
                    variant="outline"
                    onClick={() => navigate('/order-history')}
                    className="w-full"
                  >
                    View Order History
                  </Button>
                  
                  <Button 
                    variant="ghost"
                    onClick={() => navigate('/services')}
                    className="w-full"
                  >
                    Continue Shopping
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Checkout;