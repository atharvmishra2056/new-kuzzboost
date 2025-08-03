import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { LogOut, ShoppingCart, Heart, Package, Settings, Home, User, Menu, X, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import Footer from "../components/Footer";
import { useState } from "react";

const DashboardLayout = () => {
  const { currentUser, signOut } = useAuth();
  const { cartCount } = useCart();
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast({
        title: "Sign Out Failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      navigate('/');
    }
  };

  const sidebarItems = [
    {
      icon: <Home className="w-5 h-5" />,
      label: "Dashboard",
      path: "/dashboard",
      exact: true
    },
    {
      icon: <Package className="w-5 h-5" />,
      label: "All Services",
      path: "/dashboard/services"
    },
    {
      icon: <ShoppingCart className="w-5 h-5" />,
      label: "Cart",
      path: "/dashboard/cart",
      badge: cartCount > 0 ? cartCount : null
    },
    {
      icon: <Heart className="w-5 h-5" />,
      label: "Wishlist",
      path: "/dashboard/wishlist"
    },
    {
      icon: <Package className="w-5 h-5" />,
      label: "My Orders",
      path: "/dashboard/orders"
    },
    {
      icon: <RefreshCw className="w-5 h-5" />,
      label: "Refill Requests",
      path: "/dashboard/refill-requests"
    }
  ];

  const isActive = (path: string, exact = false) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="p-6 border-b border-border/20">
        <Link to="/" className="flex items-center gap-3 text-2xl font-clash font-bold text-primary">
            <img src="/site_logo.png" alt="KuzzBoost Logo" className="w-8 h-8 object-contain" />
            <span>KuzzBoost</span>
        </Link>
        <p className="text-sm text-muted-foreground mt-1">Dashboard</p>
      </div>

      {/* User Info */}
      <div className="p-4 border-b border-border/20">
        <Link 
          to="/dashboard/account"
          className="flex items-center gap-3 hover:bg-accent/50 rounded-lg p-2 transition-colors group"
          title="View Profile"
          onClick={() => setIsSidebarOpen(false)}
        >
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
            <span className="text-sm font-semibold text-primary">
              {currentUser?.email?.[0].toUpperCase()}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-primary truncate">
              {currentUser?.user_metadata?.full_name || currentUser?.email}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {currentUser?.email}
            </p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <div className="space-y-2">
          {sidebarItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                isActive(item.path, item.exact)
                  ? 'bg-accent-peach/20 text-accent-peach border border-accent-peach/30'
                  : 'text-muted-foreground hover:text-primary hover:bg-accent/50'
              }`}
            >
              {item.icon}
              <span className="flex-1">{item.label}</span>
              {item.badge && (
                <Badge className="bg-accent-peach text-white text-sm">
                  {item.badge}
                </Badge>
              )}
            </Link>
          ))}
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border/20">
        <Button
          onClick={handleSignOut}
          variant="ghost"
          className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10 py-3 text-base"
        >
          <LogOut className="w-5 h-5 mr-3" />
          Sign Out
        </Button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Mobile Header */}
      <div className="md:hidden glass border-b border-border/20 p-4 sticky top-0 z-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2"
            >
              {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
            <h1 className="text-xl font-clash font-bold text-primary">KuzzBoost</h1>
          </div>
          <Link 
            to="/dashboard/account"
            className="flex items-center gap-2"
            title="View Profile"
          >
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
              <span className="text-sm font-semibold text-primary">
                {currentUser?.email?.[0].toUpperCase()}
              </span>
            </div>
          </Link>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/80 z-40"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside className={`md:hidden fixed top-0 left-0 h-full w-64 glass sidebar-glass border-r border-border/20 flex flex-col z-50 transform transition-transform duration-300 ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <SidebarContent />
      </aside>

      <div className="flex">
        {/* Desktop Sidebar */}
        <aside className="hidden md:flex w-64 glass border-r border-border/20 flex-col sticky top-0 h-screen">
          <SidebarContent />
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto pt-16 md:pt-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;