import { useState, useEffect, useCallback } from "react";
import { supabase } from '@/integrations/supabase/client';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Order, RefillRequest } from "@/types/service";
import { Separator } from "@/components/ui/separator";
import { Link as LinkIcon, Search, ArrowDown, ArrowUp, MoreVertical, RefreshCw } from "lucide-react";
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Link } from "react-router-dom";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface OrderItem {
    id: number;
    title: string;
    platform: string;
    quantity: number;
    service_quantity: number;
    price: number;
    userInput: string;
    refill_eligible?: boolean;
}

type GroupKey = Order['status'];

interface OrderGroup {
    id: GroupKey;
    title: string;
    emoji: string;
    orders: Order[];
    color: string;
    bgColor: string;
    borderColor: string;
}

interface OrderWithRefill extends Order {
    refill_requests?: RefillRequest[];
}

const AdminOrders = () => {
    const [orders, setOrders] = useState<OrderWithRefill[]>([]);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<OrderWithRefill | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newStatus, setNewStatus] = useState<Order['status'] | ''>('');
    const { toast } = useToast();

    // State for search and filter
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [viewMode, setViewMode] = useState<'table' | 'kanban'>('kanban');
    const [expandedGroups, setExpandedGroups] = useState<Record<GroupKey, boolean>>(() => ({
        pending: true,
        processing: true,
        completed: true,
        cancelled: true,
        shipped: true
    }));
    // ---

    const fetchOrders = async () => {
        setLoading(true);
        try {
            // Fetch orders with their refill requests
            const { data, error } = await supabase
                .from('orders')
                .select(`
                    *,
                    refill_requests (
                        id,
                        status,
                        requested_at
                    )
                `)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setOrders(data as unknown as OrderWithRefill[]);
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

    const updateOrderInDatabase = async (orderId: string, status: Order['status'], paymentVerified: boolean, oldStatus: Order['status']) => {
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

            // Award referral credits when order is completed
            if (status === 'completed' && oldStatus !== 'completed') {
                try {
                    console.log(`Order ${orderId} marked as completed, checking for referral credits...`);
                    
                    // Get order details
                    const { data: order, error: orderError } = await supabase
                        .from('orders')
                        .select('user_id, total_amount')
                        .eq('id', orderId)
                        .single();

                    if (orderError || !order) {
                        console.error('Failed to fetch order for referral processing:', orderError);
                        return;
                    }

                    // Get referrer using database function
                    const { data: referrerId, error: referralError } = await supabase
                        .rpc('get_referrer' as any, { referred_user_id: order.user_id });

                    if (referralError) {
                        console.error('Error checking referral:', referralError);
                        return;
                    }

                    if (referrerId) {
                        const creditAmount = Number(order.total_amount) * 0.02;
                        
                        console.log(`Awarding ${creditAmount} credits to referrer ${referrerId}`);
                        
                        // Call the increment_credits function
                        const { error: creditError } = await supabase
                            .rpc('increment_credits' as any, { 
                                p_user_id: referrerId, 
                                p_amount: creditAmount 
                            });

                        if (creditError) {
                            console.error('Failed to add referral credits:', creditError);
                            toast({ 
                                title: "Warning", 
                                description: `Order completed, but failed to award referral credits.`, 
                                variant: "destructive" 
                            });
                        } else {
                            console.log(`Successfully added ${creditAmount} credits to referrer`);
                            toast({ 
                                title: "Success", 
                                description: `Order completed! Awarded ₹${creditAmount.toFixed(2)} referral credits.`,
                                duration: 5000
                            });
                        }
                    }
                } catch (error) {
                    console.error('Error processing referral credits:', error);
                    // Don't show error toast for referral issues, just log them
                }
            }
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
            updateOrderInDatabase(selectedOrder.id, 'processing', true, selectedOrder.status);
        }
    };

    const handleSaveChanges = () => {
        if (selectedOrder && newStatus && newStatus !== selectedOrder.status) {
            updateOrderInDatabase(selectedOrder.id, newStatus, selectedOrder.payment_verified, selectedOrder.status);
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

    // Group orders by status
    const groupOrders = useCallback((orders: Order[]): OrderGroup[] => {
        const groups: OrderGroup[] = [
            {
                id: 'pending',
                title: 'Payment Pending',
                emoji: '🟡',
                orders: [],
                color: 'text-yellow-600',
                bgColor: 'bg-yellow-50',
                borderColor: 'border-yellow-200'
            },
            {
                id: 'processing',
                title: 'In Progress',
                emoji: '🔄',
                orders: [],
                color: 'text-blue-600',
                bgColor: 'bg-blue-50',
                borderColor: 'border-blue-200'
            },
            {
                id: 'completed',
                title: 'Completed',
                emoji: '✅',
                orders: [],
                color: 'text-green-600',
                bgColor: 'bg-green-50',
                borderColor: 'border-green-200'
            },
            {
                id: 'cancelled',
                title: 'Failed/Cancelled',
                emoji: '❌',
                orders: [],
                color: 'text-red-600',
                bgColor: 'bg-red-50',
                borderColor: 'border-red-200'
            },
            {
                id: 'shipped',
                title: 'Shipped',
                emoji: '🚚',
                orders: [],
                color: 'text-purple-600',
                bgColor: 'bg-purple-50',
                borderColor: 'border-purple-200'
            }
        ];

        // Categorize orders by their status
        orders.forEach(order => {
            // Check for unpaid orders (pending or processing status with payment_verified: false)
            if (!order.payment_verified && (order.status === 'pending' || order.status === 'processing')) {
                groups.find(g => g.id === 'pending')?.orders.push(order);
            } else {
                // Add to status-based group
                const statusGroup = groups.find(g => g.id === order.status);
                if (statusGroup) {
                    statusGroup.orders.push(order);
                }
            }
        });

        // Sort orders within each group by creation date (newest first)
        groups.forEach(group => {
            group.orders.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        });

        return groups;
    }, []);

    // Filter and group orders
    const filteredOrders = useCallback(() => {
        const filtered = orders.filter(order => {
            const lowercasedTerm = searchTerm.toLowerCase();
            const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
            const matchesSearch = searchTerm.trim() === '' ||
                order.order_id.toLowerCase().includes(lowercasedTerm) ||
                order.user_email.toLowerCase().includes(lowercasedTerm) ||
                (order.customer_info?.firstName && order.customer_info.firstName.toLowerCase().includes(lowercasedTerm)) ||
                (order.customer_info?.lastName && order.customer_info.lastName.toLowerCase().includes(lowercasedTerm));

            return matchesStatus && matchesSearch;
        });

        return groupOrders(filtered);
    }, [orders, searchTerm, statusFilter, groupOrders]);

    const groupedOrders = filteredOrders();
    
    // Handle drag and drop
    const onDragEnd = async (result: DropResult) => {
        const { source, destination, draggableId } = result;

        // Dropped outside the list
        if (!destination) return;

        // No change in position
        if (source.droppableId === destination.droppableId && source.index === destination.index) return;

        // Find the order that was dragged
        const orderId = draggableId.split('-')[1];
        const order = orders.find(o => o.id === orderId);
        if (!order) return;

        // Determine the new status based on the destination group
        let newStatus = order.status;
        if (destination.droppableId !== source.droppableId) {
            switch (destination.droppableId) {
                case 'pending': newStatus = 'pending'; break;
                case 'processing': newStatus = 'processing'; break;
                case 'completed': newStatus = 'completed'; break;
                case 'cancelled': newStatus = 'cancelled'; break;
                default: break;
            }
        }

        // Update the order status in the database
        if (newStatus !== order.status) {
            setSelectedOrder(order);
            setNewStatus(newStatus);
            await updateOrderInDatabase(order.id, newStatus, order.payment_verified, order.status);
        }
    };

    // Toggle group expansion
    const toggleGroup = (groupId: GroupKey) => {
        setExpandedGroups(prev => ({
            ...prev,
            [groupId]: !prev[groupId]
        }));
    };

    if (loading && orders.length === 0) return <div>Loading orders...</div>;

    // Render order card for Kanban view
    const renderOrderCard = (order: OrderWithRefill) => (
        <Draggable key={`order-${order.id}`} draggableId={`order-${order.id}`} index={0}>
            {(provided) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className="mb-3 cursor-move"
                >
                    <Card className="hover:shadow-md transition-shadow">
                        <CardHeader className="p-4 pb-2">
                            <div className="flex justify-between items-start">
                                <div>
                                    <CardTitle className="text-sm font-medium">
                                        {order.order_id}
                                    </CardTitle>
                                    <p className="text-xs text-muted-foreground">
                                        {new Date(order.created_at).toLocaleDateString()}
                                    </p>
                                </div>
                                <Badge className={`${getStatusColor(order.status)} capitalize`}>
                                    {order.status}
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                            <p className="text-sm font-medium">
                                {order.customer_info?.firstName} {order.customer_info?.lastName}
                            </p>
                            <p className="text-xs text-muted-foreground">{order.user_email}</p>
                            <div className="flex justify-between items-center mt-2">
                                <p className="text-sm font-semibold">
                                    ₹{order.total_amount.toFixed(2)}
                                </p>
                                {order.refill_requests && order.refill_requests.length > 0 && (
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Badge 
                                                    variant={order.refill_requests[0].status === 'approved' ? 'default' : 'outline'}
                                                    className={`text-xs ${
                                                        order.refill_requests[0].status === 'approved' ? 'bg-green-100 text-green-800' : 
                                                        order.refill_requests[0].status === 'rejected' ? 'bg-red-100 text-red-800' :
                                                        'bg-yellow-100 text-yellow-800'
                                                    }`}
                                                >
                                                    Refill: {order.refill_requests[0].status}
                                                </Badge>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>Refill requested on {new Date(order.refill_requests[0].requested_at).toLocaleDateString()}</p>
                                                {order.refill_requests[0].status === 'approved' && (
                                                    <p>Click to view in Refill Requests</p>
                                                )}
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                )}
                            </div>
                            <div className="mt-2 flex justify-between items-center">
                                <Badge variant={order.payment_verified ? 'default' : 'secondary'} className="text-xs">
                                    {order.payment_verified ? 'Paid' : 'Unpaid'}
                                </Badge>
                                <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="h-6 px-2 text-xs"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleManageClick(order);
                                    }}
                                >
                                    View
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </Draggable>
    );

    return (
        <div>
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                <div className="flex items-center gap-4">
                    <h1 className="text-3xl font-bold">All Orders</h1>
                    <Button 
                        variant="outline" 
                        size="sm" 
                        asChild
                        className="ml-2"
                    >
                        <Link to="/admin/refill-requests" className="flex items-center gap-2">
                            <RefreshCw className="h-4 w-4" />
                            View Refill Requests
                        </Link>
                    </Button>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3 mt-4 md:mt-0">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search by ID, email, name..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 w-full sm:w-64"
                        />
                    </div>
                    
                    <div className="flex gap-2">
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
                        
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="icon">
                                    {viewMode === 'table' ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                                            <line x1="3" y1="9" x2="21" y2="9"></line>
                                            <line x1="3" y1="15" x2="21" y2="15"></line>
                                            <line x1="9" y1="3" x2="9" y2="21"></line>
                                            <line x1="15" y1="3" x2="15" y2="21"></line>
                                        </svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <rect x="3" y="3" width="7" height="7"></rect>
                                            <rect x="14" y="3" width="7" height="7"></rect>
                                            <rect x="14" y="14" width="7" height="7"></rect>
                                            <rect x="3" y="14" width="7" height="7"></rect>
                                        </svg>
                                    )}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem onClick={() => setViewMode('table')}>
                                    Table View
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setViewMode('kanban')}>
                                    Kanban View
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </div>

            {viewMode === 'table' ? (
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
                                <TableHead>Refill</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {groupedOrders.flatMap(group => 
                                group.orders.length > 0 ? [
                                    <TableRow key={`group-${group.id}`} className="bg-muted/50">
                                        <TableCell colSpan={7} className="font-medium">
                                            <div className="flex items-center gap-2">
                                                <button 
                                                    onClick={() => toggleGroup(group.id)}
                                                    className="p-1 -ml-2 rounded hover:bg-muted"
                                                >
                                                    {expandedGroups[group.id] ? (
                                                        <ArrowUp className="h-4 w-4" />
                                                    ) : (
                                                        <ArrowDown className="h-4 w-4" />
                                                    )}
                                                </button>
                                                <span className={group.color}>
                                                    {group.emoji} {group.title} ({group.orders.length})
                                                </span>
                                            </div>
                                        </TableCell>
                                    </TableRow>,
                                    ...(expandedGroups[group.id] ? group.orders.map((order) => (
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
                                                {order.refill_requests && order.refill_requests.length > 0 ? (
                                                    <TooltipProvider>
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <Badge 
                                                                    variant={order.refill_requests[0].status === 'approved' ? 'default' : 'outline'}
                                                                    className={`${
                                                                        order.refill_requests[0].status === 'approved' ? 'bg-green-100 text-green-800' : 
                                                                        order.refill_requests[0].status === 'rejected' ? 'bg-red-100 text-red-800' :
                                                                        'bg-yellow-100 text-yellow-800'
                                                                    }`}
                                                                >
                                                                    {order.refill_requests[0].status}
                                                                </Badge>
                                                            </TooltipTrigger>
                                                            <TooltipContent>
                                                                <p>Refill requested on {new Date(order.refill_requests[0].requested_at).toLocaleDateString()}</p>
                                                                {order.refill_requests[0].status === 'approved' && (
                                                                    <p>Click to view in Refill Requests</p>
                                                                )}
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </TooltipProvider>
                                                ) : (
                                                    <Badge variant="outline" className="text-muted-foreground">
                                                        None
                                                    </Badge>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <Button variant="outline" size="sm" onClick={() => handleManageClick(order)}>
                                                    Manage
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    )) : [])
                                ] : []
                            )}
                        </TableBody>
                    </Table>
                </div>
            ) : (
                <DragDropContext onDragEnd={onDragEnd}>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {groupedOrders.map(group => (
                            <div key={group.id} className="flex flex-col h-full">
                                <div className={`p-3 rounded-t-lg border-b ${group.bgColor} ${group.borderColor} border`}>
                                    <div className="flex justify-between items-center">
                                        <h3 className="font-semibold">
                                            {group.emoji} {group.title} <span className="text-muted-foreground">({group.orders.length})</span>
                                        </h3>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-6 w-6">
                                                    <MoreVertical className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent>
                                                <DropdownMenuItem onClick={() => toggleGroup(group.id)}>
                                                    {expandedGroups[group.id] ? 'Collapse' : 'Expand'}
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </div>
                                <Droppable droppableId={group.id}>
                                    {(provided) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.droppableProps}
                                            className={`p-3 border border-t-0 rounded-b-lg ${group.bgColor}/30 ${group.borderColor} min-h-[100px]`}
                                        >
                                            <ScrollArea className={`h-[calc(100vh-300px)] ${!expandedGroups[group.id] ? 'hidden' : ''}`}>
                                                <div className="space-y-2">
                                                    {group.orders.length > 0 ? (
                                                        group.orders.map((order, index) => renderOrderCard(order))
                                                    ) : (
                                                        <div className="text-center p-4 text-muted-foreground text-sm">
                                                            No orders in this group
                                                        </div>
                                                    )}
                                                </div>
                                            </ScrollArea>
                                            {!expandedGroups[group.id] && (
                                                <div className="text-center p-4 text-muted-foreground text-sm">
                                                    {group.orders.length} orders (collapsed)
                                                </div>
                                            )}
                                            {provided.placeholder}
                                        </div>
                                    )}
                                </Droppable>
                            </div>
                        ))}
                    </div>
                </DragDropContext>
            )}

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
                                                    Quantity: {item.quantity}{item.service_quantity !== undefined && ` • Service Units: ${item.service_quantity.toLocaleString()}`}
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