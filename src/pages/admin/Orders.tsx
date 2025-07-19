import { useState, useEffect } from "react";
import { supabase } from '@/integrations/supabase/client';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input"; // ADDED: For search bar
import { useToast } from "@/hooks/use-toast";
import { Order } from "@/types/service";
import { Separator } from "@/components/ui/separator";
import { Link as LinkIcon, Search } from "lucide-react"; // ADDED: Search Icon

// MODIFIED: Added userInput to the interface
interface OrderItem {
    title: string;
    platform: string;
    quantity: number;
    service_quantity: number;
    price: number;
    userInput: string;
}

const AdminOrders = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newStatus, setNewStatus] = useState<Order['status'] | ''>('');
    const { toast } = useToast();

    // --- ADDED: State for new Search and Filter functionality ---
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    // ---

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
        try {
            const { error } = await supabase
                .from('orders')
                .update({
                    status: status,
                    payment_verified: paymentVerified,
                    updated_at: new Date().toISOString()
                })
                .eq('id', orderId);

            if (error) throw error;

            toast({ title: "Success", description: "Order updated successfully." });
            await fetchOrders();
            setIsModalOpen(false);
        } catch (error) {
            const err = error as Error;
            toast({ title: "Error", description: `Failed to update order: ${err.message}`, variant: "destructive" });
            console.error("Supabase Error:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleVerifyPayment = () => {
        if (selectedOrder) {
            updateOrderInDatabase(selectedOrder.id, 'processing', true);
        }
    };

    const handleSaveChanges = () => {
        if (selectedOrder && newStatus && newStatus !== selectedOrder.status) {
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

    // --- ADDED: Logic to filter orders based on state ---
    const filteredOrders = orders.filter(order => {
        const lowercasedTerm = searchTerm.toLowerCase();

        const matchesStatus = statusFilter === 'all' || order.status === statusFilter;

        const matchesSearch = searchTerm.trim() === '' ||
            order.order_id.toLowerCase().includes(lowercasedTerm) ||
            order.user_email.toLowerCase().includes(lowercasedTerm) ||
            (order.customer_info.firstName && order.customer_info.firstName.toLowerCase().includes(lowercasedTerm)) ||
            (order.customer_info.lastName && order.customer_info.lastName.toLowerCase().includes(lowercasedTerm));

        return matchesStatus && matchesSearch;
    });
    // ---

    if (loading && orders.length === 0) return <div>Loading orders...</div>;

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">All Orders</h1>

            {/* --- ADDED: Search and Filter UI --- */}
            <div className="flex flex-col sm:flex-row items-center justify-between mb-4 gap-4">
                <div className="relative w-full sm:max-w-xs">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search by ID, email, name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full sm:w-[180px]">
                        <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="processing">Processing</SelectItem>
                        <SelectItem value="shipped">Shipped</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            {/* --- END OF NEW UI --- */}

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
                        {/* MODIFIED: Mapping over filteredOrders */}
                        {filteredOrders.map((order) => (
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
                        <DialogDescription>
                            Update the status and view details for this order.
                        </DialogDescription>
                    </DialogHeader>
                    {selectedOrder && (
                        <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-4 py-4">
                            {/* Customer & Transaction Details */}
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <h4 className="font-semibold mb-1">Customer</h4>
                                    <p>{selectedOrder.customer_info.firstName} {selectedOrder.customer_info.lastName}</p>
                                    <p className="text-muted-foreground">{selectedOrder.user_email}</p>
                                    <p className="text-muted-foreground">{selectedOrder.customer_info.phone}</p>
                                </div>
                                <div>
                                    <h4 className="font-semibold mb-1">Transaction</h4>
                                    <p className="font-mono text-xs">{selectedOrder.transaction_id}</p>
                                    <Badge className={selectedOrder.payment_verified ? 'bg-green-500/20 text-green-700 mt-2' : 'bg-yellow-500/20 text-yellow-700 mt-2'}>
                                        {selectedOrder.payment_verified ? "Payment Verified" : "Pending"}
                                    </Badge>
                                </div>
                            </div>

                            {!selectedOrder.payment_verified && (
                                <Button onClick={handleVerifyPayment} disabled={isSubmitting} className="w-full bg-green-600 hover:bg-green-700">
                                    {isSubmitting ? 'Verifying...' : 'Confirm Payment Verified'}
                                </Button>
                            )}

                            <Separator />

                            {/* Order Items Section */}
                            <div>
                                <h4 className="font-semibold mb-3">Order Items</h4>
                                <div className="space-y-3">
                                    {selectedOrder.items.map((item: OrderItem, index: number) => (
                                        <div key={index} className="flex justify-between items-start glass rounded-lg p-3">
                                            <div>
                                                <p className="font-medium">{item.title}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    Quantity: {item.quantity} • Service Units: {item.service_quantity.toLocaleString()}
                                                </p>
                                                {item.userInput && (
                                                    <div className="flex items-center gap-2 mt-2 text-sm text-accent-peach">
                                                        <LinkIcon className="w-4 h-4 flex-shrink-0" />
                                                        <a
                                                            href={item.userInput.startsWith('http') ? item.userInput : `https://www.instagram.com/${item.userInput.replace('@','')}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="truncate font-mono text-xs font-semibold hover:underline"
                                                        >
                                                            {item.userInput}
                                                        </a>
                                                    </div>
                                                )}
                                            </div>
                                            <p className="font-semibold flex-shrink-0">₹{(item.price * item.quantity).toFixed(2)}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <Separator />

                            {/* Status Update Section */}
                            <div>
                                <Label className="font-semibold">Update Order Status</Label>
                                <Select value={newStatus} onValueChange={(value) => setNewStatus(value as Order['status'])}>
                                    <SelectTrigger className="mt-2">
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