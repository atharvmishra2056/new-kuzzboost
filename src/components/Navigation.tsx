import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, ShoppingCart, Globe, User, LogOut } from "lucide-react";
import { useCurrency } from "../context/CurrencyContext";
import { useAuth } from "../context/AuthContext"; // Import useAuth
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { Button } from "./ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "./ui/dropdown-menu";

interface NavigationProps {
  cartItemCount?: number;
  onCartClick?: () => void;
}

const Navigation = ({ cartItemCount = 0, onCartClick }: NavigationProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { currency, setCurrency } = useCurrency();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/');
  };

  return (
      <nav className="fixed top-0 left-0 right-0 z-50 glass">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="font-clash text-2xl font-bold text-primary">
              KuzzBoost
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              <Link to="/" className="text-foreground hover:text-primary transition-colors duration-300 font-medium">Home</Link>
              <Link to="/services" className="text-foreground hover:text-primary transition-colors duration-300 font-medium">Services</Link>

              {/* Currency Switcher */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    {currency}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setCurrency('INR')}>INR (₹)</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setCurrency('USD')}>USD ($)</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setCurrency('EUR')}>EUR (€)</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setCurrency('GBP')}>GBP (£)</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Cart Icon */}
              <button
                  id="cart-icon"
                  onClick={onCartClick}
                  className="relative p-2 rounded-full hover:bg-glass transition-all duration-300"
              >
                <ShoppingCart className="w-6 h-6 text-foreground" />
                {cartItemCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-accent-peach text-xs rounded-full w-5 h-5 flex items-center justify-center text-foreground font-medium">
                  {cartItemCount}
                </span>
                )}
              </button>

              {/* User/Auth Section */}
              {currentUser ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="flex items-center gap-2">
                        <User className="w-5 h-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem disabled>{currentUser.email}</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => navigate('/order-history')}>Order History</DropdownMenuItem>
                      <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                        <LogOut className="w-4 h-4 mr-2"/>
                        Logout
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
              ) : (
                  <Link to="/auth">
                    <Button className="glass-button py-2 px-4 text-sm">Login</Button>
                  </Link>
              )}

            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="text-foreground hover:text-primary transition-colors duration-300"
              >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isOpen && (
              // ... (mobile nav remains the same)
              <div className="md:hidden mt-4 pb-4 space-y-4">
                <Link to="/" className="block text-foreground hover:text-primary transition-colors duration-300 font-medium" onClick={() => setIsOpen(false)}>Home</Link>
                <Link to="/services" className="block text-foreground hover:text-primary transition-colors duration-300 font-medium" onClick={() => setIsOpen(false)}>Services</Link>
                <Link to="/about" className="block text-foreground hover:text-primary transition-colors duration-300 font-medium" onClick={() => setIsOpen(false)}>About</Link>
                <Link to="/contact" className="block text-foreground hover:text-primary transition-colors duration-300 font-medium" onClick={() => setIsOpen(false)}>Contact</Link>
              </div>
          )}
        </div>
      </nav>
  );
};

export default Navigation;