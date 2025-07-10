import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, ShoppingCart } from "lucide-react";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="font-clash text-2xl font-bold text-primary">
            KuzzBoost
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className="text-foreground hover:text-primary transition-colors duration-300 font-medium"
            >
              Home
            </Link>
            <Link 
              to="/services" 
              className="text-foreground hover:text-primary transition-colors duration-300 font-medium"
            >
              Services
            </Link>
            <Link 
              to="/about" 
              className="text-foreground hover:text-primary transition-colors duration-300 font-medium"
            >
              About
            </Link>
            <Link 
              to="/contact" 
              className="text-foreground hover:text-primary transition-colors duration-300 font-medium"
            >
              Contact
            </Link>
            
            {/* Cart Icon */}
            <button className="relative p-2 rounded-full hover:bg-glass transition-all duration-300">
              <ShoppingCart className="w-6 h-6 text-foreground" />
              <span className="absolute -top-1 -right-1 bg-accent-peach text-xs rounded-full w-5 h-5 flex items-center justify-center text-foreground font-medium">
                0
              </span>
            </button>
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
          <div className="md:hidden mt-4 pb-4 space-y-4">
            <Link 
              to="/" 
              className="block text-foreground hover:text-primary transition-colors duration-300 font-medium"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/services" 
              className="block text-foreground hover:text-primary transition-colors duration-300 font-medium"
              onClick={() => setIsOpen(false)}
            >
              Services
            </Link>
            <Link 
              to="/about" 
              className="block text-foreground hover:text-primary transition-colors duration-300 font-medium"
              onClick={() => setIsOpen(false)}
            >
              About
            </Link>
            <Link 
              to="/contact" 
              className="block text-foreground hover:text-primary transition-colors duration-300 font-medium"
              onClick={() => setIsOpen(false)}
            >
              Contact
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;