// src/components/EnhancedNavigation.tsx

import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Menu, X, ShoppingCart, User, LogOut, Heart, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { Button } from "./ui/button";
import { useToast } from "@/hooks/use-toast";

interface NavigationProps {
  cartItemCount?: number;
  onCartClick?: () => void;
}

const EnhancedNavigation = ({ cartItemCount, onCartClick }: NavigationProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const { currentUser, signOut } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const { toast } = useToast();
  const location = useLocation();

  // Handle scroll effects
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 50);
      setShowBackToTop(scrollTop > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const finalCartCount = cartItemCount ?? cartCount;

  const HamburgerIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="3" y1="12" x2="21" y2="12"></line>
      <line x1="3" y1="6" x2="21" y2="6"></line>
      <line x1="3" y1="18" x2="21" y2="18"></line>
    </svg>
  );

  return (
    <>
      {/* Enhanced Navigation Bar */}
      <motion.nav
        className={`fixed top-0 w-full z-50 transition-all duration-500 ${
          isScrolled 
            ? 'py-2 mx-4 mt-4 rounded-2xl shadow-2xl' 
            : 'py-4 mx-0 mt-0 rounded-none'
        }`}
        style={{
          background: isScrolled 
            ? 'rgba(255, 255, 255, 0.15)' 
            : 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(20px)',
          borderBottom: isScrolled 
            ? 'none' 
            : '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: isScrolled 
            ? '0 20px 40px rgba(0, 0, 0, 0.15)' 
            : '0 8px 32px rgba(0, 0, 0, 0.1)',
          width: isScrolled ? 'calc(100% - 2rem)' : '100%',
          left: isScrolled ? '1rem' : '0',
          right: isScrolled ? '1rem' : '0',
        }}
        initial={false}
        animate={{
          width: isScrolled ? 'calc(100% - 2rem)' : '100%',
          left: isScrolled ? '1rem' : '0',
          marginTop: isScrolled ? '1rem' : '0',
        }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        <div className={`container mx-auto px-4 flex items-center justify-between ${
          isScrolled ? 'max-w-6xl' : ''
        }`}>
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <motion.img 
              src="/site_logo.png" 
              alt="KuzzBoost Logo" 
              className="w-8 h-8 object-contain"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ duration: 0.2 }}
            />
            <motion.div 
              className="text-2xl font-bold bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 bg-clip-text text-transparent"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              KuzzBoost
            </motion.div>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-6 relative">
            <Link to="/" className="hover:text-primary transition-colors font-medium relative group">
              Home
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-pink-500 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link to="/about" className="hover:text-primary transition-colors font-medium relative group">
              About
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-pink-500 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link to="/services" className="hover:text-primary transition-colors font-medium relative group">
              Services
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-pink-500 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link to="/contact" className="hover:text-primary transition-colors font-medium relative group">
              Contact
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-pink-500 transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </div>
          
          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {currentUser ? (
              <>
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                  <Link to="/wishlist" className="p-2 rounded-full hover:bg-white/20 transition-colors backdrop-blur-sm">
                    <Heart className="w-5 h-5" />
                  </Link>
                </motion.div>
                <motion.button 
                  onClick={handleCartClick} 
                  className="relative p-2 rounded-full hover:bg-white/20 transition-colors backdrop-blur-sm"
                  whileHover={{ scale: 1.1 }} 
                  whileTap={{ scale: 0.95 }}
                >
                  <ShoppingCart className="w-5 h-5" />
                  {finalCartCount > 0 && (
                    <motion.span 
                      className="absolute -top-1 -right-1 bg-gradient-to-r from-pink-500 to-orange-400 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    >
                      {finalCartCount}
                    </motion.span>
                  )}
                </motion.button>
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                  <Link to="/account" className="p-2 rounded-full hover:bg-white/20 transition-colors backdrop-blur-sm">
                    <User className="w-5 h-5" />
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button onClick={handleSignOut} variant="ghost" size="sm" className="text-muted-foreground hover:text-primary hover:bg-white/20 backdrop-blur-sm">
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </Button>
                </motion.div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link to="/auth">
                    <Button variant="ghost" className="hover:bg-white/20 backdrop-blur-sm">Sign In</Button>
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link to="/auth?tab=signup">
                    <Button className="bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 text-white hover:opacity-90 transition-opacity">
                      Sign Up
                    </Button>
                  </Link>
                </motion.div>
              </div>
            )}
          </div>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <motion.button 
              onClick={() => setIsMenuOpen(!isMenuOpen)} 
              className="p-2 rounded-md hover:bg-white/20 transition-colors backdrop-blur-sm"
              aria-label="Toggle navigation menu"
              aria-expanded={isMenuOpen}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <HamburgerIcon />}
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            className="md:hidden fixed inset-0 top-[70px] bg-white/90 backdrop-blur-md z-40 overflow-y-auto"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex flex-col gap-4 p-4 pb-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Link 
                  to="/" 
                  className="text-lg hover:text-primary transition-colors font-medium py-2 px-4 rounded-lg hover:bg-white/20"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Home
                </Link>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Link 
                  to="/about" 
                  className="text-lg hover:text-primary transition-colors font-medium py-2 px-4 rounded-lg hover:bg-white/20"
                  onClick={() => setIsMenuOpen(false)}
                >
                  About
                </Link>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Link 
                  to="/services" 
                  className="text-lg hover:text-primary transition-colors font-medium py-2 px-4 rounded-lg hover:bg-white/20"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Services
                </Link>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Link 
                  to="/contact" 
                  className="text-lg hover:text-primary transition-colors font-medium py-2 px-4 rounded-lg hover:bg-white/20"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Contact
                </Link>
              </motion.div>
              {currentUser ? (
                <>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <Link 
                      to="/wishlist" 
                      className="text-lg hover:text-primary transition-colors font-medium py-2 px-4 rounded-lg hover:bg-white/20"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Wishlist
                    </Link>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    <button 
                      onClick={() => { handleCartClick(); setIsMenuOpen(false); }} 
                      className="text-lg hover:text-primary transition-colors font-medium text-left py-2 px-4 rounded-lg hover:bg-white/20"
                    >
                      Cart {finalCartCount > 0 && `(${finalCartCount})`}
                    </button>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 }}
                  >
                    <Link 
                      to="/account" 
                      className="text-lg hover:text-primary transition-colors font-medium py-2 px-4 rounded-lg hover:bg-white/20"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      My Account
                    </Link>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 }}
                  >
                    <button 
                      onClick={() => { handleSignOut(); setIsMenuOpen(false); }} 
                      className="text-lg hover:text-primary transition-colors font-medium w-full text-left py-2 px-4 rounded-lg hover:bg-white/20"
                    >
                      Sign Out
                    </button>
                  </motion.div>
                </>
              ) : (
                <motion.div 
                  className="px-4 py-2 space-y-3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <Link to="/auth" onClick={() => setIsMenuOpen(false)}>
                    <Button className="w-full bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 text-white py-3">Sign In</Button>
                  </Link>
                  <Link to="/auth?tab=signup" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="outline" className="w-full border-white/20 hover:bg-white/10 py-3">Sign Up</Button>
                  </Link>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Back to Top Button */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 z-50 p-3 rounded-full bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 text-white shadow-2xl hover:shadow-3xl transition-all duration-300"
            initial={{ opacity: 0, scale: 0, y: 100 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0, y: 100 }}
            whileHover={{ 
              scale: 1.1, 
              boxShadow: "0 20px 40px rgba(139, 92, 246, 0.3)" 
            }}
            whileTap={{ scale: 0.9 }}
            transition={{ 
              type: "spring", 
              stiffness: 400, 
              damping: 30 
            }}
            aria-label="Back to top"
          >
            <ChevronUp className="w-6 h-6" />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
};

export default EnhancedNavigation;