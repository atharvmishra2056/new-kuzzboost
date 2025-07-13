export interface OrderData {
  orderId: string;
  userId: string;
  customerInfo: {
    fullName: string;
    email: string;
    phone: string;
  };
  items: Array<{
    id: number;
    title: string;
    platform: string;
    quantity: number;
    price: number;
  }>;
  total: number;
  transactionId: string;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  createdAt: string;
  estimatedDelivery?: string;
}

// Mock order service for demo purposes
// In production, this would interact with your backend API
export const orderService = {
  async createOrder(orderData: Omit<OrderData, 'orderId' | 'createdAt' | 'status'>): Promise<OrderData> {
    // Generate order ID
    const orderId = `KZB-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    
    const newOrder: OrderData = {
      ...orderData,
      orderId,
      status: 'pending',
      createdAt: new Date().toISOString(),
      estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days from now
    };

    // Store in localStorage (in production, this would be a real API call)
    const existingOrders = this.getUserOrders(orderData.userId);
    const updatedOrders = [newOrder, ...existingOrders];
    localStorage.setItem(`orders_${orderData.userId}`, JSON.stringify(updatedOrders));

    // Simulate processing delay
    setTimeout(() => {
      this.updateOrderStatus(orderId, orderData.userId, 'processing');
    }, 2000);

    return newOrder;
  },

  async getOrder(orderId: string, userId: string): Promise<OrderData | null> {
    const orders = this.getUserOrders(userId);
    return orders.find(order => order.orderId === orderId) || null;
  },

  getUserOrders(userId: string): OrderData[] {
    const orders = localStorage.getItem(`orders_${userId}`);
    return orders ? JSON.parse(orders) : [];
  },

  updateOrderStatus(orderId: string, userId: string, status: OrderData['status']): void {
    const orders = this.getUserOrders(userId);
    const updatedOrders = orders.map(order => 
      order.orderId === orderId ? { ...order, status } : order
    );
    localStorage.setItem(`orders_${userId}`, JSON.stringify(updatedOrders));
  },

  async verifyTransaction(transactionId: string): Promise<{ success: boolean; orderId?: string; error?: string }> {
    // Mock transaction verification
    // In production, this would verify with your payment provider
    
    if (!transactionId || transactionId.length < 10) {
      return { success: false, error: 'Invalid transaction ID format' };
    }

    // Simulate verification delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Mock success/failure (90% success rate)
    const isValid = Math.random() > 0.1;
    
    if (isValid) {
      // In production, you would look up the order by transaction ID
      const mockOrderId = `KZB-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
      return { success: true, orderId: mockOrderId };
    } else {
      return { success: false, error: 'Transaction not found or already verified' };
    }
  }
};