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
import { Checkbox } from "@/components/ui/checkbox";

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
  const [credits, setCredits] = useState(0);
  const [useCredits, setUseCredits] = useState(false);

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

  useEffect(() => {
    if (currentUser) {
      const fetchCredits = async () => {
        const { data } = await (supabase as any).from('profiles').select('credits').eq('user_id', currentUser.id).single();
        setCredits(data?.credits || 0);
      };
      fetchCredits();
    }
  }, [currentUser]);

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
    if (!orderReview) {
      toast({
        title: "Validation Error",
        description: "Order data not found.",
        variant: "destructive",
      });
      return;
    }

    // If effective total is 0, no transaction ID needed
    if (effectiveTotal > 0 && !transactionId.trim()) {
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

      // If using credits, deduct only the required amount from user's account
      if (useCredits && canUseCredits) {
        console.log(`Using ${creditsToUse} credits (₹${actualRedeemable.toFixed(2)}) out of ${credits} available`);
        const { error: creditError } = await (supabase as any)
          .from('profiles')
          .update({ credits: credits - creditsToUse })
          .eq('user_id', currentUser!.id);
        
        if (creditError) {
          throw new Error('Failed to update credits: ' + creditError.message);
        }
      }

      const { error } = await supabase.from('orders').insert({
        order_id: orderId,
        user_id: currentUser!.id,
        user_email: currentUser!.email!,
        customer_info: orderReview.customerInfo as unknown as Json,
        items: orderReview.items as unknown as Json,
        total_amount: effectiveTotal, // Use the effective total (after credits)
        transaction_id: effectiveTotal > 0 ? transactionId.trim() : `CREDITS_${orderId}`,
        status: 'pending'
      });

      if (error) throw error;

      // Clear the cart after successful order placement
      await clearCart();

      // Clear stored data
      localStorage.removeItem('orderReviewData');

      navigate('/dashboard/checkout/success', {
        state: {
          orderDetails: { 
            ...orderReview, 
            orderId, 
            transactionId: effectiveTotal > 0 ? transactionId : `CREDITS_${orderId}`,
            totalAmount: effectiveTotal,
            creditsUsed: useCredits ? creditsToUse : 0,
            creditsRedeemedAmount: useCredits ? actualRedeemable : 0,
            finalAmountPaid: effectiveTotal
          },
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
  const maxRedeemable = (credits / 5) * 4; // 5 credits = ₹4 (max possible)
  const actualRedeemable = Math.min(maxRedeemable, totalAmount); // Only use what's needed
  const canUseCredits = credits >= 5; // Minimum 5 credits (₹4) to use
  const effectiveTotal = useCredits ? Math.max(0, totalAmount - actualRedeemable) : totalAmount;
  const creditsToUse = useCredits ? Math.ceil((actualRedeemable * 5) / 4) : 0; // Actual credits to be deducted

  return (
      <div className="px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/services')}
                className="flex items-center gap-2 py-2 px-3 text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Continue Shopping
            </Button>
            <h1 className="font-clash text-2xl md:text-4xl font-bold text-primary">
              Checkout
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
                                              <div className="space-y-5">
                        <div className="text-center">
                          <Smartphone className="w-10 h-10 text-accent-peach mx-auto mb-3" />
                          <h3 className="font-clash text-lg font-semibold text-primary mb-2">
                            {effectiveTotal > 0 ? 'Pay with UPI' : 'Order Completed with Credits'}
                          </h3>
                          {effectiveTotal > 0 ? (
                            <p className="text-muted-foreground mb-5 text-sm">
                              Send exactly {getSymbol()}{convert(effectiveTotal)} to our UPI ID
                            </p>
                          ) : (
                            <p className="text-muted-foreground mb-5 text-sm">
                              Your order will be processed using your available credits.
                            </p>
                          )}
                        </div>
                        {canUseCredits && (
                          <div className="bg-accent/10 p-4 rounded-lg mb-4">
                            <div className="flex items-center gap-2 mb-2">
                              <Checkbox id="use-credits" checked={useCredits} onCheckedChange={(checked) => setUseCredits(!!checked)} />
                              <Label htmlFor="use-credits" className="font-medium">Use Credits</Label>
                            </div>
                            <div className="text-sm text-muted-foreground space-y-1">
                              <p>Available Credits: {credits} credits = ₹{maxRedeemable.toFixed(2)}</p>
                              <p className="text-xs">Minimum 5 credits required • 5 credits = ₹4</p>
                              {useCredits && (
                                <p className="text-sm font-medium text-primary">
                                  Will use: {creditsToUse} credits = ₹{actualRedeemable.toFixed(2)}
                                </p>
                              )}
                              {useCredits && (
                                <div className="space-y-1 mt-2 pt-2 border-t border-accent/20">
                                  <p>Original Amount: {getSymbol()}{convert(totalAmount)}</p>
                                  <p className="text-green-600">Credits Applied: -₹{actualRedeemable.toFixed(2)} ({creditsToUse} credits)</p>
                                  {actualRedeemable < maxRedeemable && (
                                    <p className="text-xs text-muted-foreground">
                                      Remaining: {credits - creditsToUse} credits = ₹{(maxRedeemable - actualRedeemable).toFixed(2)}
                                    </p>
                                  )}
                                  <p className="font-medium text-lg">Final Amount: {getSymbol()}{convert(effectiveTotal)}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                        {effectiveTotal > 0 && (
                          <div className="grid grid-cols-1 gap-5">
                          <div className="glass rounded-xl p-3 flex items-center justify-center">
                            <img
                                src="/upi-qr.png" // Path to the image in the 'public' folder
                                alt="UPI QR Code for KuzzBoost"
                                className="rounded-lg w-full h-full object-contain"
                            />
                          </div>
                          <p className="text-xs text-muted-foreground mb-2">Scan QR code with any UPI app</p>
                                                      <div className="glass rounded-xl p-3">
                            <div className="flex items-center justify-center gap-2">
                              <p className="font-medium text-primary font-mono text-sm">UPI ID: {upiId}</p>
                              <Button variant="ghost" size="icon" onClick={handleCopyUpiId} className="h-8 w-8">
                                {isCopied ? <CheckCircle className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-muted-foreground" />}
                              </Button>
                            </div>
                            <p className="text-xs text-muted-foreground">Amount: {getSymbol()}{convert(effectiveTotal)}</p>
                          </div>
                        </div>
                        )}

                        <div className="space-y-4">
                          {effectiveTotal > 0 ? (
                            <>
                              <p className="text-sm text-muted-foreground">
                                After making the payment, click the button below to verify your transaction.
                              </p>
                              <Button
                                  onClick={() => setCurrentStep('verify')}
                                  className="w-full glass-button py-2 text-base"
                              >
                                I have paid - Verify Now
                              </Button>
                            </>
                          ) : (
                            <>
                              <p className="text-sm text-muted-foreground">
                                Your order will be completed using credits only. No payment required.
                              </p>
                              <Button
                                  onClick={handleVerifyPayment}
                                  disabled={loading}
                                  className="w-full glass-button py-2 text-base"
                              >
                                {loading ? 'Processing...' : 'Complete Order with Credits'}
                              </Button>
                            </>
                          )}
                        </div>
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
                      <h2 className="font-clash text-xl font-semibold text-primary text-center mb-5">
                        Verify Payment
                      </h2>

                      <div className="space-y-5">
                        <div>
                          <Label htmlFor="transactionId" className="text-sm">Transaction ID / UTR Number *</Label>
                          <Input
                              id="transactionId"
                              value={transactionId}
                              onChange={(e) => setTransactionId(e.target.value)}
                              className="mt-1 py-2 text-sm"
                              placeholder="Enter your transaction ID"
                              required
                          />
                          <p className="text-xs text-muted-foreground mt-1">
                            You can find this in your UPI app's transaction history.
                          </p>
                        </div>

                        <Button
                            onClick={handleVerifyPayment}
                            disabled={loading || (effectiveTotal > 0 && !transactionId.trim())}
                            className="w-full glass-button py-2 text-base"
                        >
                          {loading ? (
                              <div className="flex items-center justify-center gap-2">
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                {effectiveTotal > 0 ? 'Verifying...' : 'Processing...'}
                              </div>
                          ) : (
                              effectiveTotal > 0 ? 'Verify & Complete Order' : 'Complete Order with Credits'
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
