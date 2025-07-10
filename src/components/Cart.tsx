import { useState } from "react";
import { X, Plus, Minus, ShoppingCart, CreditCard, Trash2 } from "lucide-react";

interface CartItem {
  id: number;
  title: string;
  platform: string;
  icon: string;
  price: number;
  quantity: number;
  maxQuantity: number;
}

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: number, quantity: number) => void;
  onRemoveItem: (id: number) => void;
  onClearCart: () => void;
}

const Cart = ({ 
  isOpen, 
  onClose, 
  items, 
  onUpdateQuantity, 
  onRemoveItem, 
  onClearCart 
}: CartProps) => {
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const handleCheckout = () => {
    setIsCheckingOut(true);
    // Simulate checkout process
    setTimeout(() => {
      alert('Checkout successful! Your order has been placed.');
      onClearCart();
      setIsCheckingOut(false);
      onClose();
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Cart Panel */}
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-gradient-glass border-l border-border backdrop-blur-xl">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border/50">
            <div className="flex items-center gap-3">
              <ShoppingCart className="w-6 h-6 text-primary" />
              <h2 className="font-clash text-xl font-semibold text-primary">
                Cart ({itemCount})
              </h2>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 glass rounded-lg flex items-center justify-center hover:scale-110 transition-transform duration-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-6">
            {items.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🛒</div>
                <h3 className="font-clash text-lg font-semibold text-primary mb-2">
                  Your cart is empty
                </h3>
                <p className="text-muted-foreground text-sm">
                  Add some services to get started!
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="glass rounded-xl p-4 space-y-4"
                  >
                    {/* Item Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">{item.icon}</div>
                        <div>
                          <h4 className="font-semibold text-primary text-sm">
                            {item.title}
                          </h4>
                          <p className="text-xs text-muted-foreground">
                            {item.platform}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => onRemoveItem(item.id)}
                        className="w-6 h-6 text-muted-foreground hover:text-destructive transition-colors duration-200"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                          className="w-7 h-7 glass rounded-lg flex items-center justify-center hover:scale-110 transition-transform duration-200"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="font-medium text-primary min-w-[40px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, Math.min(item.maxQuantity, item.quantity + 1))}
                          className="w-7 h-7 glass rounded-lg flex items-center justify-center hover:scale-110 transition-transform duration-200"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-primary">
                          ${(item.price * item.quantity).toFixed(2)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          ${item.price.toFixed(2)} each
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="border-t border-border/50 p-6 space-y-4">
              {/* Clear Cart */}
              <button
                onClick={onClearCart}
                className="w-full text-sm text-muted-foreground hover:text-destructive transition-colors duration-200"
              >
                Clear Cart
              </button>

              {/* Total */}
              <div className="glass rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-muted-foreground">Subtotal:</span>
                  <span className="font-semibold">${total.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-muted-foreground">Processing Fee:</span>
                  <span className="font-semibold">Free</span>
                </div>
                <div className="border-t border-border/30 pt-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-primary">Total:</span>
                    <span className="font-clash text-xl font-bold text-primary">
                      ${total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleCheckout}
                disabled={isCheckingOut}
                className="w-full glass-button flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCheckingOut ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4" />
                    Checkout Now
                  </>
                )}
              </button>

              {/* Security Notice */}
              <p className="text-xs text-muted-foreground text-center">
                🔒 Secure checkout with SSL encryption
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;