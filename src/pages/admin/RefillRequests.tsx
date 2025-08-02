import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { format } from 'date-fns';

type RefillStatus = 'pending' | 'approved' | 'rejected';

interface RefillRequest {
  id: string;
  order_id: string;
  user_id: string;
  current_count: number;
  status: RefillStatus;
  screenshot_url: string;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
  user_email?: string;
  order_items?: any[];
}

export default function RefillRequests() {
  const { currentUser } = useAuth();
  const [requests, setRequests] = useState<RefillRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<Record<string, boolean>>({});
  const [statuses, setStatuses] = useState<Record<string, RefillStatus>>({});
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [filter, setFilter] = useState<RefillStatus | 'all'>('all');

  useEffect(() => {
    fetchRefillRequests();
    setupRealtimeUpdates();
  }, [filter]);

  const fetchRefillRequests = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('refill_requests')
        .select(`
          *,
          user:profiles(email),
          order:orders(items)
        `)
        .order('created_at', { ascending: false });

      if (filter !== 'all') {
        query = query.eq('status', filter);
      }

      const { data, error } = await query;

      if (error) throw error;

      const formattedData = data.map((req: any) => ({
        ...req,
        user_email: req.user?.email,
        order_items: req.order?.items || []
      }));

      setRequests(formattedData);
      
      // Initialize statuses and notes
      const initialStatuses: Record<string, RefillStatus> = {};
      const initialNotes: Record<string, string> = {};
      
      formattedData.forEach((req: RefillRequest) => {
        initialStatuses[req.id] = req.status;
        initialNotes[req.id] = req.admin_notes || '';
      });
      
      setStatuses(initialStatuses);
      setNotes(initialNotes);
    } catch (error) {
      console.error('Error fetching refill requests:', error);
      toast.error('Failed to load refill requests');
    } finally {
      setLoading(false);
    }
  };

  const setupRealtimeUpdates = () => {
    const subscription = supabase
      .channel('refill_requests_changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'refill_requests'
      }, () => {
        fetchRefillRequests();
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  };

  const handleStatusChange = async (requestId: string, newStatus: RefillStatus) => {
    if (!currentUser) {
      toast.error('You must be logged in to update requests');
      return;
    }
    try {
      setUpdating(prev => ({ ...prev, [requestId]: true }));
      
      const { error } = await supabase
        .from('refill_requests')
        .update({ 
          status: newStatus,
          admin_notes: notes[requestId],
          updated_at: new Date().toISOString()
        })
        .eq('id', requestId);

      if (error) throw error;

      toast.success('Request updated successfully');
      setStatuses(prev => ({ ...prev, [requestId]: newStatus }));
    } catch (error) {
      console.error('Error updating request:', error);
      toast.error('Failed to update request');
    } finally {
      setUpdating(prev => ({ ...prev, [requestId]: false }));
    }
  };

  const handleNotesChange = (requestId: string, value: string) => {
    if (!value) return;
    setNotes(prev => ({
      ...prev,
      [requestId]: value
    }));
  };

  const getStatusBadgeVariant = (status: RefillStatus) => {
    switch (status) {
      case 'approved':
        return 'default' as const;
      case 'rejected':
        return 'destructive' as const;
      default:
        return 'secondary' as const;
    }
  };

  const getOrderTitle = (items?: Array<{title?: string}>) => {
    if (!items || !items.length) return 'Unknown Order';
    return items[0]?.title || 'Order';
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Refill Requests</h1>
        <div className="flex items-center space-x-4">
          <Select value={filter} onValueChange={(value) => setFilter(value as any)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Requests</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Request ID</TableHead>
              <TableHead>Order</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Current Count</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  Loading requests...
                </TableCell>
              </TableRow>
            ) : requests.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  No refill requests found
                </TableCell>
              </TableRow>
            ) : (
              requests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell className="font-medium">
                    <div className="text-sm text-muted-foreground">
                      {request.id.substring(0, 8)}...
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">
                      {getOrderTitle(request.order_items || [])}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Order #{request.order_id.substring(0, 8)}...
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {request.user_email || 'Unknown User'}
                    </div>
                  </TableCell>
                  <TableCell>{request.current_count.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(request.status)}>
                      {request.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {format(new Date(request.created_at), 'MMM d, yyyy')}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {format(new Date(request.created_at), 'h:mm a')}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Select
                        value={statuses[request.id]}
                        onValueChange={(value) => 
                          setStatuses(prev => ({
                            ...prev,
                            [request.id]: value as RefillStatus
                          }))
                        }
                      >
                        <SelectTrigger className="w-[120px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="approved">Approve</SelectItem>
                          <SelectItem value="rejected">Reject</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button
                        size="sm"
                        disabled={updating[request.id]}
                        onClick={() => handleStatusChange(request.id, statuses[request.id])}
                      >
                        {updating[request.id] ? 'Saving...' : 'Update'}
                      </Button>
                    </div>
                    <div className="mt-2">
                      <Textarea
                        placeholder="Add notes..."
                        value={notes[request.id] || ''}
                        onChange={(e) => handleNotesChange(request.id, e.target.value)}
                        className="min-h-[60px]"
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
