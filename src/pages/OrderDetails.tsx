import { useState, useEffect, ReactElement } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Package, Calendar, Download, CheckCircle, AlertCircle, Shield, User } from "lucide-react";
import { SiInstagram, SiYoutube, SiDiscord, SiTwitch, SiSpotify, SiWhatsapp, SiSnapchat, SiX } from "react-icons/si";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { supabase } from '@/integrations/supabase/client';
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import { Order } from "@/types/service";
import { cn } from "@/lib/utils";
import jsPDF from "jspdf";

// Icon mapping
const iconMap: { [key: string]: ReactElement } = {
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

      setLoading(true);
      try {
        const { data, error } = await supabase
            .from('orders')
            .select('*')
            .eq('order_id', orderId)
            .eq('user_id', currentUser.id)
            .single();

        if (error) throw error;

        setOrder(data as unknown as Order);
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

    pdf.setFontSize(20);
    pdf.text('KuzzBoost - Order Invoice', 20, 30);

    pdf.setFontSize(12);
    pdf.text(`Order ID: ${order.order_id}`, 20, 50);
    pdf.text(`Date: ${new Date(order.created_at).toLocaleString()}`, 20, 60);
    pdf.text(`Transaction ID: ${order.transaction_id}`, 20, 70);
    pdf.text(`Status: ${order.status}`, 20, 80);

    pdf.text('Customer Information:', 20, 100);
    // CORRECTED: Using firstName and lastName
    pdf.text(`Name: ${order.customer_info.firstName} ${order.customer_info.lastName}`, 20, 110);
    pdf.text(`Email: ${order.customer_info.email}`, 20, 120);
    pdf.text(`Phone: ${order.customer_info.phone}`, 20, 130);

    let yPos = 150;
    pdf.text('Order Items:', 20, yPos);
    yPos += 10;

    order.items.forEach((item, index) => {
      const unitPrice = item.service_quantity ? (item.price / item.service_quantity).toFixed(4) : item.price.toFixed(2);
      pdf.text(`${index + 1}. ${item.title} (${item.platform})`, 20, yPos);
      pdf.text(`Quantity: ${item.quantity} | Unit Price: ₹${unitPrice} | Total: ₹${(item.price * item.quantity).toFixed(2)}`, 25, yPos + 10);
      yPos += 20;
    });

    yPos += 10;
    pdf.text(`Total Amount: ₹${order.total_amount.toFixed(2)}`, 20, yPos);
    pdf.text('Thank you for choosing KuzzBoost!', 20, yPos + 20);
    pdf.save(`KuzzBoost-Invoice-${order.order_id}.pdf`);
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
        <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
          <p className="ml-4 text-muted-foreground">Loading Order Details...</p>
        </div>
    );
  }

  if (!order) {
    return (
        <div className="min-h-screen bg-gradient-hero">
          <Navigation />
          <div className="pt-20 pb-12 px-4 sm:px-6 lg:px-8 text-center">
            <AlertCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="font-clash text-2xl font-bold text-primary mb-2">Order Not Found</h2>
            <p className="text-muted-foreground mb-6">The order you're looking for doesn't exist or you don't have permission to view it.</p>
            <Button onClick={() => navigate('/order-history')} className="glass-button">
              View Order History
            </Button>
          </div>
          <Footer />
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
              <Button variant="ghost" size="sm" onClick={() => navigate('/order-history')} className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Orders
              </Button>
              <h1 className="font-clash text-3xl md:text-4xl font-bold text-primary">
                Order Details
              </h1>
            </div>

            <div className="space-y-8">
              {/* Order Overview */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <Card className="glass border-border/50">
                  <CardHeader>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <CardTitle className="font-clash text-2xl text-primary">Order #{order.order_id}</CardTitle>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
                          <div className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {new Date(order.created_at).toLocaleDateString()}</div>
                        </div>
                      </div>
                      <div className="flex flex-col sm:items-end gap-2">
                        <Badge className={`${getStatusColor(order.status)} capitalize`}>{order.status}</Badge>
                        <p className="font-semibold text-primary text-xl">₹{order.total_amount.toFixed(2)}</p>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              </motion.div>

              {/* Order Tracking Visualizer */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <Card className="glass border-border/50">
                  <CardHeader>
                    <CardTitle className="font-clash text-xl text-primary flex items-center gap-2">
                      <Package className="w-5 h-5" />
                      Order Tracking
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {order.tracking_info && order.tracking_info.map((event, index) => (
                          <div key={index} className="flex gap-4">
                            <div className="flex flex-col items-center">
                              <div className="w-6 h-6 rounded-full flex items-center justify-center bg-green-500">
                                <CheckCircle className="w-4 h-4 text-white" />
                              </div>
                              {index < order.tracking_info.length - 1 && <div className="w-0.5 flex-1 bg-green-500/50 my-1" />}
                            </div>
                            <div className={cn("pb-4", index === order.tracking_info.length - 1 && "pb-0")}>
                              <p className="font-semibold text-primary">{event.status}, {formatDate(event.timestamp)}</p>
                              <p className="text-sm text-muted-foreground">{event.description}</p>
                            </div>
                          </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Order Items */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <Card className="glass border-border/50">
                  <CardHeader><CardTitle className="font-clash text-xl text-primary">Order Items ({order.items.length})</CardTitle></CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {order.items.map((item, index) => (
                          <div key={index} className="flex items-center gap-4 p-4 glass rounded-xl">
                            <div className="text-2xl">{iconMap[item.iconName] || iconMap.placeholder}</div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-primary">{item.title}</h4>
                              <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                              {item.service_quantity && <p className="text-sm text-accent-peach">{item.service_quantity.toLocaleString()} units</p>}
                            </div>
                            <div className="text-right"><p className="font-semibold text-primary">₹{(item.price * item.quantity).toFixed(2)}</p></div>
                          </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Payment & Customer Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                  <Card className="glass border-border/50 h-full">
                    <CardHeader><CardTitle className="font-clash text-xl text-primary flex items-center gap-2"><Shield className="w-5 h-5" />Payment Information</CardTitle></CardHeader>
                    <CardContent className="space-y-3">
                      <div><p className="text-sm text-muted-foreground">Transaction ID</p><p className="font-mono font-medium">{order.transaction_id}</p></div>
                      <div><p className="text-sm text-muted-foreground">Payment Method</p><p className="font-medium">UPI</p></div>
                      <div><p className="text-sm text-muted-foreground">Amount Paid</p><p className="font-semibold text-primary">₹{order.total_amount.toFixed(2)}</p></div>
                    </CardContent>
                  </Card>
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                  <Card className="glass border-border/50 h-full">
                    <CardHeader><CardTitle className="font-clash text-xl text-primary flex items-center gap-2"><User className="w-5 h-5" />Customer Information</CardTitle></CardHeader>
                    <CardContent className="space-y-3">
                      {/* CORRECTED: Using firstName and lastName */}
                      <div><p className="text-sm text-muted-foreground">Name</p><p className="font-medium">{order.customer_info.firstName} {order.customer_info.lastName}</p></div>
                      <div><p className="text-sm text-muted-foreground">Email</p><p className="font-medium">{order.customer_info.email}</p></div>
                      <div><p className="text-sm text-muted-foreground">Phone</p><p className="font-medium">{order.customer_info.phone}</p></div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>

              {/* Actions */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                <Button onClick={generateInvoicePDF} variant="outline" className="w-full flex items-center gap-2">
                  <Download className="w-4 h-4" /> Download Invoice
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