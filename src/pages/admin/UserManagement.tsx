import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Search, Eye, Mail, Phone, Calendar, 
  TrendingUp, DollarSign, ShoppingCart, Star 
} from 'lucide-react';
import { motion } from 'framer-motion';

interface User {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  created_at: string;
  orders?: number;
  totalSpent?: number;
  lastOrder?: string;
  status: 'active' | 'inactive';
}

const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      // Fetch profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;

      // Fetch orders to calculate user statistics
      const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select('user_id, total_amount, created_at, status');

      if (ordersError) throw ordersError;

      // Calculate user statistics
      const userStats: { [key: string]: { orders: number; totalSpent: number; lastOrder: string } } = {};
      
      orders?.forEach(order => {
        if (!userStats[order.user_id]) {
          userStats[order.user_id] = { orders: 0, totalSpent: 0, lastOrder: '' };
        }
        userStats[order.user_id].orders += 1;
        userStats[order.user_id].totalSpent += order.total_amount;
        if (!userStats[order.user_id].lastOrder || order.created_at > userStats[order.user_id].lastOrder) {
          userStats[order.user_id].lastOrder = order.created_at;
        }
      });

      // Combine profile data with statistics
      const enrichedUsers = profiles?.map(profile => ({
        ...profile,
        orders: userStats[profile.user_id]?.orders || 0,
        totalSpent: userStats[profile.user_id]?.totalSpent || 0,
        lastOrder: userStats[profile.user_id]?.lastOrder || null,
        status: (userStats[profile.user_id]?.orders > 0 ? 'active' : 'inactive') as 'active' | 'inactive'
      })) || [];

      setUsers(enrichedUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.phone?.includes(searchTerm)
  );

  const totalUsers = users.length;
  const activeUsers = users.filter(u => u.status === 'active').length;
  const totalRevenue = users.reduce((sum, user) => sum + (user.totalSpent || 0), 0);
  const totalOrders = users.reduce((sum, user) => sum + (user.orders || 0), 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold font-clash text-primary">User Management</h1>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="glass">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm font-medium">Total Users</p>
                  <p className="text-2xl font-bold text-primary font-clash">{totalUsers}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-accent-peach" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="glass">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm font-medium">Active Users</p>
                  <p className="text-2xl font-bold text-primary font-clash">{activeUsers}</p>
                </div>
                <Star className="w-8 h-8 text-accent-peach" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="glass">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm font-medium">Total Revenue</p>
                  <p className="text-2xl font-bold text-primary font-clash">₹{totalRevenue.toLocaleString()}</p>
                </div>
                <DollarSign className="w-8 h-8 text-accent-peach" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="glass">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm font-medium">Total Orders</p>
                  <p className="text-2xl font-bold text-primary font-clash">{totalOrders}</p>
                </div>
                <ShoppingCart className="w-8 h-8 text-accent-peach" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Users Table */}
      <Card className="glass">
        <CardHeader>
          <CardTitle className="font-clash">Users ({filteredUsers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Orders</TableHead>
                <TableHead>Total Spent</TableHead>
                <TableHead>Last Order</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user, index) => (
                <motion.tr
                  key={user.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-secondary/50"
                >
                  <TableCell>
                    <div>
                      <p className="font-medium">{user.full_name || 'N/A'}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <Mail className="w-3 h-3 text-muted-foreground" />
                        <span className="text-sm">{user.email}</span>
                      </div>
                      {user.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="w-3 h-3 text-muted-foreground" />
                          <span className="text-sm">{user.phone}</span>
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={
                      user.status === 'active' 
                        ? 'bg-green-500/20 text-green-700' 
                        : 'bg-gray-500/20 text-gray-700'
                    }>
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{user.orders || 0}</TableCell>
                  <TableCell>₹{(user.totalSpent || 0).toLocaleString()}</TableCell>
                  <TableCell>
                    {user.lastOrder ? new Date(user.lastOrder).toLocaleDateString() : 'Never'}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3 h-3 text-muted-foreground" />
                      {new Date(user.created_at).toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setSelectedUser(user)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </motion.tr>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserManagement;