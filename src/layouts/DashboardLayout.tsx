import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { LogOut, ShoppingCart, Heart, Package, Settings, Home, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import Footer from "../components/Footer";

const DashboardLayout = () => {
  const { currentUser, signOut } = useAuth();
  const { cartCount } = useCart();
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

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
      icon: <User className="w-5 h-5" />,
      label: "Account",
      path: "/dashboard/account"
    },
    {
      icon: <Settings className="w-5 h-5" />,
      label: "Settings",
      path: "/dashboard/account-settings"
    }
  ];

  const isActive = (path: string, exact = false) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex">
      {/* Sidebar */}
      <aside className="w-64 glass border-r border-border/20 flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-border/20">
          <h1 className="text-2xl font-clash font-bold text-primary">KuzzBoost</h1>
          <p className="text-sm text-muted-foreground mt-1">Dashboard</p>
        </div>

        {/* User Info */}
        <div className="p-4 border-b border-border/20">
          <div className="flex items-center gap-3">
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
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <div className="space-y-2">
            {sidebarItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive(item.path, item.exact)
                    ? 'bg-accent-peach/20 text-accent-peach border border-accent-peach/30'
                    : 'text-muted-foreground hover:text-primary hover:bg-accent/50'
                }`}
              >
                {item.icon}
                <span className="flex-1">{item.label}</span>
                {item.badge && (
                  <Badge className="bg-accent-peach text-white text-xs">
                    {item.badge}
                  </Badge>
                )}
              </Link>
            ))}
          </div>
        </nav>

        {/* Footer Links */}
        <div className="p-4 border-t border-border/20">
          <div className="space-y-2 mb-4">
            <Link
              to="/dashboard/terms"
              className="block text-xs text-muted-foreground hover:text-primary transition-colors"
            >
              Terms of Service
            </Link>
            <Link
              to="/dashboard/privacy"
              className="block text-xs text-muted-foreground hover:text-primary transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              to="/dashboard/refund-policy"
              className="block text-xs text-muted-foreground hover:text-primary transition-colors"
            >
              Refund Policy
            </Link>
          </div>
          
          <Button
            onClick={handleSignOut}
            variant="ghost"
            className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;