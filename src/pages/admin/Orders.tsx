import { useState, useEffect } from "react";
import { supabase } from '@/integrations/supabase/client';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Order } from "@/types/service";

const AdminOrders = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newStatus, setNewStatus] = useState<Order['status'] | ''>('');
    const { toast } = useToast();

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('orders')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setOrders(data as unknown as Order[]);
        } catch (error) {
            console.error("Error fetching orders: ", error);
            toast({ title: "Error", description: "Could not fetch orders.", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleManageClick = (order: Order) => {
        setSelectedOrder(order);
        setNewStatus(order.status);
        setIsModalOpen(true);
    };

    const updateOrderInDatabase = async (orderId: string, status: Order['status'], paymentVerified: boolean) => {
        setIsSubmitting(true);

        // --- DEBUGGING LOGS ---
        console.log("--- DEBUGGING: Preparing to call Supabase RPC ---");
        console.log("orderId:", orderId, "| type:", typeof orderId);
        console.log("status:", status, "| type:", typeof status);
        console.log("paymentVerified:", paymentVerified, "| type:", typeof paymentVerified);
        console.log("-------------------------------------------------");
        // --- END DEBUGGING ---

        const { error } = await supabase.rpc('update_order_status', {
            order_id_param: orderId,
            new_status: status,
            payment_verified_param: paymentVerified
        });

        if (error) {
            toast({ title: "Error", description: `Failed to update order: ${error.message}`, variant: "destructive" });
            console.error("Supabase RPC Error:", error);
        } else {
            toast({ title: "Success", description: "Order updated successfully." });
            await fetchOrders();
            setIsModalOpen(false);
        }
        setIsSubmitting(false);
    };

    const handleVerifyPayment = () => {
        if (selectedOrder) {
            updateOrderInDatabase(selectedOrder.id, 'processing', true);
        }
    };

    const handleSaveChanges = () => {
        if (selectedOrder && newStatus) {
            updateOrderInDatabase(selectedOrder.id, newStatus, selectedOrder.payment_verified);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'completed': return 'bg-green-500/20 text-green-700 border-green-500/30';
            case 'pending': return 'bg-yellow-500/20 text-yellow-700 border-yellow-500/30';
            case 'processing': return 'bg-blue-500/20 text-blue-700 border-blue-500/30';
            case 'shipped': return 'bg-purple-500/20 text-purple-700 border-purple-500/30';
            case 'cancelled': return 'bg-red-500/20 text-red-700 border-red-500/30';
            default: return 'bg-gray-500/20 text-gray-700 border-gray-500/30';
        }
    };

    if (loading && orders.length === 0) return <div>Loading orders...</div>;

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
                            <TableHead>Payment</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {orders.map((order) => (
                            <TableRow key={order.id}>
                                <TableCell className="font-mono text-xs">{order.order_id}</TableCell>
                                <TableCell>{order.user_email}</TableCell>
                                <TableCell>{new Date(order.created_at).toLocaleDateString()}</TableCell>
                                <TableCell>₹{order.total_amount.toFixed(2)}</TableCell>
                                <TableCell>
                                    <Badge className={order.payment_verified ? 'bg-green-500/20 text-green-700' : 'bg-yellow-500/20 text-yellow-700'}>
                                        {order.payment_verified ? "Verified" : "Pending"}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <Badge className={`${getStatusColor(order.status)} capitalize`}>
                                        {order.status}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <Button variant="outline" size="sm" onClick={() => handleManageClick(order)}>
                                        Manage
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="max-w-2xl glass">
                    <DialogHeader>
                        <DialogTitle>Manage Order: {selectedOrder?.order_id}</DialogTitle>
                    </DialogHeader>
                    {selectedOrder && (
                        <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-4">
                            <p><strong>Customer:</strong> {selectedOrder.customer_info.fullName} ({selectedOrder.user_email})</p>
                            <p><strong>Transaction ID:</strong> <span className="font-mono">{selectedOrder.transaction_id}</span></p>

                            {!selectedOrder.payment_verified && (
                                <Button onClick={handleVerifyPayment} disabled={isSubmitting} className="w-full bg-green-600 hover:bg-green-700">
                                    {isSubmitting ? 'Verifying...' : 'Confirm Payment Verified'}
                                </Button>
                            )}

                            <div>
                                <Label>Update Order Status</Label>
                                <Select value={newStatus} onValueChange={(value) => setNewStatus(value as Order['status'])}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select new status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="processing">Processing</SelectItem>
                                        <SelectItem value="shipped">Shipped / In Progress</SelectItem>
                                        <SelectItem value="completed">Completed</SelectItem>
                                        <SelectItem value="cancelled">Cancelled</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <DialogClose asChild><Button variant="secondary" disabled={isSubmitting}>Cancel</Button></DialogClose>
                        <Button
                            onClick={handleSaveChanges}
                            disabled={isSubmitting || newStatus === selectedOrder?.status}
                        >
                            {isSubmitting ? 'Updating...' : 'Save Changes'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AdminOrders;