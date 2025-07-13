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

            {/* Mobile Controls */}
            <div className="md:hidden flex items-center gap-2">
              {/* Mobile Cart Icon */}
              <button
                  onClick={onCartClick}
                  className="relative p-2 rounded-full hover:bg-glass transition-all duration-300"
              >
                <ShoppingCart className="w-5 h-5 text-foreground" />
                {cartItemCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-accent-peach text-xs rounded-full w-4 h-4 flex items-center justify-center text-foreground font-medium text-[10px]">
                  {cartItemCount}
                </span>
                )}
              </button>
              
              {/* Mobile menu button */}
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
              <div className="md:hidden mt-4 pb-4">
                <div className="glass rounded-2xl p-4 space-y-4">
                  <Link to="/" className="block text-foreground hover:text-primary transition-colors duration-300 font-medium py-2" onClick={() => setIsOpen(false)}>Home</Link>
                  <Link to="/services" className="block text-foreground hover:text-primary transition-colors duration-300 font-medium py-2" onClick={() => setIsOpen(false)}>Services</Link>
                  <Link to="/about" className="block text-foreground hover:text-primary transition-colors duration-300 font-medium py-2" onClick={() => setIsOpen(false)}>About</Link>
                  
                  {/* Currency Switcher for Mobile */}
                  <div className="border-t border-border/50 pt-4">
                    <p className="text-sm text-muted-foreground mb-2">Currency</p>
                    <div className="grid grid-cols-2 gap-2">
                      <button onClick={() => {setCurrency('INR'); setIsOpen(false);}} className={`p-2 rounded-lg text-sm ${currency === 'INR' ? 'bg-primary text-primary-foreground' : 'bg-secondary'}`}>INR (₹)</button>
                      <button onClick={() => {setCurrency('USD'); setIsOpen(false);}} className={`p-2 rounded-lg text-sm ${currency === 'USD' ? 'bg-primary text-primary-foreground' : 'bg-secondary'}`}>USD ($)</button>
                      <button onClick={() => {setCurrency('EUR'); setIsOpen(false);}} className={`p-2 rounded-lg text-sm ${currency === 'EUR' ? 'bg-primary text-primary-foreground' : 'bg-secondary'}`}>EUR (€)</button>
                      <button onClick={() => {setCurrency('GBP'); setIsOpen(false);}} className={`p-2 rounded-lg text-sm ${currency === 'GBP' ? 'bg-primary text-primary-foreground' : 'bg-secondary'}`}>GBP (£)</button>
                    </div>
                  </div>
                  
                  {/* Cart and Auth for Mobile */}
                  <div className="border-t border-border/50 pt-4 space-y-3">
                    <button
                      onClick={() => {onCartClick?.(); setIsOpen(false);}}
                      className="w-full flex items-center gap-3 p-3 glass rounded-lg hover:scale-105 transition-transform"
                    >
                      <ShoppingCart className="w-5 h-5" />
                      <span>Cart ({cartItemCount})</span>
                    </button>
                    
                    {currentUser ? (
                      <div className="space-y-2">
                        <div className="text-sm text-muted-foreground px-3">{currentUser.email}</div>
                        <button onClick={() => {navigate('/order-history'); setIsOpen(false);}} className="w-full text-left p-3 glass rounded-lg">Order History</button>
                        <button onClick={() => {handleLogout(); setIsOpen(false);}} className="w-full text-left p-3 glass rounded-lg text-destructive">Logout</button>
                      </div>
                    ) : (
                      <Link to="/auth" onClick={() => setIsOpen(false)}>
                        <Button className="w-full glass-button">Login</Button>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
          )}
        </div>
      </nav>
  );
};

export default Navigation;