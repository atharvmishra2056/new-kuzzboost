import { useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { CheckCircle, Download, Home, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import { useCurrency } from "../context/CurrencyContext";

const CheckoutSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { getSymbol, convert } = useCurrency();

  const orderDetails = location.state?.orderDetails;
  const customerInfo = location.state?.customerInfo;

  useEffect(() => {
    if (!orderDetails) {
      navigate('/services');
    }
  }, [orderDetails, navigate]);

  if (!orderDetails) {
    return <div>Loading...</div>;
  }

  const orderId = `KZ${Date.now().toString().slice(-8)}`;

  return (
    <div className="min-h-screen bg-gradient-hero">
      <Navigation />
      
      <div className="pt-20 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Success Animation */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, type: "spring" }}
            className="text-center mb-8"
          >
            <div className="w-24 h-24 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-success" />
            </div>
            <h1 className="font-clash text-4xl md:text-5xl font-bold text-primary mb-4">
              Payment Successful!
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Thank you for your order. Your social media growth services are being processed.
            </p>
          </motion.div>

          {/* Order Summary */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="glass rounded-2xl p-6 mb-8"
          >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
              <div>
                <h2 className="font-clash text-2xl font-semibold text-primary mb-2">
                  Order #{orderId}
                </h2>
                <p className="text-muted-foreground">
                  Placed on {new Date().toLocaleDateString('en-IN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
              <div className="text-right mt-4 md:mt-0">
                <p className="text-sm text-muted-foreground">Total Paid</p>
                <p className="font-clash text-3xl font-bold text-primary">
                  {getSymbol()}{convert(orderDetails.total)}
                </p>
              </div>
            </div>

            {/* Order Items */}
            <div className="space-y-4">
              <h3 className="font-semibold text-primary">Services Ordered:</h3>
              {orderDetails.items.map((item: any) => (
                <div key={item.id} className="flex items-center gap-4 p-4 bg-background/50 rounded-xl">
                  <div className="text-2xl">{item.icon}</div>
                  <div className="flex-1">
                    <h4 className="font-medium text-primary">{item.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {item.platform} • Quantity: {item.quantity}
                    </p>
                    {item.serviceQuantity && (
                      <p className="text-sm text-accent-peach">
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
          </motion.div>

          {/* What's Next */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="glass rounded-2xl p-6 mb-8"
          >
            <h3 className="font-clash text-xl font-semibold text-primary mb-4">
              What happens next?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-accent-peach/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Package className="w-6 h-6 text-accent-peach" />
                </div>
                <h4 className="font-semibold text-primary mb-2">Order Processing</h4>
                <p className="text-sm text-muted-foreground">
                  We're preparing your services for delivery
                </p>
              </div>
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-accent-mint/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="w-6 h-6 text-accent-mint" />
                </div>
                <h4 className="font-semibold text-primary mb-2">Service Delivery</h4>
                <p className="text-sm text-muted-foreground">
                  Your services will be delivered within 24-48 hours
                </p>
              </div>
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-accent-lavender/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Download className="w-6 h-6 text-accent-lavender" />
                </div>
                <h4 className="font-semibold text-primary mb-2">Track Progress</h4>
                <p className="text-sm text-muted-foreground">
                  Monitor your growth in your dashboard
                </p>
              </div>
            </div>
          </motion.div>

          {/* Customer Information */}
          {customerInfo && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="glass rounded-2xl p-6 mb-8"
            >
              <h3 className="font-clash text-xl font-semibold text-primary mb-4">
                Customer Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-primary mb-2">Contact Details</h4>
                  <p className="text-sm text-muted-foreground">
                    {customerInfo.firstName} {customerInfo.lastName}
                  </p>
                  <p className="text-sm text-muted-foreground">{customerInfo.email}</p>
                  <p className="text-sm text-muted-foreground">{customerInfo.phone}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-primary mb-2">Billing Address</h4>
                  <p className="text-sm text-muted-foreground">{customerInfo.address}</p>
                  <p className="text-sm text-muted-foreground">
                    {customerInfo.city}, {customerInfo.postalCode}
                  </p>
                  <p className="text-sm text-muted-foreground">{customerInfo.country}</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Action Buttons */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link to="/order-history">
              <Button className="glass-button flex items-center gap-2 w-full sm:w-auto">
                <Package className="w-4 h-4" />
                View Order History
              </Button>
            </Link>
            <Link to="/">
              <Button variant="outline" className="flex items-center gap-2 w-full sm:w-auto">
                <Home className="w-4 h-4" />
                Back to Home
              </Button>
            </Link>
          </motion.div>

          {/* Support Information */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.1 }}
            className="text-center mt-8 p-6 bg-accent-peach/10 rounded-2xl"
          >
            <h4 className="font-semibold text-primary mb-2">Need Help?</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Our 24/7 support team is here to assist you with any questions about your order.
            </p>
            <div className="flex flex-col sm:flex-row gap-2 justify-center text-sm">
              <span className="text-muted-foreground">
                Email: <a href="mailto:support@kuzzboost.com" className="text-accent-peach hover:underline">support@kuzzboost.com</a>
              </span>
              <span className="hidden sm:inline text-muted-foreground">•</span>
              <span className="text-muted-foreground">
                WhatsApp: <a href="#" className="text-accent-peach hover:underline">+91 9876543210</a>
              </span>
            </div>
          </motion.div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default CheckoutSuccess;