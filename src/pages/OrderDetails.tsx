import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Package, Calendar, Download, Eye, MapPin, Clock, Shield, AlertCircle } from "lucide-react";
import { SiInstagram, SiYoutube, SiDiscord, SiTwitch, SiSpotify, SiWhatsapp, SiSnapchat, SiX } from "react-icons/si";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { supabase } from '@/integrations/supabase/client';
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import jsPDF from 'jspdf';

// Icon mapping
const iconMap: { [key: string]: React.ReactElement } = {
  SiInstagram: <SiInstagram className="w-8 h-8 text-[#E4405F]" />,
  SiYoutube: <SiYoutube className="w-8 h-8 text-[#FF0000]" />,
  SiX: <SiX className="w-8 h-8 text-[#000000]" />,
  SiDiscord: <SiDiscord className="w-8 h-8 text-[#7289DA]" />,
  SiTwitch: <SiTwitch className="w-8 h-8 text-[#9146FF]" />,
  SiSpotify: <SiSpotify className="w-8 h-8 text-[#1DB954]" />,
  SiWhatsapp: <SiWhatsapp className="w-8 h-8 text-[#25D366]" />,
  SiSnapchat: <SiSnapchat className="w-8 h-8 text-[#FFFC00]" />,
  placeholder: <div className="w-8 h-8 bg-accent-peach rounded-full" />
};

interface Order {
  id: string;
  orderId: string;
  items: any[];
  total: number;
  customerInfo: any;
  transactionId: string;
  status: string;
  createdAt: any;
  estimatedDelivery?: string;
  trackingInfo?: {
    stage: string;
    progress: number;
    details: string;
    timestamp: Date;
  }[];
}

