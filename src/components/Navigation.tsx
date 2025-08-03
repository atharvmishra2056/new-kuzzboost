// src/components/Navigation.tsx

import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Menu, X, ShoppingCart, User, LogOut, Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { Button } from "./ui/button";
import { useToast } from "@/hooks/use-toast"; // Import useToast

interface NavigationProps {
  cartItemCount?: number;
  onCartClick?: () => void;
}

const Navigation = ({ cartItemCount, onCartClick }: NavigationProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { currentUser, signOut } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const { toast } = useToast(); // Initialize toast
  const location = useLocation();

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      console.error('Sign out error:', error);
      toast({
        title: "Sign Out Failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      navigate('/');
    }
  };

  const handleCartClick = () => {
    if (onCartClick) {
      onCartClick();
    } else {
      navigate('/cart');
    }
  };

  const finalCartCount = cartItemCount ?? cartCount;

  // Enhanced glassmorphism navigation style
  const navStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    width: '100%',
    zIndex: 1000,
    background: 'rgba(255, 255, 255, 0.1)', // More transparent glassmorphism
    backdropFilter: 'blur(20px)', // Enhanced glassmorphism effect
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  };

  const HamburgerIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="3" y1="12" x2="21" y2="12"></line>
      <line x1="3" y1="6" x2="21" y2="6"></line>
      <line x1="3" y1="18" x2="21" y2="18"></line>
    </svg>
  );

  return (
    <nav style={navStyle} className="w-full py-4">
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Logo with image */}
        <Link to="/" className="flex items-center gap-3">
          <img 
            src="/site_logo.png" 
            alt="KuzzBoost Logo" 
            className="w-8 h-8 object-contain"
          />
          <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 bg-clip-text text-transparent">
            KuzzBoost
          </div>
        </Link>
        
        <div className="hidden md:flex space-x-6 relative">
          <Link to="/" className="hover:text-primary transition-colors font-medium">Home</Link>
          <Link to="/about" className="hover:text-primary transition-colors font-medium">About</Link>
          <Link to="/services" className="hover:text-primary transition-colors font-medium">Services</Link>
          <Link to="/contact" className="hover:text-primary transition-colors font-medium">Contact</Link>
        </div>
        
        <div className="hidden md:flex items-center space-x-4">
          {currentUser ? (
            <>
              <Link to="/wishlist" className="p-2 rounded-full hover:bg-white/20 transition-colors backdrop-blur-sm">
                <Heart className="w-5 h-5" />
              </Link>
              <button onClick={handleCartClick} className="relative p-2 rounded-full hover:bg-white/20 transition-colors backdrop-blur-sm">
                <ShoppingCart className="w-5 h-5" />
                {finalCartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gradient-to-r from-pink-500 to-orange-400 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {finalCartCount}
                  </span>
                )}
              </button>
              <Link to="/account" className="p-2 rounded-full hover:bg-white/20 transition-colors backdrop-blur-sm">
                <User className="w-5 h-5" />
              </Link>
              <Button onClick={handleSignOut} variant="ghost" size="sm" className="text-muted-foreground hover:text-primary hover:bg-white/20 backdrop-blur-sm">
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/auth">
                <Button variant="ghost" className="hover:bg-white/20 backdrop-blur-sm">Sign In</Button>
              </Link>
              <Link to="/auth?tab=signup">
                <Button className="bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 text-white hover:opacity-90 transition-opacity">
                  Sign Up
                </Button>
              </Link>
            </div>
          )}
        </div>
        
        <div className="md:hidden">
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)} 
            className="p-2 rounded-md hover:bg-white/20 transition-colors backdrop-blur-sm"
            aria-label="Toggle navigation menu"
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <HamburgerIcon />}
          </button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            className="md:hidden fixed inset-0 top-[70px] bg-white/10 backdrop-blur-md z-50 overflow-y-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex flex-col gap-4 p-4 pb-8">
              <Link 
                to="/" 
                className="text-lg hover:text-primary transition-colors font-medium py-2 px-4 rounded-lg hover:bg-white/20"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/about" 
                className="text-lg hover:text-primary transition-colors font-medium py-2 px-4 rounded-lg hover:bg-white/20"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link 
                to="/services" 
                className="text-lg hover:text-primary transition-colors font-medium py-2 px-4 rounded-lg hover:bg-white/20"
                onClick={() => setIsMenuOpen(false)}
              >
                Services
              </Link>
              <Link 
                to="/contact" 
                className="text-lg hover:text-primary transition-colors font-medium py-2 px-4 rounded-lg hover:bg-white/20"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
              {currentUser ? (
                <>
                  <Link 
                    to="/wishlist" 
                    className="text-lg hover:text-primary transition-colors font-medium py-2 px-4 rounded-lg hover:bg-white/20"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Wishlist
                  </Link>
                  <button 
                    onClick={() => { handleCartClick(); setIsMenuOpen(false); }} 
                    className="text-lg hover:text-primary transition-colors font-medium text-left py-2 px-4 rounded-lg hover:bg-white/20"
                  >
                    Cart {finalCartCount > 0 && `(${finalCartCount})`}
                  </button>
                  <Link 
                    to="/account" 
                    className="text-lg hover:text-primary transition-colors font-medium py-2 px-4 rounded-lg hover:bg-white/20"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    My Account
                  </Link>
                  <button 
                    onClick={() => { handleSignOut(); setIsMenuOpen(false); }} 
                    className="text-lg hover:text-primary transition-colors font-medium w-full text-left py-2 px-4 rounded-lg hover:bg-white/20"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <div className="px-4 py-2 space-y-3">
                  <Link to="/auth" onClick={() => setIsMenuOpen(false)}>
                    <Button className="w-full bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 text-white py-3">Sign In</Button>
                  </Link>
                  <Link to="/auth?tab=signup" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="outline" className="w-full border-white/20 hover:bg-white/10 py-3">Sign Up</Button>
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navigation;