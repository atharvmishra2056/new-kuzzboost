import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Package, Calendar, Download, Eye, RefreshCw } from "lucide-react";
import { SiInstagram, SiYoutube, SiDiscord, SiTwitch, SiSpotify, SiWhatsapp, SiSnapchat, SiX } from "react-icons/si";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import jsPDF from 'jspdf';

// --- Self-Contained Type Definitions ---
// This section bypasses the broken external type generation.

interface OrderItem {
  id: number;
  title: string;
  platform: string;
  quantity: number;
  price: number;
  serviceQuantity?: number;
  iconName?: string;
}

interface CustomerInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

// The final, structured Order type for the frontend
interface DisplayOrder {
  orderId: string;
  items: OrderItem[];
  total: number;
  customerInfo: CustomerInfo;
  transactionId: string;
  status: string;
  createdAt: string;
  isRefillable: boolean;
}

// Type for the raw order data coming from Supabase
interface SupabaseOrder {
  order_id: string;
  items: any; // Initially 'any' to handle potential inconsistencies
  total_amount: number;
  customer_info: any;
  transaction_id: string | null;
  status: string;
  created_at: string;
  user_id: string;
}

// Type for the service data from Supabase
interface SupabaseService {
    id: number;
    refill_eligible: boolean | null;
}

const iconMap: { [key: string]: React.ReactElement } = {
  SiInstagram: <SiInstagram className="w-6 h-6 text-[#E4405F]" />,
  SiYoutube: <SiYoutube className="w-6 h-6 text-[#FF0000]" />,
  SiX: <SiX className="w-6 h-6 text-[#000000]" />,
  SiDiscord: <SiDiscord className="w-6 h-6 text-[#7289DA]" />,
  SiTwitch: <SiTwitch className="w-6 h-6 text-[#9146FF]" />,
  SiSpotify: <SiSpotify className="w-6 h-6 text-[#1DB954]" />,
  SiWhatsapp: <SiWhatsapp className="w-6 h-6 text-[#25D366]" />,
  SiSnapchat: <SiSnapchat className="w-6 h-6 text-[#FFFC00]" />,
  placeholder: <div className="w-6 h-6 bg-accent-peach rounded-full" />
};

