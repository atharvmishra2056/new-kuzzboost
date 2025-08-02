// src/hooks/useAnnouncements.ts

import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Announcement {
  id: string;
  title: string;
  description: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  button_text?: string;
  button_link?: string;
}

export const useAnnouncements = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAnnouncements = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('announcements')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAnnouncements(data || []);
    } catch (error) {
      console.error('Error fetching announcements:', error);
    } finally {
      setLoading(false);
    }
  };

  const createAnnouncement = async (announcement: Omit<Announcement, 'id' | 'created_at' | 'updated_at'>) => {
    const newAnnouncement = {
      ...announcement,
      updated_at: new Date().toISOString(),
    };
    try {
      const { data, error } = await supabase
        .from('announcements')
        .insert([newAnnouncement])
        .select();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  };

  const updateAnnouncement = async (id: string, updates: Partial<Announcement>) => {
    const updatesWithTimestamp = {
      ...updates,
      updated_at: new Date().toISOString(),
    };
    try {
      // First, update the record
      const { data, error: updateError } = await supabase
        .from('announcements')
        .update(updatesWithTimestamp)
        .eq('id', id)
        .select();

      if (updateError) throw updateError;

      return { data: data ? data[0] : null, error: null };
    } catch (error) {
      console.error('Error in updateAnnouncement:', error);
      return { data: null, error };
    }
  };

  const deleteAnnouncement = async (id: string) => {
    try {
      const { error } = await supabase
        .from('announcements')
        .delete()
        .eq('id', id)
        .select();

      if (error) throw error;
      return { data: null, error: null };
    } catch (error) {
      return { data: null, error };
    }
  };

  const toggleAnnouncementActive = async (id: string) => {
    const announcement = announcements.find(a => a.id === id);
    if (!announcement) return { data: null, error: new Error('Announcement not found') };
    const newActiveState = !announcement.is_active;
    // Optimistically update local state for instant UI feedback
    setAnnouncements(prev => prev.map(a => a.id === id ? { ...a, is_active: newActiveState } : a));
    try {
      const result = await updateAnnouncement(id, { is_active: newActiveState });
      if (result.error) {
        // Revert on error
        setAnnouncements(prev => prev.map(a => a.id === id ? { ...a, is_active: !newActiveState } : a));
      }
      return result;
    } catch (error) {
      setAnnouncements(prev => prev.map(a => a.id === id ? { ...a, is_active: !newActiveState } : a));
      return { data: null, error };
    }
  };

  useEffect(() => {
    fetchAnnouncements();

    const channel = supabase.channel('realtime-announcements')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'announcements' },
        (payload) => {
          fetchAnnouncements();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    announcements,
    loading,
    fetchAnnouncements,
    createAnnouncement,
    updateAnnouncement,
    deleteAnnouncement,
    toggleAnnouncementActive
  };
};