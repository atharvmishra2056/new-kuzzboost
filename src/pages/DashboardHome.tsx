// src/pages/DashboardHome.tsx

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useWishlist } from "@/hooks/useWishlist";
import { useCart } from "@/context/CartContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Heart, Package, Settings, Store, LifeBuoy, MessageSquare, ChevronRight, Star, User } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from '@/hooks/use-toast';
import { useServices } from "@/components/Services";
import { useAnnouncements } from '@/hooks/useAnnouncements';
import { useCurrency } from "@/context/CurrencyContext";
import ContactSupportDialog from "@/components/ContactSupportDialog";
import FeedbackDialog from "@/components/FeedbackDialog";

const StatCard = ({ icon, title, value, label, onClick }: { 
  icon: React.ReactNode, 
  title: string, 
  value: number | string, 
  label: string,
  onClick?: () => void 
}) => (
  <motion.div whileHover={{ scale: 1.05 }} className="h-full">
    <Card className={`glass h-full ${onClick ? 'cursor-pointer hover:border-accent-peach/50' : ''}`} onClick={onClick}>
      <CardContent className="pt-6 flex flex-col items-center text-center">
        <div className="w-12 h-12 mb-4 rounded-full bg-accent-peach/20 flex items-center justify-center text-accent-peach">
          {icon}
        </div>
        <p className="text-2xl font-bold font-clash text-primary">{value}</p>
        <p className="text-sm text-muted-foreground">{title}</p>
        <p className="text-xs text-muted-foreground mt-1">{label}</p>
      </CardContent>
    </Card>
  </motion.div>
);

const QuickActionCard = ({ icon, title, description, onClick }: {
  icon: React.ReactNode,
  title: string,
  description: string,
  onClick: () => void
}) => (
  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
    <Card className="glass cursor-pointer hover:border-accent-peach/50 transition-all duration-300" onClick={onClick}>
      <CardContent className="p-6 flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-accent-peach/20 flex items-center justify-center text-accent-peach">
          {icon}
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-primary">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        <ChevronRight className="w-5 h-5 text-muted-foreground" />
      </CardContent>
    </Card>
  </motion.div>
);

const RecommendationCard = ({ service, onClick }: { service: any, onClick: () => void }) => {
  const { getSymbol, convert } = useCurrency();
  
  return (
    <motion.div 
      whileHover={{ y: -4 }}
      className="min-w-[280px] glass rounded-xl p-4 cursor-pointer hover:border-accent-peach/50 transition-all duration-300"
      onClick={onClick}
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="text-3xl">{service.icon}</div>
        <div className="flex-1">
          <h4 className="font-semibold text-primary text-sm line-clamp-1">{service.title}</h4>
          <p className="text-xs text-muted-foreground">{service.platform}</p>
        </div>
        <Badge className="bg-accent-peach/20 text-accent-peach text-xs">{service.badge}</Badge>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <Star className="w-3 h-3 fill-accent-peach text-accent-peach" />
          <span className="text-xs font-medium">{service.rating}</span>
        </div>
        {service.tiers && service.tiers.length > 0 && (
          <span className="text-sm font-bold text-primary">
            {getSymbol()}{convert(service.tiers[0].price)}
          </span>
        )}
      </div>
    </motion.div>
  );
};

const AnnouncementBanner = ({ announcement, onButtonClick }: { announcement: any, onButtonClick: (link: string) => void }) => (
  <Card className="glass border-accent-peach/30 bg-gradient-to-r from-accent-peach/10 to-accent-coral/10">
    <CardContent className="p-6 flex items-center justify-between">
      <div className="flex-1">
        <h3 className="font-bold text-primary mb-2">{announcement.title}</h3>
        <p className="text-muted-foreground">{announcement.description}</p>
      </div>
      <Button className="glass-button w-full md:w-auto ml-4"
        onClick={() => onButtonClick(announcement.button_link || '/services')}
      >
        {announcement.button_text || 'Shop Now'}
      </Button>
    </CardContent>
  </Card>
);

