import { useState, useEffect } from "react";
import { ArrowRight, Sparkles, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { usePersonalization } from "@/hooks/usePersonalization";
import { useCurrency } from "@/context/CurrencyContext";
import { Badge } from "./ui/badge";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase";
import { Service } from "@/pages/Services";

const PersonalizedRecommendations = () => {
  const { getRecommendations } = usePersonalization();
  const { getSymbol, convert } = useCurrency();
  const navigate = useNavigate();
  const [recommendations, setRecommendations] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const servicesCollection = collection(db, "services");
        const querySnapshot = await getDocs(servicesCollection);
        const allServices = querySnapshot.docs.map(doc => ({
          ...doc.data(),
          id: doc.data().id
        })) as Service[];
        
        const recommended = getRecommendations(allServices);
        setRecommendations(recommended);
      } catch (error) {
        console.error('Error fetching recommendations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [getRecommendations]);

  if (loading) {
    return (
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <Sparkles className="w-6 h-6 text-accent-peach animate-pulse" />
            <h2 className="font-clash text-2xl md:text-3xl font-bold text-primary">
              Recommended for You
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="glass-subtle rounded-xl p-6 animate-pulse">
                <div className="h-4 bg-accent-peach/20 rounded mb-4"></div>
                <div className="h-8 bg-accent-peach/20 rounded mb-3"></div>
                <div className="h-16 bg-accent-peach/20 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (recommendations.length === 0) return null;

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Sparkles className="w-6 h-6 text-accent-peach" />
            <h2 className="font-clash text-2xl md:text-3xl font-bold text-primary">
              Recommended for You
            </h2>
          </div>
          <button 
            onClick={() => navigate('/services')}
            className="text-accent-peach hover:text-accent-peach/80 transition-colors font-medium"
          >
            View All Services
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recommendations.slice(0, 3).map((service) => (
            <div
              key={service.id}
              onClick={() => navigate(`/service/${service.id}`)}
              className="glass-subtle rounded-xl p-6 cursor-pointer hover:scale-105 transition-all duration-300 group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4">
                <Badge className="bg-accent-peach/90 text-white">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  {service.badge}
                </Badge>
              </div>
              
              <div className="mb-4 text-center pt-4">
                {service.icon}
              </div>
              
              <h3 className="font-clash text-lg font-semibold text-primary mb-2">
                {service.title}
              </h3>
              
              <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                {service.description}
              </p>
              
              {service.tiers?.length > 0 && (
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-xl font-bold text-primary font-clash">
                    {getSymbol()}{convert(service.tiers[0].price)}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    / {service.tiers[0].quantity.toLocaleString()}
                  </span>
                </div>
              )}
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <span className="text-sm font-medium text-accent-peach">
                    ⭐ {service.rating}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    ({service.reviews})
                  </span>
                </div>
                <ArrowRight className="w-4 h-4 text-accent-peach group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PersonalizedRecommendations;