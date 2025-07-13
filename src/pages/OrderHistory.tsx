import { useState, useEffect } from "react";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "../context/AuthContext";
import { collection, getDocs, query, where, orderBy, Timestamp } from "firebase/firestore";
import { db } from "../firebase";

interface Order {
    id: string;
    totalAmount: number;
    status: string;
    createdAt: Timestamp;
    items: any[];
}

const OrderHistory = () => {
    const { currentUser } = useAuth();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!currentUser) {
            setLoading(false);
            return;
        }

        const fetchOrders = async () => {
            setLoading(true);
            try {
                const ordersCollection = collection(db, "orders");
                const q = query(
                    ordersCollection,
                    where("userId", "==", currentUser.uid),
                    orderBy("createdAt", "desc")
                );
                const querySnapshot = await getDocs(q);
                const ordersData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                } as Order));
                setOrders(ordersData);
            } catch (error) {
                console.error("Error fetching order history: ", error);
            }
            setLoading(false);
        };

        fetchOrders();
    }, [currentUser]);

    return (
        <div className="min-h-screen bg-gradient-hero">
            <Navigation />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                <h1 className="font-clash text-4xl md:text-5xl font-bold text-primary mb-12 text-center">My Order History</h1>
                {loading ? (
                    <p className="text-center">Loading your orders...</p>
                ) : !currentUser ? (
                    <p className="text-center">Please log in to see your order history.</p>
                ) : (
                    <div className="glass rounded-2xl p-6">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Order ID</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {orders.map((order) => (
                                    <TableRow key={order.id}>
                                        <TableCell className="font-mono text-xs">{order.id}</TableCell>
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
                )}
            </div>
            <Footer />
        </div>
    );
};

export default OrderHistory;