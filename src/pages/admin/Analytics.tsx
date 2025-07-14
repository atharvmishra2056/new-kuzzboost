import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Area, AreaChart
} from 'recharts';
import { 
  TrendingUp, TrendingDown, Users, ShoppingCart, 
  DollarSign, Package, Activity, Eye, Heart, Star
} from 'lucide-react';
import { motion } from 'framer-motion';

interface AnalyticsData {
  totalRevenue: number;
  totalOrders: number;
  totalUsers: number;
  totalServices: number;
  revenueGrowth: number;
  orderGrowth: number;
  userGrowth: number;
  popularServices: Array<{
    name: string;
    orders: number;
    revenue: number;
    platform: string;
  }>;
  monthlyRevenue: Array<{
    month: string;
    revenue: number;
    orders: number;
  }>;
  platformDistribution: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  recentActivity: Array<{
    type: string;
    description: string;
    timestamp: string;
    value?: number;
  }>;
}

const Analytics = () => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30d');

  useEffect(() => {
    fetchAnalyticsData();
  }, [timeRange]);

  const fetchAnalyticsData = async () => {
    setLoading(true);
    try {
      // Fetch orders data
      const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (ordersError) throw ordersError;

      // Fetch services data
      const { data: services, error: servicesError } = await supabase
        .from('services')
        .select('*');

      if (servicesError) throw servicesError;

      // Fetch profiles data
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*');

      if (profilesError) throw profilesError;

      // Process data
      const totalRevenue = orders?.reduce((sum, order) => sum + order.total_amount, 0) || 0;
      const totalOrders = orders?.length || 0;
      const totalUsers = profiles?.length || 0;
      const totalServices = services?.length || 0;

      // Calculate growth rates (mock data for now)
      const revenueGrowth = 12.5;
      const orderGrowth = 8.3;
      const userGrowth = 15.2;

      // Popular services
      const serviceOrderCounts: { [key: string]: { orders: number; revenue: number; platform: string } } = {};
      orders?.forEach(order => {
        const items = order.items as any[];
        items.forEach(item => {
          if (!serviceOrderCounts[item.title]) {
            serviceOrderCounts[item.title] = { orders: 0, revenue: 0, platform: item.platform };
          }
          serviceOrderCounts[item.title].orders += item.quantity;
          serviceOrderCounts[item.title].revenue += item.price * item.quantity;
        });
      });

      const popularServices = Object.entries(serviceOrderCounts)
        .map(([name, data]) => ({ name, ...data }))
        .sort((a, b) => b.orders - a.orders)
        .slice(0, 5);

      // Monthly revenue (mock data for demo)
      const monthlyRevenue = [
        { month: 'Jan', revenue: 45000, orders: 120 },
        { month: 'Feb', revenue: 52000, orders: 145 },
        { month: 'Mar', revenue: 48000, orders: 130 },
        { month: 'Apr', revenue: 61000, orders: 165 },
        { month: 'May', revenue: 58000, orders: 155 },
        { month: 'Jun', revenue: 67000, orders: 180 },
      ];

      // Platform distribution
      const platformCounts: { [key: string]: number } = {};
      orders?.forEach(order => {
        const items = order.items as any[];
        items.forEach(item => {
          platformCounts[item.platform] = (platformCounts[item.platform] || 0) + item.quantity;
        });
      });

      const platformColors = {
        'Instagram': '#E4405F',
        'YouTube': '#FF0000',
        'TikTok': '#000000',
        'Twitter': '#1DA1F2',
        'Discord': '#7289DA',
        'Spotify': '#1DB954',
        'WhatsApp': '#25D366',
        'Snapchat': '#FFFC00',
      };

      const platformDistribution = Object.entries(platformCounts).map(([name, value]) => ({
        name,
        value,
        color: platformColors[name as keyof typeof platformColors] || '#8884d8'
      }));

      // Recent activity (mock data)
      const recentActivity = [
        { type: 'order', description: 'New order placed', timestamp: '2 minutes ago', value: 2500 },
        { type: 'user', description: 'New user registered', timestamp: '5 minutes ago' },
        { type: 'service', description: 'Service updated', timestamp: '12 minutes ago' },
        { type: 'order', description: 'Order completed', timestamp: '18 minutes ago', value: 1800 },
        { type: 'review', description: 'New 5-star review', timestamp: '25 minutes ago' },
      ];

      setData({
        totalRevenue,
        totalOrders,
        totalUsers,
        totalServices,
        revenueGrowth,
        orderGrowth,
        userGrowth,
        popularServices,
        monthlyRevenue,
        platformDistribution,
        recentActivity
      });

    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!data) return null;

  const StatCard = ({ title, value, change, icon: Icon, format = 'number' }: any) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
    >
      <Card className="glass">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm font-medium">{title}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-2xl font-bold text-primary font-clash">
                  {format === 'currency' ? `₹${value.toLocaleString()}` : value.toLocaleString()}
                </span>
                {change && (
                  <Badge className={`${change >= 0 ? 'bg-green-500/20 text-green-700' : 'bg-red-500/20 text-red-700'}`}>
                    {change >= 0 ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                    {Math.abs(change)}%
                  </Badge>
                )}
              </div>
            </div>
            <div className="text-accent-peach">
              <Icon className="w-8 h-8" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold font-clash text-primary">Analytics Dashboard</h1>
        <div className="flex gap-2">
          {['7d', '30d', '90d', '1y'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                timeRange === range
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary hover:bg-secondary/80'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Revenue"
          value={data.totalRevenue}
          change={data.revenueGrowth}
          icon={DollarSign}
          format="currency"
        />
        <StatCard
          title="Total Orders"
          value={data.totalOrders}
          change={data.orderGrowth}
          icon={ShoppingCart}
        />
        <StatCard
          title="Total Users"
          value={data.totalUsers}
          change={data.userGrowth}
          icon={Users}
        />
        <StatCard
          title="Active Services"
          value={data.totalServices}
          icon={Package}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend */}
        <Card className="glass">
          <CardHeader>
            <CardTitle className="font-clash">Revenue Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={data.monthlyRevenue}>
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`₹${value.toLocaleString()}`, 'Revenue']} />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#8B5CF6" 
                  fillOpacity={1} 
                  fill="url(#revenueGradient)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Platform Distribution */}
        <Card className="glass">
          <CardHeader>
            <CardTitle className="font-clash">Platform Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={data.platformDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {data.platformDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap gap-2 mt-4">
              {data.platformDistribution.map((entry, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: entry.color }}
                  />
                  <span className="text-sm text-muted-foreground">{entry.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Popular Services */}
        <Card className="glass lg:col-span-2">
          <CardHeader>
            <CardTitle className="font-clash">Popular Services</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.popularServices}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="orders" fill="#8B5CF6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="glass">
          <CardHeader>
            <CardTitle className="font-clash">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                    {activity.type === 'order' && <ShoppingCart className="w-4 h-4 text-primary" />}
                    {activity.type === 'user' && <Users className="w-4 h-4 text-primary" />}
                    {activity.type === 'service' && <Package className="w-4 h-4 text-primary" />}
                    {activity.type === 'review' && <Star className="w-4 h-4 text-primary" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.description}</p>
                    <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
                  </div>
                  {activity.value && (
                    <Badge variant="secondary">₹{activity.value}</Badge>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;