const DashboardHome = () => {
  const { currentUser } = useAuth();
  const { wishlistCount } = useWishlist();
  const { cartCount } = useCart();
  const { services } = useServices();
  const { announcements, loading: announcementsLoading } = useAnnouncements();
  const navigate = useNavigate();
  const [orderCount, setOrderCount] = useState(0);
  const [pendingOrderCount, setPendingOrderCount] = useState(0);
  const [lastLogin, setLastLogin] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (!currentUser) {
      navigate('/auth');
      return;
    }

    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // Fetch order counts
        const { count: totalOrders, error: orderError } = await supabase
          .from('orders')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', currentUser.id);

        const { count: pendingOrders, error: pendingError } = await supabase
          .from('orders')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', currentUser.id)
          .in('status', ['pending', 'processing']);

        if (orderError) console.error("Error fetching orders:", orderError);
        else setOrderCount(totalOrders || 0);

        if (pendingError) console.error("Error fetching pending orders:", pendingError);
        else setPendingOrderCount(pendingOrders || 0);

        // Set last login (mock for now)
        setLastLogin(new Date().toLocaleDateString());

      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [currentUser, navigate]);

  const getRecommendations = () => {
    return services
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 6);
  };

  const quickActions = [
    {
      icon: <Store className="w-6 h-6" />,
      title: "Browse Services",
      description: "Explore our full catalog",
      onClick: () => navigate('/dashboard/services')
    },
    {
      icon: <Package className="w-6 h-6" />,
      title: "My Orders",
      description: "Track your purchases",
      onClick: () => navigate('/dashboard/orders')
    },
    {
      icon: <Heart className="w-6 h-6" />,
      title: "My Wishlist",
      description: "Saved for later",
      onClick: () => navigate('/dashboard/wishlist')
    },
    {
      icon: <ShoppingCart className="w-6 h-6" />,
      title: "My Cart",
      description: "Ready to checkout",
      onClick: () => navigate('/dashboard/cart')
    },
    {
      icon: <Settings className="w-6 h-6" />,
      title: "Account Settings",
      description: "Manage your profile",
      onClick: () => navigate('/dashboard/account-settings')
    }
  ];

  if (loading || announcementsLoading) {
    return (
      <div className="p-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Loading skeletons */}
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-glass rounded w-1/3"></div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-32 bg-glass rounded-xl"></div>
              ))}
            </div>
            <div className="h-24 bg-glass rounded-xl"></div>
            <div className="h-48 bg-glass rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  const firstName = currentUser?.user_metadata?.full_name?.split(' ')[0] || currentUser?.email?.split('@')[0] || 'User';

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Welcome Section */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-primary font-clash">
                Welcome back, {firstName}! 👋
              </h1>
              <p className="text-muted-foreground mt-1">Last login: {lastLogin}</p>
            </div>
          </div>
        </motion.div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <StatCard 
            icon={<ShoppingCart />} 
            title="Cart Items" 
            value={cartCount} 
            label="Ready to checkout"
            onClick={() => navigate('/dashboard/cart')}
          />
          <StatCard 
            icon={<Heart />} 
            title="Wishlist" 
            value={wishlistCount} 
            label="Saved for later"
            onClick={() => navigate('/dashboard/wishlist')}
          />
          <StatCard 
            icon={<Package />} 
            title="Pending Orders" 
            value={pendingOrderCount} 
            label="In progress"
            onClick={() => navigate('/dashboard/orders')}
          />
        </div>

        {/* Announcements */}
        {!announcementsLoading && announcements.filter(a => a.is_active).length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <h2 className="text-xl font-semibold text-primary mb-4">Latest Announcements</h2>
            <div className="space-y-4">
              {announcements.filter(a => a.is_active).slice(0, 3).map((announcement) => (
                <AnnouncementBanner key={announcement.id} announcement={announcement} onButtonClick={(link) => navigate(link)} />
              ))}
            </div>
          </motion.div>
        )}

        {/* Personalized Recommendations */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-primary">Recommended for You</h2>
            <Button  variant="ghost" onClick={() => navigate('/dashboard/services')}>
              View All <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {getRecommendations().map((service) => (
              <RecommendationCard 
                key={service.id} 
                service={service} 
                onClick={() => navigate(`/dashboard/service/${service.id}`)}
              />
            ))}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <h2 className="text-xl font-semibold text-primary mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {quickActions.map((action, index) => (
              <QuickActionCard key={index} {...action} />
            ))}
          </div>
        </motion.div>

        {/* Support & Feedback */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card className="glass">
            <CardContent className="p-6 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-accent-peach/20 flex items-center justify-center">
                  <LifeBuoy className="w-6 h-6 text-accent-peach" />
                </div>
                <div>
                  <h3 className="font-semibold text-primary">Need Help?</h3>
                  <p className="text-sm text-muted-foreground">Our support team is here to assist you</p>
                </div>
              </div>
              <div className="flex flex-col w-full md:flex-row gap-3">
                <Button  
                  variant="outline" 
                  onClick={() => navigate('/about')}
                >
                  <User className="w-4 h-4 mr-2" />
                  See Our Team
                </Button>
                <ContactSupportDialog>
                  <Button  variant="outline">
                    <LifeBuoy className="w-4 h-4 mr-2" />
                    Contact Support
                  </Button>
                </ContactSupportDialog>
                <FeedbackDialog>
                  <Button  variant="outline">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Give Feedback
                  </Button>
                </FeedbackDialog>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Legal Links */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <div className="flex flex-wrap justify-center gap-6 py-6 border-t border-border/20">
            <Button  
              variant="link" 
              className="text-muted-foreground hover:text-primary text-sm w-full md:w-auto"
              onClick={() => navigate('/dashboard/terms')}
            >
              Terms of Service
            </Button>
            <Button  
              variant="link" 
              className="text-muted-foreground hover:text-primary text-sm w-full md:w-auto"
              onClick={() => navigate('/dashboard/privacy')}
            >
              Privacy Policy
            </Button>
            <Button  
              variant="link" 
              className="text-muted-foreground hover:text-primary text-sm w-full md:w-auto"
              onClick={() => navigate('/dashboard/refund-policy')}
            >
              Refund Policy
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardHome;