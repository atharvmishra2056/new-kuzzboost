// src/pages/admin/Announcements.tsx

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Megaphone } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from '@/hooks/use-toast';
import { useAnnouncements, Announcement } from '@/hooks/useAnnouncements';

const sitePages = [
  { label: 'Home', value: '/' },
  { label: 'Services', value: '/services' },
  { label: 'About Us', value: '/about' },
  { label: 'Contact Us', value: '/contact' },
  { label: 'Dashboard', value: '/dashboard' },
  { label: 'Dashboard - Services', value: '/dashboard/services' },
  { label: 'Dashboard - Orders', value: '/dashboard/orders' },
  { label: 'Dashboard - Wishlist', value: '/dashboard/wishlist' },
  { label: 'Dashboard - Cart', value: '/dashboard/cart' },
  { label: 'Dashboard - Account Settings', value: '/dashboard/account-settings' },
  { label: 'Terms of Service', value: '/terms' },
  { label: 'Privacy Policy', value: '/privacy' },
  { label: 'Refund Policy', value: '/refund-policy' },
];

const Announcements = () => {
  const { announcements, loading, createAnnouncement, updateAnnouncement, deleteAnnouncement, toggleAnnouncementActive } = useAnnouncements();
  const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    is_active: true,
    button_text: '',
    button_link: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      // Prepare the data to be saved
      const announcementData = {
        ...formData,
        // Ensure we're not sending empty strings for optional fields
        button_text: formData.button_text || null,
        button_link: formData.button_link || null
      };

      if (editingAnnouncement) {
        console.log('Updating announcement:', editingAnnouncement.id, announcementData);
        const { error } = await updateAnnouncement(editingAnnouncement.id, announcementData);
        if (error) {
          console.error('Update error details:', error);
          throw error;
        }
        
        toast({
          title: "Success",
          description: "Announcement updated successfully",
        });
      } else {
        console.log('Creating new announcement:', announcementData);
        const { error } = await createAnnouncement(announcementData);
        if (error) {
          console.error('Create error details:', error);
          throw error;
        }
        
        toast({
          title: "Success",
          description: "Announcement created successfully",
        });
      }

      setIsModalOpen(false);
      setEditingAnnouncement(null);
      setFormData({
        title: '',
        description: '',
        is_active: true,
        button_text: '',
        button_link: ''
      });
    } catch (error: any) {
      console.error('Error saving announcement:', error);
      
      // More detailed error message
      const errorMessage = error?.message || 'An unknown error occurred';
      
      toast({
        title: "Error",
        description: `Failed to save announcement: ${errorMessage}`,
        variant: "destructive",
      });
    }
  };

  const handleEdit = (announcement: Announcement) => {
    setEditingAnnouncement(announcement);
    setFormData({
      title: announcement.title,
      description: announcement.description,
      is_active: announcement.is_active,
      button_text: announcement.button_text || '',
      button_link: announcement.button_link || ''
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (announcementId: string) => {
    if (!confirm('Are you sure you want to delete this announcement?')) return;

    try {
      const { error } = await deleteAnnouncement(announcementId);
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Announcement deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting announcement:', error);
      toast({
        title: "Error",
        description: "Failed to delete announcement",
        variant: "destructive",
      });
    }
  };

  const handleToggleActive = async (announcement: Announcement) => {
    try {
      const { error } = await toggleAnnouncementActive(announcement.id);
      if (error) throw error;
      
      toast({
        title: "Success",
        description: `Announcement ${!announcement.is_active ? 'activated' : 'deactivated'}`,
      });
    } catch (error) {
      console.error('Error toggling announcement:', error);
      toast({
        title: "Error",
        description: "Failed to update announcement",
        variant: "destructive",
      });
    }
  };

  const openAddModal = () => {
    setEditingAnnouncement(null);
    setFormData({
      title: '',
      description: '',
      is_active: true,
      button_text: '',
      button_link: ''
    });
    setIsModalOpen(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
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
          <h1 className="text-3xl font-bold text-primary font-clash">Announcements</h1>
          <p className="text-muted-foreground">Manage dashboard announcements and promotions</p>
        </div>
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button onClick={openAddModal} className="glass-button">
              <Plus className="w-4 h-4 mr-2" />
              Add Announcement
            </Button>
          </DialogTrigger>
          <DialogContent className="glass max-w-md">
            <DialogHeader>
              <DialogTitle className="font-clash text-xl text-primary">
                {editingAnnouncement ? 'Edit Announcement' : 'Create New Announcement'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g., Summer Sale - Up to 50% Off!"
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe the announcement or promotion..."
                  rows={3}
                  required
                />
              </div>
              <div>
                <Label htmlFor="button_text">Button Text</Label>
                <Input
                  id="button_text"
                  name="button_text"
                  value={formData.button_text}
                  onChange={handleChange}
                  placeholder="e.g., Shop Now, Learn More"
                />
              </div>
              <div>
                <Label htmlFor="button_link">Button Link</Label>
                <Select
                  value={formData.button_link || ''}
                  onValueChange={(value) => handleSelectChange('button_link', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a page to link to" />
                  </SelectTrigger>
                  <SelectContent>
                    {sitePages.map((page) => (
                      <SelectItem key={page.value} value={page.value}>
                        {page.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                />
                <Label htmlFor="is_active">Active (visible to users)</Label>
              </div>
              <div className="flex gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} className="flex-1">
                  Cancel
                </Button>
                <Button type="submit" className="flex-1 glass-button">
                  {editingAnnouncement ? 'Update' : 'Create'} Announcement
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {announcements.length === 0 ? (
        <Card className="glass">
          <CardContent className="p-12 text-center">
            <Megaphone className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold text-primary mb-2">No announcements yet</h3>
            <p className="text-muted-foreground mb-6">Create your first announcement to engage users</p>
            <Button onClick={openAddModal} className="glass-button">
              <Plus className="w-4 h-4 mr-2" />
              Create First Announcement
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {announcements.map((announcement, index) => (
            <motion.div
              key={announcement.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="glass">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CardTitle className="text-lg font-semibold text-primary">
                        {announcement.title}
                      </CardTitle>
                      <Badge variant={announcement.is_active ? "default" : "secondary"}>
                        {announcement.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={announcement.is_active}
                        onCheckedChange={() => handleToggleActive(announcement)}
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">{announcement.description}</p>
                  
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Created: {new Date(announcement.created_at).toLocaleDateString()}</span>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(announcement)}
                      >
                        <Edit className="w-3 h-3 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(announcement.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-3 h-3 mr-1" />
                        Delete
                      </Button>
                    </div>
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

export default Announcements;