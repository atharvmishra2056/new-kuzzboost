import { useNavigate } from "react-router-dom";
import { ArrowLeft, ShoppingCart, Plus, Minus, Trash2, Link as LinkIcon } from "lucide-react"; // Added LinkIcon
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/context/CartContext";
import { useCurrency } from "@/context/CurrencyContext";
import { motion } from "framer-motion";

const ViewCart = () => {
  const navigate = useNavigate();
  const { cartItems, updateCartItemQuantity, removeFromCart, clearCart } = useCart();
  const { getSymbol, convert } = useCurrency();

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const subtotal = getTotalPrice();

  if (cartItems.length === 0) {
    return (
        <div className="px-4 sm:px-6 flex items-center justify-center min-h-[70vh]">
          <div className="text-center">
            <ShoppingCart className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <h2 className="font-clash text-xl font-bold text-primary mb-2">Your cart is empty</h2>
            <p className="text-muted-foreground mb-5">Add some services to continue</p>
            <Button onClick={() => navigate('/dashboard/services')} className="glass-button py-2 px-4 text-base">
              Browse Services
            </Button>
          </div>
        </div>
    );
  }

  return (
      <div className="px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
              <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/dashboard/services')}
                  className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Continue Shopping
              </Button>
              <h1 className="font-clash text-2xl md:text-4xl font-bold text-primary">
                Your Cart ({cartItems.length} items)
              </h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass rounded-2xl p-6"
                >
                  <div className="space-y-4">
                    {cartItems.map((item, index) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-start gap-3 p-3 glass rounded-xl"
                        >
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-primary text-base">{item.title}</h4>
                            <p className="text-xs text-muted-foreground">{item.platform}</p>
                            {item.service_quantity && (
                                <p className="text-xs text-accent-peach">
                                  {item.service_quantity.toLocaleString()} units
                                </p>
                            )}
                            {/* ADDED: Display the userInput */}
                            <div className="flex items-center gap-2 mt-2 text-xs text-primary/80">
                              <LinkIcon className="w-3 h-3 flex-shrink-0" />
                              <p className="truncate font-mono text-xs font-semibold">{item.userInput}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 flex-shrink-0">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => updateCartItemQuantity(item.id, item.quantity - 1)}
                                className="h-8 w-8 p-0"
                            >
                              <Minus className="w-3 h-3" />
                            </Button>
                            <span className="w-8 text-center">{item.quantity}</span>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => updateCartItemQuantity(item.id, item.quantity + 1)}
                                className="h-8 w-8 p-0"
                            >
                              <Plus className="w-3 h-3" />
                            </Button>
                          </div>

                          <div className="text-right flex-shrink-0">
                            <p className="font-semibold text-primary">
                              {getSymbol()}{convert(item.price * item.quantity)}
                            </p>
                          </div>

                          <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFromCart(item.id)}
                              className="text-red-500 hover:text-red-700 flex-shrink-0 p-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </motion.div>
                    ))}
                  </div>

                  <Separator className="my-6" />

                  <div className="flex justify-between items-center">
                    <Button
                        variant="outline"
                        onClick={clearCart}
                        className="text-red-500 hover:text-red-700"
                    >
                      Clear Cart
                    </Button>
                  </div>
                </motion.div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="glass rounded-2xl p-6 sticky top-24"
                >
                  <h2 className="font-clash text-xl font-semibold text-primary mb-4">
                    Order Summary
                  </h2>

                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal ({cartItems.length} items)</span>
                      <span>{getSymbol()}{convert(subtotal)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total</span>
                      <span className="text-primary">{getSymbol()}{convert(subtotal)}</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Button
                        onClick={() => navigate('/dashboard/checkout/review')}
                        className="w-full glass-button text-base py-4"
                    >
                      Proceed to Checkout
                    </Button>

                    <Button
                        variant="secondary"
                        onClick={() => navigate('/dashboard/services')}
                        className="w-full text-base py-4"
                    >
                      Continue Shopping
                    </Button>
                  </div>

                  <p className="text-xs text-muted-foreground text-center mt-4">
                    Secure checkout with 256-bit SSL encryption
                  </p>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
  );
};

export default ViewCart;