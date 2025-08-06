import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Toaster, toast } from 'sonner';
import { Loader2, Upload, X } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { Database } from '@/types/supabase';

type OrderItem = Database['public']['Tables']['order_items']['Row'] & {
  title: string;
  platform: string;
  refill_eligible?: boolean;
};

type Order = Database['public']['Tables']['orders']['Row'] & {
  items: OrderItem[];
};

interface EligibleOrder {
  orderId: string;
  orderNumber: string;
  created_at: string;
  items: OrderItem[];
  status: string;
}

const RequestRefillPage = () => {
  const { orderId: urlOrderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const [eligibleOrders, setEligibleOrders] = useState<EligibleOrder[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<EligibleOrder | null>(null);
  const [currentCount, setCurrentCount] = useState('');
  const [screenshotFile, setScreenshotFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedService, setSelectedService] = useState<OrderItem | null>(null);

  useEffect(() => {
    const fetchEligibleOrders = async () => {
      if (!currentUser) return;
      setIsLoading(true);
      
      try {
        // 1. Fetch all services that are refill eligible
        const { data: refillableServicesData, error: servicesError } = await supabase
          .from('services')
          .select('id, title, platform, refill_eligible')
          .eq('refill_eligible', true);

        if (servicesError) throw servicesError;
        const refillableServiceMap = new Map(refillableServicesData.map(s => [s.id, s]));

        // 2. Fetch user's orders
        const { data: ordersData, error: ordersError } = await supabase
          .from('orders')
          .select('id, order_id, status, created_at, items')
          .eq('user_id', currentUser.id)
          .in('status', ['completed', 'processing'])
          .order('created_at', { ascending: false });

        if (ordersError) throw ordersError;
        if (!ordersData || ordersData.length === 0) return;

        // 3. Combine data on the client-side
        const formattedOrders = [];
        for (const order of ordersData) {
          const items = order.items as any[]; // The 'items' column is JSON
          if (!Array.isArray(items) || items.length === 0) continue;

          const refillableItems = [];
          for (const item of items) {
            const service = refillableServiceMap.get(item.service_id);
            if (service) {
              refillableItems.push({
                id: service.id,
                title: service.title || 'Unknown Service',
                platform: service.platform || 'Unknown',
                quantity: item.quantity,
                service_quantity: item.service_quantity,
                price: 0, // Not needed for this view
                userInput: '', // Not needed for this view
                refill_eligible: true
              });
            }
          }

          if (refillableItems.length > 0) {
            formattedOrders.push({
              orderId: order.id,
              orderNumber: order.order_id,
              created_at: order.created_at,
              items: refillableItems,
              status: order.status || 'unknown'
            });
          }
        }

        setEligibleOrders(formattedOrders);
        if (urlOrderId) {
          const order = formattedOrders.find(o => o.orderId === urlOrderId);
          if (order) setSelectedOrder(order);
        }
      } catch (error) {
        console.error('Error fetching eligible orders:', error);
        toast.error('Failed to load your eligible orders. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchEligibleOrders();
  }, [currentUser, urlOrderId]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      // Check file type (allow images and PDFs)
      if (!file.type.match('image.*') && !file.type.includes('pdf')) {
        toast.error('Please upload an image or PDF file');
        return;
      }
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size should be less than 5MB');
        return;
      }
      setScreenshotFile(file);
    }
  };

  const removeFile = () => {
    setScreenshotFile(null);
    // Reset file input
    const fileInput = document.getElementById('screenshot') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!currentUser || !selectedOrder || !selectedService || !currentCount || !screenshotFile) {
      toast.error('Please fill out all required fields.');
      return;
    }

    setIsSubmitting(true);
    setUploadProgress(0);
    const toastId = toast.loading('Submitting your refill request...');

    try {
      // 1. Upload screenshot
      const fileExt = screenshotFile.name.split('.').pop();
      const fileName = `refill-${Date.now()}.${fileExt}`;
      const filePath = `${currentUser.id}/${fileName}`;
      
      const { error: uploadError } = await supabase.storage
        .from('refill-proofs')
        .upload(filePath, screenshotFile, {
          cacheControl: '3600',
          upsert: false,
          contentType: screenshotFile.type,
        });

      if (uploadError) throw uploadError;
      setUploadProgress(50);

      // 2. Get public URL for the uploaded file
      const { data: { publicUrl } } = await supabase.storage
        .from('refill-proofs')
        .getPublicUrl(filePath);

      // 3. Create refill request
      const { error: requestError } = await supabase
        .from('refill_requests')
        .insert([{
          user_id: currentUser.id,
          order_id: selectedOrder.orderId,
          service_id: selectedService.id,
          current_count: parseInt(currentCount, 10),
          screenshot_url: publicUrl,
          status: 'pending'
        }])
        .select();

      if (requestError) throw requestError;
      setUploadProgress(100);

      // 4. Show success message and reset form
      toast.success('Refill request submitted successfully!', { id: toastId });
      
      // Reset form
      setSelectedOrder(null);
      setSelectedService(null);
      setCurrentCount('');
      setScreenshotFile(null);
      setUploadProgress(0);
      
      // Navigate to orders or show success page
      setTimeout(() => {
        navigate('/dashboard/orders');
      }, 1500);
      
    } catch (error) {
      console.error('Error submitting refill request:', error);
      toast.error('Failed to submit refill request. Please try again.', { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin" />
          <p>Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Request a Refill</h1>
        <p className="text-muted-foreground">
          Submit a refill request for your order if you haven't received the full quantity
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column - Order selection */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Your Orders</CardTitle>
              <CardDescription>
                {eligibleOrders.length === 0 
                  ? "No refillable orders found."
                  : "Select an order to request a refill"
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-3">
                  {eligibleOrders.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>No orders eligible for refill found.</p>
                      <Button variant="link" className="mt-2" onClick={() => navigate('/dashboard/account/orders')}>
                        View All Orders
                      </Button>
                    </div>
                  ) : (
                    eligibleOrders.map((order) => (
                      <div 
                        key={order.orderId}
                        className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                          selectedOrder?.orderId === order.orderId 
                            ? 'border-primary bg-primary/5' 
                            : 'hover:bg-accent/50'
                        }`}
                        onClick={() => {
                          setSelectedOrder(order);
                          setSelectedService(null);
                        }}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">Order #{order.orderNumber}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(order.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          <Badge variant="outline">
                            {order.status}
                          </Badge>
                        </div>
                        <div className="mt-2 text-sm">
                          {order.items.length} refillable item{order.items.length > 1 ? 's' : ''}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Right column - Refill form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Refill Request</CardTitle>
              <CardDescription>
                {selectedOrder 
                  ? `Request a refill for Order #${selectedOrder.orderNumber}`
                  : 'Select an order to begin'
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!selectedOrder ? (
                <div className="text-center py-12 text-muted-foreground">
                  <p>Please select an order to request a refill</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Service Selection */}
                  <div className="space-y-3">
                    <Label>Select Service</Label>
                    <div className="grid gap-3">
                      {selectedOrder.items.map((item) => (
                        <div 
                          key={item.id}
                          className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                            selectedService?.id === item.id 
                              ? 'border-primary bg-primary/5' 
                              : 'hover:bg-accent/50'
                          }`}
                          onClick={() => setSelectedService(item)}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium">{item.title}</p>
                              <p className="text-sm text-muted-foreground">
                                {item.platform} • {item.quantity} {item.quantity > 1 ? 'items' : 'item'}
                              </p>
                            </div>
                            <Badge variant="outline">
                              {item.refill_eligible ? 'Refillable' : 'Not Eligible'}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Current Count */}
                  {selectedService && (
                    <div className="space-y-3">
                      <Label htmlFor="currentCount">
                        Current {selectedService.title.split(' ')[0]} Count
                      </Label>
                      <Input
                        id="currentCount"
                        type="number"
                        placeholder={`Enter current ${selectedService.title.split(' ')[0]} count`}
                        value={currentCount}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value === '' || /^\d+$/.test(value)) {
                            setCurrentCount(value);
                          }
                        }}
                        min="0"
                        required
                      />
                      <p className="text-sm text-muted-foreground">
                        Please enter the current count shown on your account.
                      </p>
                    </div>
                  )}

                  {/* Screenshot Upload */}
                  {selectedService && (
                    <div className="space-y-3">
                      <Label htmlFor="screenshot">Proof of Current Count</Label>
                      <div className="flex items-center justify-center w-full">
                        <label
                          htmlFor="screenshot"
                          className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer ${
                            screenshotFile ? 'border-primary' : 'border-muted-foreground/25 hover:border-muted-foreground/50'
                          }`}
                        >
                          <div className="flex flex-col items-center justify-center pt-5 pb-6 px-4 text-center">
                            <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                            <p className="mb-1 text-sm text-muted-foreground">
                              <span className="font-semibold">Click to upload</span> or drag and drop
                            </p>
                            <p className="text-xs text-muted-foreground">
                              PNG, JPG, or PDF (MAX. 5MB)
                            </p>
                          </div>
                          <input
                            id="screenshot"
                            name="screenshot"
                            type="file"
                            className="hidden"
                            accept="image/png, image/jpeg, image/jpg, application/pdf"
                            onChange={handleFileChange}
                            disabled={isSubmitting}
                          />
                        </label>
                      </div>
                      
                      {screenshotFile && (
                        <div className="mt-2 p-3 border rounded-md bg-muted/50 flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <FileIcon type={screenshotFile.type} />
                            <div className="text-sm">
                              <p className="font-medium">{screenshotFile.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {(screenshotFile.size / 1024).toFixed(1)} KB • {screenshotFile.type}
                              </p>
                            </div>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={removeFile}
                            disabled={isSubmitting}
                          >
                            <X className="h-4 w-4" />
                            <span className="sr-only">Remove file</span>
                          </Button>
                        </div>
                      )}
                      
                      {uploadProgress > 0 && uploadProgress < 100 && (
                        <div className="mt-2 space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Uploading...</span>
                            <span>{uploadProgress}%</span>
                          </div>
                          <Progress value={uploadProgress} className="h-2" />
                        </div>
                      )}
                    </div>
                  )}

                  {/* Submit Button */}
                  <div className="pt-2">
                    <Button 
                      type="submit" 
                      className="w-full"
                      size="lg"
                      disabled={!selectedService || !currentCount || !screenshotFile || isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        'Submit Refill Request'
                      )}
                    </Button>
                    
                    <p className="mt-3 text-sm text-muted-foreground text-center">
                      Our team will review your request and get back to you within 24-48 hours.
                    </p>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Toaster position="top-center" />
    </div>
  );
};

// Helper component for file icons
const FileIcon = ({ type }: { type: string }) => {
  if (type.includes('image/')) {
    return <img src="/file-image.svg" alt="" className="h-8 w-8" />;
  }
  if (type === 'application/pdf') {
    return <img src="/file-pdf.svg" alt="" className="h-8 w-8" />;
  }
  return <img src="/file.svg" alt="" className="h-8 w-8" />;
};

export default RequestRefillPage;
