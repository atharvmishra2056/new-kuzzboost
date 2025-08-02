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

  // Adjust navStyle to ensure no extra blank bar appears and fix type error
  const navStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    width: '100%',
    zIndex: 1000,
    background: 'rgba(245, 245, 220, 0.5)', // Beige background with transparency
    backdropFilter: 'blur(10px)', // Glassmorphism effect
    borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
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
        <div className="text-2xl font-bold">KuzzBoost</div>
        <div className="hidden md:flex space-x-6 relative">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <Link to="/about" className="hover:text-primary transition-colors">About</Link>
          <Link to="/services" className="hover:text-primary transition-colors">Services</Link>
          <Link to="/contact" className="hover:text-primary transition-colors">Contact</Link>
        </div>
        <div className="hidden md:flex items-center space-x-4">
          {currentUser ? (
            <>
              <Link to="/wishlist" className="p-2 rounded-full hover:bg-accent transition-colors"><Heart className="w-5 h-5" /></Link>
              <button onClick={handleCartClick} className="relative p-2 rounded-full hover:bg-accent transition-colors">
                <ShoppingCart className="w-5 h-5" />
                {finalCartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-accent-peach text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{finalCartCount}</span>
                )}
              </button>
              <Link to="/account" className="p-2 rounded-full hover:bg-accent transition-colors"><User className="w-5 h-5" /></Link>
              <Button onClick={handleSignOut} variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/auth">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link to="/auth?tab=signup">
                <Button className="glass-button">Sign Up</Button>
              </Link>
            </div>
          )}
        </div>
        <div className="md:hidden">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 rounded-md hover:bg-background/20 transition-colors">
            <HamburgerIcon />
          </button>
        </div>
      </div>
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 top-[height-of-nav] bg-background/95 backdrop-blur-md z-50" style={{ background: 'rgba(245, 245, 220, 0.5)', backdropFilter: 'blur(10px)' }}>
          <div className="flex flex-col gap-6 p-6">
            <Link to="/" className="text-lg hover:text-primary transition-colors" onClick={() => setIsMenuOpen(false)}>Home</Link>
            <Link to="/about" className="text-lg hover:text-primary transition-colors" onClick={() => setIsMenuOpen(false)}>About</Link>
            <Link to="/services" className="text-lg hover:text-primary transition-colors" onClick={() => setIsMenuOpen(false)}>Services</Link>
            <Link to="/contact" className="text-lg hover:text-primary transition-colors" onClick={() => setIsMenuOpen(false)}>Contact</Link>
            {currentUser ? (
              <>
                <Link to="/wishlist" className="text-lg hover:text-primary transition-colors" onClick={() => setIsMenuOpen(false)}>Wishlist</Link>
                <button onClick={() => { handleCartClick(); setIsMenuOpen(false); }} className="text-lg hover:text-primary transition-colors">
                  Cart
                </button>
                <Link to="/account" className="text-lg hover:text-primary transition-colors" onClick={() => setIsMenuOpen(false)}>My Account</Link>
                <button onClick={() => { handleSignOut(); setIsMenuOpen(false); }} className="text-lg hover:text-primary transition-colors w-full text-left">
                  Sign Out
                </button>
              </>
            ) : (
              <div className="px-4 py-2 space-y-3">
                <Link to="/auth" onClick={() => setIsMenuOpen(false)}><Button className="w-full">Sign In</Button></Link>
                <Link to="/auth?tab=signup" onClick={() => setIsMenuOpen(false)}><Button variant="outline" className="w-full">Sign Up</Button></Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;