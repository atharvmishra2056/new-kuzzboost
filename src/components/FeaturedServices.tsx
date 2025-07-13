import { useState, useEffect, ReactElement } from "react";
import { Star, ArrowRight } from "lucide-react";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { SiInstagram, SiYoutube, SiDiscord, SiTwitch, SiSpotify, SiWhatsapp, SiSnapchat, SiX } from 'react-icons/si';
import { useCurrency } from "@/context/CurrencyContext";
import { Service } from "@/pages/Services"; // Import the Service interface

const iconMap: { [key: string]: ReactElement } = {
  SiInstagram: <SiInstagram className="text-5xl relative z-10 group-hover:scale-110 transition-transform duration-300" />,
  SiYoutube: <SiYoutube className="text-5xl relative z-10 group-hover:scale-110 transition-transform duration-300" />,
  SiX: <SiX className="text-5xl relative z-10 group-hover:scale-110 transition-transform duration-300" />,
  SiDiscord: <SiDiscord className="text-5xl relative z-10 group-hover:scale-110 transition-transform duration-300" />,
};

const FeaturedServices = ({ onCustomizeClick }: { onCustomizeClick: (service: Service) => void }) => {
  const [services, setServices] = useState<Service[]>([]);
  const { getSymbol, convert } = useCurrency();

  useEffect(() => {
    const fetchFeaturedServices = async () => {
      const servicesCollection = collection(db, "services");
      const q = query(servicesCollection, orderBy("reviews", "desc"), limit(4));
      const querySnapshot = await getDocs(q);
      const servicesData = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          ...data,
          icon: iconMap[data.iconName],
        } as Service;
      });
      setServices(servicesData);
    };
    fetchFeaturedServices();
  }, []);

  if (services.length === 0) return null;

  return (
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-hero">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-accent-lavender/20 rounded-full px-4 py-2 mb-6"><Star className="w-4 h-4 text-accent-peach" /><span className="text-sm font-medium text-primary">Featured Services</span></div>
            <h2 className="font-clash text-4xl md:text-6xl font-bold text-primary mb-6">Our Top Performers</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">Hand-picked services that deliver exceptional results. These are our most popular and effective growth solutions.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
            {services.map((service, index) => (
                <div key={service.id} className="stagger-item service-card relative h-full flex flex-col" style={{ animationDelay: `${index * 0.15}s` }}>
                  <div className="absolute top-0 right-0 p-4"><div className="glass rounded-full px-3 py-1 text-xs font-bold text-primary border">{service.badge}</div></div>
                  <div className="relative mb-4 text-center pt-4">{service.icon}</div>
                  <div className="flex-grow p-4">
                    <h3 className="font-clash text-xl font-semibold text-primary mb-2">{service.title}</h3>
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-3">{service.description}</p>
                  </div>
                  <div className="mt-auto p-4">
                    {service.tiers?.length > 0 ? (
                        <div className="flex items-baseline gap-2 mb-4"><span className="text-2xl font-bold text-primary font-clash">{getSymbol()}{convert(service.tiers[0].price)}</span><span className="text-sm text-muted-foreground">/ {service.tiers[0].quantity.toLocaleString()}</span></div>
                    ) : <div className="h-[36px] flex items-center text-muted-foreground">Not Available</div>}
                    <button onClick={() => onCustomizeClick(service)} disabled={!service.tiers || service.tiers.length === 0} className="w-full glass-button text-center group/btn relative overflow-hidden">
                      <span className="relative z-10 flex items-center justify-center gap-2">Get Started<ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-300" /></span>
                    </button>
                  </div>
                </div>
            ))}
          </div>
        </div>
      </section>
  );
};

export default FeaturedServices;