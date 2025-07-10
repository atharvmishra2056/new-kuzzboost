import { useState, useEffect } from "react";
import { Calculator, TrendingUp, Sparkles } from "lucide-react";

const platforms = [
  { name: "Instagram", icon: "📷", services: ["Followers", "Likes", "Views", "Story Views"] },
  { name: "YouTube", icon: "📺", services: ["Subscribers", "Views", "Likes", "Comments"] },
  { name: "TikTok", icon: "🎵", services: ["Followers", "Likes", "Views", "Shares"] },
  { name: "Twitter", icon: "🐦", services: ["Followers", "Likes", "Retweets", "Views"] }
];

const ServiceCalculator = () => {
  const [selectedPlatform, setSelectedPlatform] = useState(platforms[0]);
  const [selectedService, setSelectedService] = useState(platforms[0].services[0]);
  const [quantity, setQuantity] = useState(1000);
  const [price, setPrice] = useState(0);

  // Price calculation logic
  useEffect(() => {
    const baseRates: { [key: string]: { [key: string]: number } } = {
      "Instagram": { "Followers": 0.02, "Likes": 0.005, "Views": 0.001, "Story Views": 0.001 },
      "YouTube": { "Subscribers": 0.05, "Views": 0.001, "Likes": 0.01, "Comments": 0.15 },
      "TikTok": { "Followers": 0.015, "Likes": 0.003, "Views": 0.0005, "Shares": 0.08 },
      "Twitter": { "Followers": 0.03, "Likes": 0.008, "Retweets": 0.02, "Views": 0.0008 }
    };

    const rate = baseRates[selectedPlatform.name]?.[selectedService] || 0.01;
    const calculatedPrice = Math.max(5.99, quantity * rate);
    setPrice(Math.round(calculatedPrice * 100) / 100);
  }, [selectedPlatform, selectedService, quantity]);

  const handleQuantityChange = (value: number) => {
    setQuantity(Math.max(100, Math.min(100000, value)));
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-accent-peach/20 rounded-full px-4 py-2 mb-6">
            <Calculator className="w-4 h-4 text-accent-lavender" />
            <span className="text-sm font-medium text-primary">Service Calculator</span>
          </div>
          
          <h2 className="font-clash text-4xl md:text-5xl font-bold text-primary mb-4">
            Calculate Your Growth
          </h2>
          <p className="text-xl text-muted-foreground">
            Get instant pricing for your social media growth needs. 
            Transparent, competitive rates with no hidden fees.
          </p>
        </div>

        <div className="glass rounded-3xl p-8 md:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Configuration Panel */}
            <div className="space-y-8">
              {/* Platform Selection */}
              <div>
                <label className="block text-sm font-medium text-primary mb-4">
                  Select Platform
                </label>
                <div className="grid grid-cols-2 gap-4">
                  {platforms.map((platform) => (
                    <button
                      key={platform.name}
                      onClick={() => {
                        setSelectedPlatform(platform);
                        setSelectedService(platform.services[0]);
                      }}
                      className={`p-4 rounded-2xl border-2 transition-all duration-300 ${
                        selectedPlatform.name === platform.name
                          ? 'border-primary bg-primary/10'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <div className="text-2xl mb-2">{platform.icon}</div>
                      <div className="text-sm font-medium text-primary">
                        {platform.name}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Service Selection */}
              <div>
                <label className="block text-sm font-medium text-primary mb-4">
                  Select Service
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {selectedPlatform.services.map((service) => (
                    <button
                      key={service}
                      onClick={() => setSelectedService(service)}
                      className={`p-3 rounded-xl border transition-all duration-300 text-sm font-medium ${
                        selectedService === service
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border hover:border-primary/50 text-muted-foreground'
                      }`}
                    >
                      {service}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity Slider */}
              <div>
                <label className="block text-sm font-medium text-primary mb-4">
                  Quantity: {quantity.toLocaleString()}
                </label>
                <div className="space-y-4">
                  <input
                    type="range"
                    min="100"
                    max="100000"
                    step="100"
                    value={quantity}
                    onChange={(e) => handleQuantityChange(parseInt(e.target.value))}
                    className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>100</span>
                    <span>10K</span>
                    <span>50K</span>
                    <span>100K</span>
                  </div>
                </div>
              </div>

              {/* Quick Amount Buttons */}
              <div className="grid grid-cols-4 gap-2">
                {[1000, 5000, 10000, 25000].map((amount) => (
                  <button
                    key={amount}
                    onClick={() => setQuantity(amount)}
                    className="p-2 rounded-lg border border-border hover:border-primary/50 text-xs font-medium text-muted-foreground hover:text-primary transition-all duration-300"
                  >
                    {amount >= 1000 ? `${amount/1000}K` : amount}
                  </button>
                ))}
              </div>
            </div>

            {/* Pricing Panel */}
            <div className="space-y-8">
              <div className="glass rounded-2xl p-8 text-center">
                <div className="text-6xl mb-4">{selectedPlatform.icon}</div>
                <h3 className="font-clash text-2xl font-bold text-primary mb-2">
                  {selectedPlatform.name} {selectedService}
                </h3>
                <div className="text-5xl font-bold text-primary font-clash mb-4">
                  ${price}
                </div>
                <div className="text-sm text-muted-foreground mb-6">
                  For {quantity.toLocaleString()} {selectedService.toLowerCase()}
                </div>
                
                <button className="glass-button w-full mb-4 group">
                  <Sparkles className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform duration-300" />
                  Add to Cart
                </button>
                
                <div className="text-xs text-muted-foreground">
                  ⚡ Instant delivery • 🛡️ Money-back guarantee
                </div>
              </div>

              {/* Features */}
              <div className="space-y-4">
                <h4 className="font-semibold text-primary flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  What You Get
                </h4>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent-peach" />
                    High-quality, active accounts
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent-lavender" />
                    Gradual delivery (0-6 hours start)
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent-peach" />
                    24/7 customer support
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent-lavender" />
                    30-day refill guarantee
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServiceCalculator;