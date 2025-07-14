import { useState, useEffect } from "react";
import { Star, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { usePersonalization } from "@/hooks/usePersonalization";
import { useCurrency } from "@/context/CurrencyContext";
import { Badge } from "./ui/badge";
import { useServices } from "@/components/Services";
import { Service } from "@/types/service";

const PersonalizedRecommendations = () => {
  const { getRecommendations } = usePersonalization();
  const { services } = useServices();
  const { getSymbol, convert } = useCurrency();
  const navigate = useNavigate();
  const [recommendations, setRecommendations] = useState<Service[]>([]);

  useEffect(() => {
    if (services.length > 0) {
      const personalizedServices = getRecommendations(services);
      setRecommendations(personalizedServices.slice(0, 3));
    }
  }, [services, getRecommendations]);

  if (recommendations.length === 0) return null;

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-hero">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-accent-lavender/20 rounded-full px-4 py-2 mb-6">
            <TrendingUp className="w-4 h-4 text-accent-peach" />
            <span className="text-sm font-medium text-primary">Recommended for You</span>
          </div>
          <h2 className="font-clash text-4xl md:text-6xl font-bold text-primary mb-6">
            Tailored Selections
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Based on your activity and preferences, here are services we think you'll love.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {recommendations.map((service, index) => (
            <div
              key={service.id}
              className="service-card group cursor-pointer h-full"
              onClick={() => navigate(`/service/${service.id}`)}
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="relative mb-6">
                <div className="text-5xl mb-2 group-hover:scale-110 transition-transform duration-300 flex justify-center">
                  {service.icon}
                </div>
                <div className="text-center">
                  <Badge className="bg-accent-peach/20 text-primary">{service.badge}</Badge>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="font-clash text-xl font-semibold text-primary mb-2 line-clamp-2">
                    {service.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {service.description}
                  </p>
                </div>

                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-accent-peach text-accent-peach" />
                  <span className="text-sm font-medium">{service.rating}</span>
                  <span className="text-xs text-muted-foreground">({service.reviews})</span>
                </div>

                {service.tiers && service.tiers.length > 0 && (
                  <div className="pt-4 border-t border-border/20">
                    <div className="flex items-baseline gap-2">
                      <span className="text-lg font-bold text-primary font-clash">
                        {getSymbol()}{convert(service.tiers[0].price)}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        / {service.tiers[0].quantity.toLocaleString()}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PersonalizedRecommendations;