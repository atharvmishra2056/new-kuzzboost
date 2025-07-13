import { useState, useEffect } from "react";
import { collection, getDocs, orderBy, query, Timestamp } from "firebase/firestore";
import { db } from "../../firebase";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface Order {
    id: string;
    userId: string;
    userEmail: string;
    totalAmount: number;
    status: string;
    createdAt: Timestamp;
    items: any[];
}

const AdminOrders = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            setLoading(true);
            try {
                const ordersCollection = collection(db, "orders");
                const q = query(ordersCollection, orderBy("createdAt", "desc"));
                const querySnapshot = await getDocs(q);
                const ordersData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                } as Order));
                setOrders(ordersData);
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
                                <TableCell>{order.createdAt.toDate().toLocaleDateString()}</TableCell>
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