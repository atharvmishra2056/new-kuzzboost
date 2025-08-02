import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Service } from '@/types/service';
import { SiInstagram, SiYoutube, SiDiscord, SiTwitch, SiSpotify, SiWhatsapp, SiSnapchat, SiX } from 'react-icons/si';
import { ReactElement } from 'react';

const iconMap: { [key: string]: ReactElement } = {
  SiInstagram: <SiInstagram className="w-8 h-8 text-[#E4405F]" />,
  SiYoutube: <SiYoutube className="w-8 h-8 text-[#FF0000]" />,
  SiX: <SiX className="w-8 h-8 text-[#000000]" />,
  SiDiscord: <SiDiscord className="w-8 h-8 text-[#7289DA]" />,
  SiTwitch: <SiTwitch className="w-8 h-8 text-[#9146FF]" />,
  SiSpotify: <SiSpotify className="w-8 h-8 text-[#1DB954]" />,
  SiWhatsapp: <SiWhatsapp className="w-8 h-8 text-[#25D366]" />,
  SiSnapchat: <SiSnapchat className="w-8 h-8 text-[#FFFC00]" />,
};

export const useServices = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('services')
        .select(`
          *,
          service_tiers (
            quantity,
            price
          )
        `)
        .eq('is_active', true)
        .order('id');

      if (error) throw error;

      const formattedServices: Service[] = data?.map(service => ({
        id: service.id,
        title: service.title,
        platform: service.platform,
        iconName: service.icon_name,
        icon: iconMap[service.icon_name] || iconMap.SiInstagram,
        description: service.description,
        rating: Number(service.rating) || 0,
        reviews: service.reviews || 0,
        badge: service.badge || '',
        features: service.features || [],
        tiers: service.service_tiers?.map((tier: any) => ({
          quantity: tier.quantity,
          price: Number(tier.price)
        })) || [],
        isActive: service.is_active
      })) || [];

      setServices(formattedServices);
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

    useEffect(() => {
    fetchServices();

    const channel = supabase.channel('services-realtime-channel')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'services' }, async (payload) => {
        await fetchServices(); // Refetch all services if a service is added/deleted/updated
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'service_tiers' }, async (payload) => {
        await fetchServices(); // Refetch all services if a tier is added/deleted/updated
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { services, loading, refetch: fetchServices };
};