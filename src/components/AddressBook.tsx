// src/components/AddressBook.tsx

import { useState, useEffect } from 'react';
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Star, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from '@/hooks/use-toast';

interface Address {
  id: string;
  full_name: string;
  street: string;
  city: string;
  state: string;
  zip_code: string;
  country: string;
  phone: string;
  is_default: boolean;
  created_at: string;
}

const AddressBook = () => {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [formData, setFormData] = useState({
    street: '',
    city: '',
    state: '',
    zip_code: '',
    country: '',
    phone: ''
  });

  useEffect(() => {
    if (currentUser) {
      fetchAddresses();
    }
  }, [currentUser]);

  const fetchAddresses = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('addresses')
        .select('*')
        .eq('user_id', currentUser?.id)
        .order('is_default', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;
      const mapped = (data || []).map((row: any) => ({
        id: row.id,
        full_name: `${row.first_name ?? ''} ${row.last_name ?? ''}`.trim() || row.label || 'Name',
        street: row.address_line_1,
        city: row.city,
        state: row.state,
        zip_code: row.postal_code,
        country: row.country,
        phone: row.phone,
        is_default: row.is_default,
        created_at: row.created_at,
      }));
      setAddresses(mapped);
    } catch (error) {
      console.error('Error fetching addresses:', error);
      toast({
        title: "Error",
        description: "Failed to load addresses",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.street || !formData.city || !formData.zip_code || !formData.country) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      // Derive first/last name from account name (not editable in address modal)
      const accountName = (currentUser?.user_metadata as any)?.full_name as string | undefined;
      const nameParts = (accountName || '').trim().split(/\s+/);
      const firstName = nameParts.shift() || '';
      const lastName = nameParts.join(' ');

      if (editingAddress) {
        // Update existing address
        const payload = {
          first_name: firstName,
          last_name: lastName,
          address_line_1: formData.street,
          city: formData.city,
          state: formData.state,
          postal_code: formData.zip_code,
          country: formData.country,
          phone: formData.phone,
          label: 'Primary',
        };
        const { error } = await supabase
          .from('addresses')
          .update(payload)
          .eq('id', editingAddress.id);

        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Address updated successfully",
        });
      } else {
        // Create new address
        const payloadNew = {
          user_id: currentUser?.id,
          is_default: addresses.length === 0,
          first_name: firstName,
          last_name: lastName,
          address_line_1: formData.street,
          city: formData.city,
          state: formData.state,
          postal_code: formData.zip_code,
          country: formData.country,
          phone: formData.phone,
          label: 'Primary',
        };
        const { error } = await supabase
          .from('addresses')
          .insert(payloadNew);

        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Address added successfully",
        });
      }

      setIsModalOpen(false);
      setEditingAddress(null);
      setFormData({
        street: '',
        city: '',
        state: '',
        zip_code: '',
        country: '',
        phone: ''
      });
      fetchAddresses();
    } catch (error) {
      console.error('Error saving address:', error);
      toast({
        title: "Error",
        description: "Failed to save address",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (address: Address) => {
    setEditingAddress(address);
    setFormData({
      street: address.street,
      city: address.city,
      state: address.state,
      zip_code: address.zip_code,
      country: address.country,
      phone: address.phone
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (addressId: string) => {
    try {
      const { error } = await supabase
        .from('addresses')
        .delete()
        .eq('id', addressId);

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Address deleted successfully",
      });
      fetchAddresses();
    } catch (error) {
      console.error('Error deleting address:', error);
      toast({
        title: "Error",
        description: "Failed to delete address",
        variant: "destructive",
      });
    }
  };

  const handleSetDefault = async (addressId: string) => {
    try {
      // First, unset all default addresses
      await supabase
        .from('addresses')
        .update({ is_default: false })
        .eq('user_id', currentUser?.id);

      // Then set the selected address as default
      const { error } = await supabase
        .from('addresses')
        .update({ is_default: true })
        .eq('id', addressId);

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Default address updated",
      });
      fetchAddresses();
    } catch (error) {
      console.error('Error setting default address:', error);
      toast({
        title: "Error",
        description: "Failed to update default address",
        variant: "destructive",
      });
    }
  };

  const openAddModal = () => {
    setEditingAddress(null);
    setFormData({
      street: '',
      city: '',
      state: '',
      zip_code: '',
      country: '',
      phone: ''
    });
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-32 bg-glass rounded-xl animate-pulse"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-primary font-clash">Address Book</h2>
          <p className="text-muted-foreground">Manage your shipping addresses</p>
        </div>
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button onClick={openAddModal} className="glass-button w-full sm:w-auto">
              <Plus className="w-4 h-4 mr-2" />
              Add Address
            </Button>
          </DialogTrigger>
          <DialogContent className="glass max-w-md">
            <DialogHeader>
              <DialogTitle className="font-clash text-xl text-primary">
                {editingAddress ? 'Edit Address' : 'Add New Address'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Removed name inputs. Name is derived from your account in Account Settings. */}
              <div>
                <Label htmlFor="street">Street Address *</Label>
                <Input
                  id="street"
                  value={formData.street}
                  onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="state">State/Province</Label>
                  <Input
                    id="state"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="zip_code">ZIP Code *</Label>
                  <Input
                    id="zip_code"
                    value={formData.zip_code}
                    onChange={(e) => setFormData({ ...formData, zip_code: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="country">Country *</Label>
                  <Select value={formData.country} onValueChange={(value) => setFormData({ ...formData, country: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="US">United States</SelectItem>
                      <SelectItem value="CA">Canada</SelectItem>
                      <SelectItem value="UK">United Kingdom</SelectItem>
                      <SelectItem value="IN">India</SelectItem>
                      <SelectItem value="AU">Australia</SelectItem>
                      <SelectItem value="DE">Germany</SelectItem>
                      <SelectItem value="FR">France</SelectItem>
                      <SelectItem value="JP">Japan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
              <div className="flex gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} className="flex-1">
                  Cancel
                </Button>
                <Button type="submit" className="flex-1 glass-button">
                  {editingAddress ? 'Update' : 'Add'} Address
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {addresses.length === 0 ? (
        <Card className="glass">
          <CardContent className="p-12 text-center">
            <MapPin className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold text-primary mb-2">No addresses yet</h3>
            <p className="text-muted-foreground mb-6">Add your first shipping address to get started</p>
            <Button onClick={openAddModal} className="glass-button w-full sm:w-auto">
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Address
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {addresses.map((address, index) => (
            <motion.div
              key={address.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="glass h-full">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold text-primary">
                      {address.full_name}
                    </CardTitle>
                    {address.is_default && (
                      <Badge className="bg-accent-peach/20 text-accent-peach">
                        <Star className="w-3 h-3 mr-1 fill-current" />
                        Default
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>{address.street}</p>
                    <p>{address.city}, {address.state} {address.zip_code}</p>
                    <p>{address.country}</p>
                    {address.phone && <p>📞 {address.phone}</p>}
                  </div>
                  
                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(address)}
                      className="flex-1"
                    >
                      <Edit className="w-3 h-3 mr-1" />
                      Edit
                    </Button>
                    {!address.is_default && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSetDefault(address.id)}
                        className="flex-1"
                      >
                        <Star className="w-3 h-3 mr-1" />
                        Set Default
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(address.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AddressBook;