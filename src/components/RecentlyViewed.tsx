import { ArrowRight, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useRecentlyViewed } from "@/hooks/useRecentlyViewed";
import { useCurrency } from "@/context/CurrencyContext";
import { Badge } from "./ui/badge";

const RecentlyViewed = () => {
  const { recentlyViewed } = useRecentlyViewed();
  const { getSymbol, convert } = useCurrency();
  const navigate = useNavigate();

  if (recentlyViewed.length === 0) return null;

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Clock className="w-6 h-6 text-accent-peach" />
            <h2 className="font-clash text-2xl md:text-3xl font-bold text-primary">
              Recently Viewed
            </h2>
          </div>
          <button 
            onClick={() => navigate('/services')}
            className="text-accent-peach hover:text-accent-peach/80 transition-colors font-medium"
          >
            View All Services
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-4">
          {recentlyViewed.slice(0, 6).map((service) => (
            <div
              key={service.id}
              onClick={() => navigate(`/service/${service.id}`)}
              className="glass-subtle rounded-xl p-4 cursor-pointer hover:scale-105 transition-all duration-300 group"
            >
              <Badge className="mb-3 bg-accent-peach/20 text-accent-peach border-accent-peach/30">
                {service.badge}
              </Badge>
              
              <div className="mb-3 text-center">
                {service.icon}
              </div>
              
              <h3 className="font-medium text-primary text-sm mb-2 line-clamp-2">
                {service.title}
              </h3>
              
              {service.tiers?.length > 0 && (
                <div className="text-xs text-muted-foreground">
                  From {getSymbol()}{convert(service.tiers[0].price)}
                </div>
              )}
              
              <ArrowRight className="w-4 h-4 text-accent-peach mt-2 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RecentlyViewed;