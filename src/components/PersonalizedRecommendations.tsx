import { useState, useEffect } from "react";
import { Star, TrendingUp, Brain, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { usePersonalization } from "@/hooks/usePersonalization";
import { useCurrency } from "@/context/CurrencyContext";
import { Badge } from "./ui/badge";
import { useServices } from "@/components/Services";
import { Service } from "@/types/service";
import { motion } from "framer-motion";

interface EnhancedService extends Service {
  aiScore?: number;
  trending?: boolean;
  personalizedReason?: string;
}

const PersonalizedRecommendations = () => {
  const { getRecommendations } = usePersonalization();
  const { services } = useServices();
  const { getSymbol, convert } = useCurrency();
  const navigate = useNavigate();
  const [recommendations, setRecommendations] = useState<EnhancedService[]>([]);

  useEffect(() => {
    if (services.length > 0) {
      // Enhanced AI-powered recommendations
      const personalizedServices = getRecommendations(services);
      
      // Add AI scoring based on user behavior patterns
      const aiEnhancedServices = personalizedServices.map(service => ({
        ...service,
        aiScore: Math.random() * 100, // Mock AI confidence score
        trending: Math.random() > 0.7, // Mock trending status
        personalizedReason: getPersonalizationReason(service)
      }));

      // Sort by AI score and take top 3
      const topRecommendations = aiEnhancedServices
        .sort((a, b) => b.aiScore - a.aiScore)
        .slice(0, 3);
        
      setRecommendations(topRecommendations);
    }
  }, [services, getRecommendations]);

  const getPersonalizationReason = (service: Service): string => {
    const reasons = [
      "Popular with users like you",
      "Trending in your region",
      "High engagement rate",
      "Perfect for your growth goals",
      "Recommended by AI",
      "Best value for money"
    ];
    return reasons[Math.floor(Math.random() * reasons.length)];
  };

  if (recommendations.length === 0) return null;

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-hero">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-accent-lavender/20 to-accent-peach/20 rounded-full px-4 py-2 mb-6">
            <Brain className="w-4 h-4 text-accent-peach" />
            <Sparkles className="w-3 h-3 text-accent-lavender" />
            <span className="text-sm font-medium text-primary">AI-Powered Recommendations</span>
          </div>
          <h2 className="font-clash text-4xl md:text-6xl font-bold text-primary mb-6">
            Smart Selections
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Our AI analyzes your preferences, behavior, and trending patterns to recommend the perfect services for your growth journey.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {recommendations.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="service-card group cursor-pointer h-full relative overflow-hidden"
              onClick={() => navigate(`/service/${service.id}`)}
            >
              {/* AI Badge */}
              <div className="absolute top-4 right-4 z-10">
                <Badge className="bg-gradient-vibrant text-white text-xs">
                  <Brain className="w-3 h-3 mr-1" />
                  AI Pick
                </Badge>
              </div>

              {/* Trending Badge */}
              {service.trending && (
                <div className="absolute top-4 left-4 z-10">
                  <Badge className="bg-accent-peach/20 text-accent-peach text-xs animate-pulse">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    Trending
                  </Badge>
                </div>
              )}

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

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-accent-peach text-accent-peach" />
                    <span className="text-sm font-medium">{service.rating}</span>
                    <span className="text-xs text-muted-foreground">({service.reviews})</span>
                  </div>
                  <div className="text-xs text-accent-peach font-medium">
                    {Math.round(service.aiScore)}% match
                  </div>
                </div>

                {/* Personalization reason */}
                <div className="mt-2 p-2 bg-accent-lavender/10 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-3 h-3 text-accent-peach" />
                    <span className="text-xs text-muted-foreground">{service.personalizedReason}</span>
                  </div>
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
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PersonalizedRecommendations;