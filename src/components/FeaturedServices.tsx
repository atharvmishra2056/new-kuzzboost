import { useState } from "react";
import { Star, Clock, Shield, Zap, ArrowRight } from "lucide-react";

const featuredServices = [
  {
    id: 1,
    title: "Instagram Followers Premium",
    description: "High-quality, active followers from real accounts. Gradual delivery for natural growth.",
    price: "$24.99",
    originalPrice: "$34.99",
    icon: "📷",
    features: ["Real Active Users", "Gradual Delivery", "30-Day Guarantee", "24/7 Support"],
    badge: "Most Popular",
    color: "#E4405F"
  },
  {
    id: 2,
    title: "YouTube Views Boost",
    description: "Organic-looking views from diverse geographic locations. Retention rate above 80%.",
    price: "$19.99",
    originalPrice: "$29.99",
    icon: "📺",
    features: ["High Retention", "Global Sources", "Fast Delivery", "Analytics Safe"],
    badge: "Best Value",
    color: "#FF0000"
  },
  {
    id: 3,
    title: "TikTok Viral Package",
    description: "Complete viral growth package including likes, views, and followers for maximum impact.",
    price: "$39.99",
    originalPrice: "$59.99",
    icon: "🎵",
    features: ["Complete Package", "Viral Algorithm", "Engagement Boost", "Trending Support"],
    badge: "Premium",
    color: "#000000"
  },
  {
    id: 4,
    title: "Discord Community Growth",
    description: "Boost your Discord server with active members and engagement for thriving communities.",
    price: "$29.99",
    originalPrice: "$44.99",
    icon: "🎮",
    features: ["Active Members", "Engagement Boost", "Community Building", "Server Optimization"],
    badge: "New",
    color: "#7289DA"
  }
];

const FeaturedServices = () => {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-hero">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-accent-lavender/20 rounded-full px-4 py-2 mb-6">
            <Star className="w-4 h-4 text-accent-peach" />
            <span className="text-sm font-medium text-primary">Featured Services</span>
          </div>
          
          <h2 className="font-clash text-4xl md:text-6xl font-bold text-primary mb-6">
            Our Top Performers
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Hand-picked services that deliver exceptional results. 
            These are our most popular and effective growth solutions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
          {featuredServices.map((service, index) => (
            <div
              key={service.id}
              className="stagger-item relative group"
              style={{ animationDelay: `${index * 0.15}s` }}
              onMouseEnter={() => setHoveredCard(service.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className="service-card relative h-full flex flex-col">
                {/* Badge */}
                <div className="absolute -top-3 -right-3 z-10">
                  <div 
                    className="glass rounded-full px-3 py-1 text-xs font-bold text-primary border"
                    style={{ borderColor: service.color + '40' }}
                  >
                    {service.badge}
                  </div>
                </div>

                {/* Icon and glow effect */}
                <div className="relative mb-4">
                  <div 
                    className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-xl"
                    style={{ backgroundColor: service.color }}
                  />
                  <div className="text-5xl relative z-10 group-hover:scale-110 transition-transform duration-300">
                    {service.icon}
                  </div>
                </div>

                {/* Service details */}
                <div className="flex-grow">
                  <h3 className="font-clash text-xl font-semibold text-primary mb-2">
                    {service.title}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                    {service.description}
                  </p>

                  {/* Features */}
                  <div className="space-y-2 mb-6">
                    {service.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs">
                        <div className="w-1.5 h-1.5 rounded-full bg-accent-peach" />
                        <span className="text-muted-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pricing */}
                <div className="mt-auto">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-2xl font-bold text-primary font-clash">
                      {service.price}
                    </span>
                    <span className="text-sm text-muted-foreground line-through">
                      {service.originalPrice}
                    </span>
                  </div>

                  {/* Action button */}
                  <button 
                    className="w-full glass-button text-center group/btn relative overflow-hidden"
                    style={{
                      background: hoveredCard === service.id 
                        ? `linear-gradient(135deg, ${service.color}20, ${service.color}10)` 
                        : undefined
                    }}
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      Get Started
                      <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-300" />
                    </span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust indicators */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="glass rounded-2xl p-6 text-center">
            <Clock className="w-8 h-8 text-accent-peach mx-auto mb-4" />
            <h3 className="font-semibold text-primary mb-2">Instant Delivery</h3>
            <p className="text-sm text-muted-foreground">Services start within 0-6 hours</p>
          </div>
          
          <div className="glass rounded-2xl p-6 text-center">
            <Shield className="w-8 h-8 text-accent-lavender mx-auto mb-4" />
            <h3 className="font-semibold text-primary mb-2">Secure & Safe</h3>
            <p className="text-sm text-muted-foreground">100% secure payment & privacy</p>
          </div>
          
          <div className="glass rounded-2xl p-6 text-center">
            <Zap className="w-8 h-8 text-accent-peach mx-auto mb-4" />
            <h3 className="font-semibold text-primary mb-2">Money-Back Guarantee</h3>
            <p className="text-sm text-muted-foreground">30-day satisfaction guarantee</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedServices;