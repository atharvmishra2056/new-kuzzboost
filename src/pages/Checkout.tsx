import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Smartphone, CheckCircle, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion, AnimatePresence } from "framer-motion";
import { useCurrency } from "../context/CurrencyContext";
import { useAuth } from "../context/AuthContext";
import { supabase } from '@/integrations/supabase/client';
import { Json } from "@/integrations/supabase/types";
import { useToast } from "@/components/ui/use-toast";
import { useCart } from "../context/CartContext";

// --- Interfaces ---
interface CheckoutItem {
  id: number;
  title: string;
  platform: string;
  iconName?: string;
  price: number;
  quantity: number;
  service_quantity?: number;
}

interface CustomerInfo {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  country: string;
  address: string;
  city: string;
  postalCode: string;
}

interface OrderReviewData {
  items: CheckoutItem[];
  customerInfo: CustomerInfo;
  totalAmount: number;
}

// --- MAIN CHECKOUT PAGE COMPONENT ---
const Checkout = () => {
  const navigate = useNavigate();
  const { getSymbol, convert } = useCurrency();
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const { clearCart } = useCart();

  const [orderReview, setOrderReview] = useState<OrderReviewData | null>(null);
  const [currentStep, setCurrentStep] = useState<'payment' | 'verify'>('payment');
  const [loading, setLoading] = useState(false);
  const [transactionId, setTransactionId] = useState("");
  const [isCopied, setIsCopied] = useState(false);

  // --- UPDATED UPI ID ---
  const upiId = "7389556886@fam";

  useEffect(() => {
    if (!currentUser) {
      navigate('/auth', {
        state: {
          returnTo: '/checkout',
          message: 'Please log in to proceed with your order'
        }
      });
      return;
    }

    const savedOrderData = localStorage.getItem('orderReviewData');
    if (!savedOrderData) {
      navigate('/services');
      return;
    }

    setOrderReview(JSON.parse(savedOrderData));
  }, [currentUser, navigate]);

  const handleCopyUpiId = () => {
    navigator.clipboard.writeText(upiId);
    setIsCopied(true);
    toast({
      title: "UPI ID Copied!",
      description: "You can now paste it in your UPI app.",
    });
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleVerifyPayment = async () => {
    if (!transactionId.trim() || !orderReview) {
      toast({
        title: "Validation Error",
        description: "Please enter a valid Transaction ID.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const orderId = `KZB-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

      const { error } = await supabase.from('orders').insert({
        order_id: orderId,
        user_id: currentUser!.id,
        user_email: currentUser!.email!,
        customer_info: orderReview.customerInfo as unknown as Json,
        items: orderReview.items as unknown as Json,
        total_amount: orderReview.totalAmount,
        transaction_id: transactionId.trim(),
        status: 'pending'
      });

      if (error) throw error;

      // Clear the cart after successful order placement
      await clearCart();

      // Clear stored data
      localStorage.removeItem('orderReviewData');

      navigate('/dashboard/checkout/success', {
        state: {
          orderDetails: { ...orderReview, orderId, transactionId },
          customerInfo: orderReview.customerInfo
        }
      });

    } catch (error) {
      console.error('Error creating order:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
      toast({
        title: "Order Creation Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!orderReview) {
    return (
        <div className="flex items-center justify-center min-h-[70vh]">
          <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
        </div>
    );
  }

  const { totalAmount } = orderReview;

  return (
      <div className="px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
              <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/dashboard/checkout/review')}
                  className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Review
              </Button>
              <h1 className="font-clash text-3xl md:text-4xl font-bold text-primary">
                Payment
              </h1>
            </div>

            <AnimatePresence mode="wait">
              {/* UPI Payment Step */}
              {currentStep === 'payment' && (
                  <motion.div
                      key="payment"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                  >
                    <div className="glass rounded-2xl p-8 text-center">
                      <div className="flex items-center justify-center gap-3 mb-6">
                        <Smartphone className="w-8 h-8 text-primary" />
                        <h2 className="font-clash text-2xl font-semibold text-primary">
                          UPI Payment
                        </h2>
                      </div>

                      <div className="mb-8">
                        {/* --- UPDATED QR CODE IMAGE --- */}
                        <div className="w-64 h-64 mx-auto bg-white rounded-2xl p-2 flex items-center justify-center mb-4 border-4 border-primary/20 shadow-lg">
                          <img
                              src="/upi-qr.png" // Path to the image in the 'public' folder
                              alt="UPI QR Code for KuzzBoost"
                              className="rounded-lg w-full h-full object-contain"
                          />
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">Scan QR code with any UPI app</p>
                        <div className="glass rounded-xl p-4">
                          <div className="flex items-center justify-center gap-2">
                            <p className="font-medium text-primary font-mono">UPI ID: {upiId}</p>
                            <Button variant="ghost" size="icon" onClick={handleCopyUpiId}>
                              {isCopied ? <CheckCircle className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5 text-muted-foreground" />}
                            </Button>
                          </div>
                          <p className="text-sm text-muted-foreground">Amount: {getSymbol()}{convert(totalAmount)}</p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <p className="text-sm text-muted-foreground">
                          After making the payment, click the button below to verify your transaction.
                        </p>
                        <Button
                            onClick={() => setCurrentStep('verify')}
                            className="w-full glass-button"
                        >
                          I have paid - Verify Now
                        </Button>
                      </div>
                    </div>
                  </motion.div>
              )}

              {/* Verification Step */}
              {currentStep === 'verify' && (
                  <motion.div
                      key="verify"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
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
                              placeholder="Enter your transaction ID"
                              required
                          />
                          <p className="text-xs text-muted-foreground mt-1">
                            You can find this in your UPI app's transaction history.
                          </p>
                        </div>

                        <Button
                            onClick={handleVerifyPayment}
                            disabled={loading || !transactionId.trim()}
                            className="w-full glass-button"
                        >
                          {loading ? (
                              <div className="flex items-center justify-center gap-2">
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Verifying...
                              </div>
                          ) : (
                              'Verify & Complete Order'
                          )}
                        </Button>
                      </div>
                    </div>
                  </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
  );
};

export default Checkout;
