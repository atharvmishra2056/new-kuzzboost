// src/components/Navigation.tsx

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, ShoppingCart, User, LogOut, Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { Button } from "./ui/button";

interface NavigationProps {
  cartItemCount?: number;
  onCartClick?: () => void;
}

const Navigation = ({ cartItemCount, onCartClick }: NavigationProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { currentUser, signOut } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Sign out error:', error);
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

  return (
      <motion.nav
          className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-md border-b border-border/20"
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link to="/" className="text-2xl font-clash font-bold text-primary">KuzzBoost</Link>
            </motion.div>

            <div className="hidden md:flex items-center space-x-8">
              <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">Home</Link>
              <Link to="/services" className="text-muted-foreground hover:text-primary transition-colors">Services</Link>
              <Link to="/about" className="text-muted-foreground hover:text-primary transition-colors">About</Link>
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
                  // Updated this section to include Sign Up button
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
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 rounded-md text-muted-foreground hover:text-primary hover:bg-accent transition-colors">
                <AnimatePresence mode="wait">
                  {isMenuOpen ? (
                      <motion.div key="close" initial={{ rotate: -90 }} animate={{ rotate: 0 }} exit={{ rotate: 90 }} transition={{ duration: 0.2 }}><X className="w-6 h-6" /></motion.div>
                  ) : (
                      <motion.div key="menu" initial={{ rotate: 90 }} animate={{ rotate: 0 }} exit={{ rotate: -90 }} transition={{ duration: 0.2 }}><Menu className="w-6 h-6" /></motion.div>
                  )}
                </AnimatePresence>
              </button>
            </div>
          </div>

          <AnimatePresence>
            {isMenuOpen && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3 }} className="md:hidden border-t border-border/20 bg-card/95 backdrop-blur-sm">
                  <div className="py-4 space-y-4">
                    <Link to="/" className="block px-4 py-2 text-muted-foreground hover:text-primary transition-colors" onClick={() => setIsMenuOpen(false)}>Home</Link>
                    <Link to="/services" className="block px-4 py-2 text-muted-foreground hover:text-primary transition-colors" onClick={() => setIsMenuOpen(false)}>Services</Link>
                    <Link to="/about" className="block px-4 py-2 text-muted-foreground hover:text-primary transition-colors" onClick={() => setIsMenuOpen(false)}>About</Link>

                    {currentUser ? (
                        <>
                          <div className="flex items-center justify-between px-4 py-2">
                            <Link to="/wishlist" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors" onClick={() => setIsMenuOpen(false)}><Heart className="w-5 h-5" />Wishlist</Link>
                            <button onClick={() => { handleCartClick(); setIsMenuOpen(false); }} className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                              <div className="relative">
                                <ShoppingCart className="w-5 h-5" />
                                {finalCartCount > 0 && (<span className="absolute -top-2 -right-2 bg-accent-peach text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">{finalCartCount}</span>)}
                              </div>
                              Cart
                            </button>
                          </div>
                          <Link to="/account" className="flex items-center gap-2 px-4 py-2 text-muted-foreground hover:text-primary transition-colors" onClick={() => setIsMenuOpen(false)}><User className="w-5 h-5" />My Account</Link>
                          <button onClick={() => { handleSignOut(); setIsMenuOpen(false); }} className="flex items-center gap-2 px-4 py-2 text-muted-foreground hover:text-primary transition-colors w-full text-left"><LogOut className="w-5 h-5" />Sign Out</button>
                        </>
                    ) : (
                        // Updated this section for mobile
                        <div className="px-4 py-2 space-y-2">
                          <Link to="/auth" onClick={() => setIsMenuOpen(false)}><Button className="w-full">Sign In</Button></Link>
                          <Link to="/auth?tab=signup" onClick={() => setIsMenuOpen(false)}><Button variant="outline" className="w-full">Sign Up</Button></Link>
                        </div>
                    )}
                  </div>
                </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.nav>
  );
};

export default Navigation;