const OrderDetails = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) {
      navigate('/auth');
      return;
    }

    const fetchOrder = async () => {
      if (!orderId) return;
      
      try {
        const { data: orderData, error } = await supabase
          .from('orders')
          .select('*')
          .eq('order_id', orderId)
          .eq('user_id', currentUser.id)
          .single();
          
        if (error) throw error;
        
        if (orderData) {
          // Add mock tracking info for demo
          const order = {
            id: orderData.id,
            orderId: orderData.order_id,
            items: orderData.items,
            total: orderData.total_amount,
            customerInfo: orderData.customer_info,
            transactionId: orderData.transaction_id,
            status: orderData.status,
            createdAt: { toDate: () => new Date(orderData.created_at) },
            trackingInfo: [
              {
                stage: "Order Confirmed",
                progress: 25,
                details: "Your order has been confirmed and is being processed",
                timestamp: new Date(orderData.created_at)
              },
              {
                stage: "Processing",
                progress: 50,
                details: "We are working on your order",
                timestamp: new Date(Date.now() + 1000 * 60 * 60) // 1 hour later
              },
              {
                stage: "In Progress",
                progress: 75,
                details: "Your service is being delivered",
                timestamp: new Date(Date.now() + 1000 * 60 * 60 * 24) // 1 day later
              },
              {
                stage: "Completed",
                progress: 100,
                details: "Order completed successfully",
                timestamp: new Date(Date.now() + 1000 * 60 * 60 * 48) // 2 days later
              }
            ]
          } as Order;
          
          setOrder(order);
        }
      } catch (error) {
        console.error("Error fetching order:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, currentUser, navigate]);

  const generateInvoicePDF = () => {
    if (!order) return;

    const pdf = new jsPDF();
    
    // Header
    pdf.setFontSize(20);
    pdf.text('KuzzBoost - Order Invoice', 20, 30);
    
    // Order details
    pdf.setFontSize(12);
    pdf.text(`Order ID: ${order.orderId}`, 20, 50);
    pdf.text(`Date: ${order.createdAt?.toDate?.()?.toLocaleString() || 'N/A'}`, 20, 60);
    pdf.text(`Transaction ID: ${order.transactionId}`, 20, 70);
    pdf.text(`Status: ${order.status}`, 20, 80);
    
    // Customer info
    pdf.text('Customer Information:', 20, 100);
    pdf.text(`Name: ${order.customerInfo.firstName} ${order.customerInfo.lastName}`, 20, 110);
    pdf.text(`Email: ${order.customerInfo.email}`, 20, 120);
    pdf.text(`Phone: ${order.customerInfo.phone}`, 20, 130);
    
    // Items
    let yPos = 150;
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
      case 'processing':
        return 'bg-blue-500/20 text-blue-700 border-blue-500/30';
      case 'cancelled':
        return 'bg-red-500/20 text-red-700 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-700 border-gray-500/30';
    }
  };

  const getCurrentProgress = () => {
    if (!order?.trackingInfo) return 25;
    
    const currentStage = order.trackingInfo.find(stage => {
      const stageTime = new Date(stage.timestamp);
      return stageTime <= new Date();
    });
    
    return currentStage?.progress || 25;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-hero">
        <Navigation />
        <div className="pt-20 pb-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading order details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gradient-hero">
        <Navigation />
        <div className="pt-20 pb-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <AlertCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="font-clash text-2xl font-bold text-primary mb-2">Order Not Found</h2>
            <p className="text-muted-foreground mb-6">The order you're looking for doesn't exist or you don't have permission to view it.</p>
            <Button onClick={() => navigate('/order-history')} className="glass-button">
              View Order History
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-hero">
      <Navigation />
      
      <div className="pt-20 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/order-history')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Orders
            </Button>
            <h1 className="font-clash text-3xl md:text-4xl font-bold text-primary">
              Order Details
            </h1>
          </div>

          <div className="space-y-8">
            {/* Order Overview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="glass border-border/50">
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <CardTitle className="font-clash text-2xl text-primary">
                        Order #{order.orderId}
                      </CardTitle>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {order.createdAt?.toDate?.()?.toLocaleDateString() || 'N/A'}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          Estimated delivery: {order.estimatedDelivery || "1-3 days"}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col sm:items-end gap-2">
                      <Badge className={`${getStatusColor(order.status)} capitalize`}>
                        {order.status}
                      </Badge>
                      <p className="font-semibold text-primary text-xl">₹{order.total.toFixed(2)}</p>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </motion.div>

            {/* Order Progress */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="glass border-border/50">
                <CardHeader>
                  <CardTitle className="font-clash text-xl text-primary flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Order Progress
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Progress</span>
                        <span>{getCurrentProgress()}%</span>
                      </div>
                      <Progress value={getCurrentProgress()} className="h-2" />
                    </div>

                    <div className="space-y-4">
                      {order.trackingInfo?.map((stage, index) => {
                        const isCompleted = new Date(stage.timestamp) <= new Date();
                        const isActive = index === order.trackingInfo!.findIndex(s => 
                          new Date(s.timestamp) <= new Date()
                        );
                        
                        return (
                          <div key={index} className={`flex gap-4 ${isCompleted ? 'opacity-100' : 'opacity-50'}`}>
                            <div className={`w-3 h-3 rounded-full mt-1 ${
                              isCompleted ? 'bg-accent-peach' : 'bg-muted'
                            } ${isActive ? 'ring-2 ring-accent-peach/50' : ''}`} />
                            <div className="flex-1">
                              <h4 className="font-medium text-primary">{stage.stage}</h4>
                              <p className="text-sm text-muted-foreground">{stage.details}</p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {new Date(stage.timestamp).toLocaleString()}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Order Items */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="glass border-border/50">
                <CardHeader>
                  <CardTitle className="font-clash text-xl text-primary">
                    Order Items ({order.items.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex items-center gap-4 p-4 glass rounded-xl">
                        <div className="text-2xl">
                          {iconMap[item.iconName || 'placeholder']}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-primary">
                            {item.title}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {item.platform} • Qty: {item.quantity}
                          </p>
                          {item.serviceQuantity && (
                            <p className="text-sm text-accent-peach">
                              {item.serviceQuantity.toLocaleString()} units
                            </p>
                          )}
                          {item.userInput && (
                            <p className="text-xs text-muted-foreground mt-1">
                              Target: {item.userInput}
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-primary">
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
                </CardContent>
              </Card>
            </motion.div>

            {/* Payment & Customer Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Payment Information */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card className="glass border-border/50">
                  <CardHeader>
                    <CardTitle className="font-clash text-xl text-primary flex items-center gap-2">
                      <Shield className="w-5 h-5" />
                      Payment Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-sm text-muted-foreground">Transaction ID</p>
                      <p className="font-mono font-medium">{order.transactionId}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Payment Method</p>
                      <p className="font-medium">UPI</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Amount Paid</p>
                      <p className="font-semibold text-primary">₹{order.total.toFixed(2)}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Customer Information */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Card className="glass border-border/50">
                  <CardHeader>
                    <CardTitle className="font-clash text-xl text-primary">
                      Customer Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-sm text-muted-foreground">Name</p>
                      <p className="font-medium">
                        {order.customerInfo.firstName} {order.customerInfo.lastName}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium">{order.customerInfo.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <p className="font-medium">{order.customerInfo.phone}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Address</p>
                      <p className="font-medium text-sm">
                        {order.customerInfo.address}, {order.customerInfo.city}, {order.customerInfo.postalCode}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Button
                onClick={generateInvoicePDF}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download Invoice
              </Button>
              <Button
                onClick={() => navigate('/order-history')}
                className="glass-button flex items-center gap-2"
              >
                <Package className="w-4 h-4" />
                Back to My Orders
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default OrderDetails;