const OrderHistory = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [orders, setOrders] = useState<DisplayOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) {
      navigate('/auth');
      return;
    }

    const fetchAndProcessOrders = async () => {
      setLoading(true);
      try {
        const { data: ordersData, error: ordersError } = await supabase
          .from('orders')
          .select('*')
          .eq('user_id', currentUser.id)
          .order('created_at', { ascending: false }) as { data: SupabaseOrder[] | null, error: any };

        if (ordersError) throw ordersError;
        if (!ordersData) {
          setOrders([]);
          return;
        }

        const serviceIds = new Set<number>();
        ordersData.forEach(order => {
          if (Array.isArray(order.items)) {
            order.items.forEach((item: any) => {
              if (item && typeof item.id === 'number') {
                serviceIds.add(item.id);
              }
            });
          }
        });

        let refillableServiceIds = new Set<number>();
        if (serviceIds.size > 0) {
          const { data: servicesData, error: servicesError } = await supabase
            .from('services')
            .select('id, refill_eligible')
            .in('id', Array.from(serviceIds))
            .eq('refill_eligible', true) as { data: SupabaseService[] | null, error: any };

          if (servicesError) throw servicesError;
          if (servicesData) {
            refillableServiceIds = new Set(servicesData.map(s => s.id));
          }
        }

        const formattedOrders: DisplayOrder[] = ordersData.map(order => {
          const items: OrderItem[] = Array.isArray(order.items) ? order.items : [];
          const isRefillable = items.some(item => refillableServiceIds.has(item.id));
          
          return {
            orderId: order.order_id,
            items: items,
            total: order.total_amount,
            customerInfo: order.customer_info as CustomerInfo,
            transactionId: order.transaction_id || '',
            status: order.status,
            createdAt: order.created_at,
            isRefillable: isRefillable,
          };
        });

        setOrders(formattedOrders);
      } catch (error) {
        console.error("Error fetching and processing orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAndProcessOrders();

    const channel = supabase
      .channel('public:orders')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders', filter: `user_id=eq.${currentUser.id}` }, 
      () => fetchAndProcessOrders())
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentUser, navigate]);

  const generateInvoicePDF = (order: DisplayOrder) => {
    const pdf = new jsPDF();
    
    pdf.setFontSize(20);
    pdf.text('KuzzBoost - Order Invoice', 20, 30);
    
    pdf.setFontSize(12);
    pdf.text(`Order ID: ${order.orderId}`, 20, 50);
    pdf.text(`Date: ${new Date(order.createdAt).toLocaleString() || 'N/A'}`, 20, 60);
    pdf.text(`Transaction ID: ${order.transactionId}`, 20, 70);
    
    if (order.customerInfo) {
      pdf.text('Customer Information:', 20, 90);
      pdf.text(`Name: ${order.customerInfo.firstName} ${order.customerInfo.lastName}`, 20, 100);
      pdf.text(`Email: ${order.customerInfo.email}`, 20, 110);
      pdf.text(`Phone: ${order.customerInfo.phone}`, 20, 120);
    }
    
    let yPos = order.customerInfo ? 140 : 90;
    pdf.text('Order Items:', 20, yPos);
    yPos += 10;
    
    order.items.forEach((item, index) => {
      const unitPrice = item.serviceQuantity ? (item.price / item.serviceQuantity).toFixed(4) : item.price.toFixed(2);
      pdf.text(`${index + 1}. ${item.title} (${item.platform})`, 20, yPos);
      pdf.text(`Quantity: ${item.quantity} | Unit Price: ₹${unitPrice} | Total: ₹${(item.price * item.quantity).toFixed(2)}`, 25, yPos + 10);
      yPos += 20;
    });
    
    yPos += 10;
    pdf.text(`Total Amount: ₹${order.total.toFixed(2)}`, 20, yPos);
    
    pdf.text('Thank you for choosing KuzzBoost!', 20, yPos + 20);
    
    pdf.save(`KuzzBoost-Invoice-${order.orderId}.pdf`);
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'bg-green-500/20 text-green-700 border-green-500/30';
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-700 border-yellow-500/30';
      case 'cancelled':
        return 'bg-red-500/20 text-red-700 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-700 border-gray-500/30';
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Button>
            <h1 className="font-clash text-3xl md:text-4xl font-bold text-primary">
              Order History
            </h1>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground">Loading your orders...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-clash text-xl font-semibold text-primary mb-2">No orders yet</h3>
              <p className="text-muted-foreground mb-6">Start shopping to see your orders here!</p>
              <Button onClick={() => navigate('/dashboard/services')} className="glass-button">
                Browse Services
              </Button>
            </div>
          ) : (
            <Accordion type="single" collapsible className="w-full space-y-4">
              {orders.map((order, index) => (
                <motion.div
                  key={order.orderId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <AccordionItem value={order.orderId} className="border border-border/50 rounded-lg glass">
                    <AccordionTrigger className="p-4 hover:no-underline">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center w-full gap-4">
                        <div className="text-left">
                          <p className="font-bold text-primary">Order #{order.orderId.substring(0, 8)}</p>
                          <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-4">
                          <Badge className={`${getStatusColor(order.status)} capitalize`}>{order.status}</Badge>
                          <p className="font-semibold text-lg text-primary">₹{order.total.toFixed(2)}</p>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="p-4 pt-0">
                      <Separator className="my-3" />
                      <div className="space-y-3 mb-4">
                        {order.items.map((item, itemIndex) => (
                          <div key={itemIndex} className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                              <div className="text-lg w-6 text-center">
                                {iconMap[item.iconName || 'placeholder']}
                              </div>
                              <div>
                                <h5 className="font-medium text-primary text-sm">{item.title}</h5>
                                <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                              </div>
                            </div>
                            <p className="font-semibold text-primary text-sm">₹{(item.price * item.quantity).toFixed(2)}</p>
                          </div>
                        ))}
                      </div>
                      <div className="flex justify-end gap-3 pt-2">
                        <Button
                          onClick={() => navigate(`/dashboard/order-details/${order.orderId}`)}
                          variant="ghost"
                          size="sm"
                          className="flex items-center gap-2"
                        >
                          <Eye className="w-4 h-4" />
                          View Details
                        </Button>
                        <Button
                          onClick={() => generateInvoicePDF(order)}
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-2"
                        >
                          <Download className="w-4 h-4" />
                          Download Invoice
                        </Button>
                        {order.isRefillable && (
                          <Button
                            onClick={() => navigate(`/dashboard/request-refill/${order.orderId}`)}
                            variant="default"
                            size="sm"
                            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
                          >
                            <RefreshCw className="w-4 h-4" />
                            Request Refill
                          </Button>
                        )}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </motion.div>
              ))}
            </Accordion>
          )}
        </div>
      </div>
  );
};

export default OrderHistory;