import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, RefreshCw, Check, X, Clock, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

type RefillRequest = {
  id: string;
  order_id: string;
  service_id: number;
  current_count: number;
  screenshot_url: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  requested_at: string;
  processed_at: string | null;
  processed_by: string | null;
  admin_notes: string | null;
  user_id: string;
  service: {
    title: string;
    platform: string;
  };
  created_at: string;
  updated_at: string;
};

const RefillRequestsPage = () => {
  const { currentUser } = useAuth();
  const [refillRequests, setRefillRequests] = useState<RefillRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  const fetchRefillRequests = async () => {
    if (!currentUser) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('refill_requests')
        .select(`
          *,
          service:services (
            title,
            platform
          )
        `)
        .eq('user_id', currentUser.id)
        .order('requested_at', { ascending: false });

      if (error) throw error;
      
      // Map the data to match our RefillRequest type
      const mappedData = (data || []).map(item => ({
        ...item,
        status: item.status as 'pending' | 'approved' | 'rejected' | 'completed',
        created_at: item.requested_at, // Map requested_at to created_at for consistency
        updated_at: item.processed_at || item.requested_at, // Use processed_at if available, otherwise use requested_at
        admin_notes: item.admin_notes || null,
        current_count: item.current_count || 0,
        processed_at: item.processed_at || null,
        processed_by: item.processed_by || null,
        service: item.service || { title: 'Unknown Service', platform: 'N/A' }
      }));
      
      setRefillRequests(mappedData);
    } catch (error) {
      console.error('Error fetching refill requests:', error);
      toast({
        title: 'Error',
        description: 'Failed to load refill requests. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRefillRequests();
  }, [currentUser]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            <Check className="h-3 w-3 mr-1" /> Approved
          </Badge>
        );
      case 'rejected':
        return (
          <Badge variant="destructive" className="bg-red-100 text-red-800 hover:bg-red-100">
            <X className="h-3 w-3 mr-1" /> Rejected
          </Badge>
        );
      case 'completed':
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
            <Check className="h-3 w-3 mr-1" /> Completed
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="text-amber-600 border-amber-300 bg-amber-50">
            <Clock className="h-3 w-3 mr-1" /> Pending
          </Badge>
        );
    }
  };

  const handleRequestRefill = () => {
    navigate('/dashboard/request-refill');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Refill Requests</h1>
          <p className="text-muted-foreground">
            Track the status of your refill requests
          </p>
        </div>
        <Button onClick={handleRequestRefill}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Request New Refill
        </Button>
      </div>

      {refillRequests.length === 0 ? (
        <Card className="text-center p-8">
          <RefreshCw className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-1">No refill requests yet</h3>
          <p className="text-muted-foreground mb-4">
            You haven't submitted any refill requests yet.
          </p>
          <Button onClick={handleRequestRefill}>Request a Refill</Button>
        </Card>
      ) : (
        <div className="space-y-4">
          {refillRequests.map((request) => (
            <Card key={request.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div>
                    <CardTitle className="text-lg">
                      {request.service?.title || 'Unknown Service'}
                    </CardTitle>
                    <CardDescription className="mt-1">
                      Order #{request.order_id} • {format(new Date(request.requested_at), 'MMM d, yyyy h:mm a')}
                    </CardDescription>
                  </div>
                  <div className="flex-shrink-0">
                    {getStatusBadge(request.status)}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Current Count</p>
                    <p className="font-medium">{request.current_count.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Platform</p>
                    <p className="font-medium">{request.service?.platform || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Submitted On</p>
                    <p className="font-medium">{format(new Date(request.requested_at), 'MMM d, yyyy')}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Last Updated</p>
                    <p className="font-medium">
                      {request.processed_at ? format(new Date(request.processed_at), 'MMM d, yyyy') : 'Pending'}
                    </p>
                  </div>
                </div>

                {request.admin_notes && (
                  <div className="mt-4 p-3 bg-amber-50 rounded-md border border-amber-100">
                    <div className="flex items-start">
                      <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5 mr-2 flex-shrink-0" />
                      <p className="text-sm text-amber-800">
                        <span className="font-medium">Admin Note:</span> {request.admin_notes}
                      </p>
                    </div>
                  </div>
                )}

                {request.screenshot_url && (
                  <div className="mt-4">
                    <p className="text-sm text-muted-foreground mb-2">Screenshot</p>
                    <a 
                      href={request.screenshot_url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="inline-block"
                    >
                      <img 
                        src={request.screenshot_url} 
                        alt="Refill proof" 
                        className="h-32 w-auto rounded-md border border-border"
                      />
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default RefillRequestsPage;
