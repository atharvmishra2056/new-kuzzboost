import { useState, useEffect } from "react";
import { supabase } from '@/integrations/supabase/client';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface Order {
    id: string;
    userId: string;
    userEmail: string;
    totalAmount: number;
    status: string;
    createdAt: string;
    items: any[];
}

const AdminOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

    useEffect(() => {
        const fetchOrders = async () => {
            setLoading(true);
            try {
                const { data: ordersData, error } = await supabase
                    .from('orders')
                    .select('*')
                    .order('created_at', { ascending: false });
                    
                if (error) throw error;
                
                const orders = ordersData?.map(order => ({
                    id: order.id,
                    userId: order.user_id,
                    userEmail: order.user_email,
                    totalAmount: order.total_amount,
                    status: order.status,
                    createdAt: order.created_at,
                    items: Array.isArray(order.items) ? order.items : []
                })) || [];
                
                setOrders(orders);
            } catch (error) {
                console.error("Error fetching orders: ", error);
            }
            setLoading(false);
        };

        fetchOrders();
    }, []);

    if (loading) return <div>Loading orders...</div>;

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">All Orders</h1>
            <div className="glass rounded-2xl p-6">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Order ID</TableHead>
                            <TableHead>Customer</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {orders.map((order) => (
                            <TableRow key={order.id}>
                                <TableCell className="font-mono text-xs">{order.id}</TableCell>
                                <TableCell>{order.userEmail}</TableCell>
                                <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                                <TableCell>₹{order.totalAmount.toFixed(2)}</TableCell>
                                <TableCell>
                                    <Badge
                                        variant={order.status === "Completed" ? "default" : order.status === "Processing" ? "secondary" : "destructive"}
                                    >
                                        {order.status}
                                    </Badge>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default AdminOrders;