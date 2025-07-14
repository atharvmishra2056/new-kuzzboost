import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Package, Calendar, Download, Eye } from "lucide-react";
import { SiInstagram, SiYoutube, SiDiscord, SiTwitch, SiSpotify, SiWhatsapp, SiSnapchat, SiX } from "react-icons/si";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { orderService, OrderData } from "../services/orderService";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import jsPDF from 'jspdf';

// Icon mapping
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

interface Order {
  orderId: string;
  items: any[];
  total: number;
  customerInfo: any;
  transactionId: string;
  status: string;
  createdAt: any;
}

const OrderHistory = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) {
      navigate('/auth');
      return;
    }

    const fetchOrders = async () => {
      try {
        const ordersData = orderService.getUserOrders(currentUser.id);
        setOrders(ordersData);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [currentUser, navigate]);

  const generateInvoicePDF = (order: Order) => {
    const pdf = new jsPDF();
    
    // Header
    pdf.setFontSize(20);
    pdf.text('KuzzBoost - Order Invoice', 20, 30);
    
    // Order details
    pdf.setFontSize(12);
    pdf.text(`Order ID: ${order.orderId}`, 20, 50);
    pdf.text(`Date: ${order.createdAt?.toDate?.()?.toLocaleString() || 'N/A'}`, 20, 60);
    pdf.text(`Transaction ID: ${order.transactionId}`, 20, 70);
    
    // Customer info
    pdf.text('Customer Information:', 20, 90);
    pdf.text(`Name: ${order.customerInfo.firstName} ${order.customerInfo.lastName}`, 20, 100);
    pdf.text(`Email: ${order.customerInfo.email}`, 20, 110);
    pdf.text(`Phone: ${order.customerInfo.phone}`, 20, 120);
    
    // Items
    let yPos = 140;
    pdf.text('Order Items:', 20, yPos);
    yPos += 10;
    
    order.items.forEach((item, index) => {
      const unitPrice = item.serviceQuantity ? (item.price / item.serviceQuantity).toFixed(4) : item.price.toFixed(2);
      pdf.text(`${index + 1}. ${item.title} (${item.platform})`, 20, yPos);
      pdf.text(`Quantity: ${item.quantity} | Unit Price: ₹${unitPrice} | Total: ₹${(item.price * item.quantity).toFixed(2)}`, 25, yPos + 10);
      yPos += 20;
    });
    
    // Total
    yPos += 10;
    pdf.text(`Total Amount: ₹${order.total.toFixed(2)}`, 20, yPos);
    
    // Footer
    pdf.text('Thank you for choosing KuzzBoost!', 20, yPos + 20);
    
    pdf.save(`KuzzBoost-Invoice-${order.orderId}.pdf`);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
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
    <div className="min-h-screen bg-gradient-hero">
      <Navigation />
      
      <div className="pt-20 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
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
              <Button onClick={() => navigate('/services')} className="glass-button">
                Browse Services
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order, index) => (
                 <motion.div
                   key={order.orderId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="glass border-border/50">
                    <CardHeader className="pb-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                          <CardTitle className="font-clash text-xl text-primary">
                            Order #{order.orderId}
                          </CardTitle>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                            <Calendar className="w-4 h-4" />
                            {order.createdAt?.toDate?.()?.toLocaleDateString() || 'N/A'}
                          </div>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                          <Badge className={`${getStatusColor(order.status)} capitalize`}>
                            {order.status}
                          </Badge>
                          <div className="text-right">
                            <p className="font-semibold text-primary">₹{order.total.toFixed(2)}</p>
                            <p className="text-xs text-muted-foreground">{order.items.length} items</p>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      {/* Order Items */}
                      <div className="space-y-3">
                        {order.items.map((item, itemIndex) => (
                          <div key={itemIndex} className="flex items-center gap-3 p-3 glass rounded-xl">
                            <div className="text-lg">
                              {iconMap[item.iconName || 'placeholder']}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h5 className="font-medium text-primary text-sm truncate">
                                {item.title}
                              </h5>
                              <p className="text-xs text-muted-foreground">
                                {item.platform} • Qty: {item.quantity}
                              </p>
                              {item.serviceQuantity && (
                                <p className="text-xs text-accent-peach">
                                  {item.serviceQuantity.toLocaleString()} units
                                </p>
                              )}
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-primary text-sm">
                                ₹{(item.price * item.quantity).toFixed(2)}
                              </p>
                              {item.serviceQuantity && (
                                <p className="text-xs text-muted-foreground">
                                  ₹{((item.price * item.quantity) / item.serviceQuantity).toFixed(4)}/unit
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>

                      <Separator />

                      {/* Transaction Details */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Transaction ID</p>
                          <p className="font-mono font-medium">{order.transactionId}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Payment Method</p>
                          <p className="font-medium">UPI</p>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col sm:flex-row gap-3 pt-2">
                        <Button
                          onClick={() => generateInvoicePDF(order)}
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-2"
                        >
                          <Download className="w-4 h-4" />
                          Download Invoice
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="flex items-center gap-2"
                          onClick={() => navigate(`/order-details/${order.orderId}`)}
                        >
                          <Eye className="w-4 h-4" />
                          View Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default OrderHistory;