import { useState, useEffect } from "react";
import { MapPin, Clock } from "lucide-react";

interface Purchase {
  id: string;
  location: string;
  service: string;
  platform: string;
  icon: string;
  timeAgo: string;
}

const mockPurchases: Purchase[] = [
  { id: "1", location: "New York", service: "1,000 YouTube Views", platform: "YouTube", icon: "📺", timeAgo: "2 minutes ago" },
  { id: "2", location: "London", service: "500 Instagram Followers", platform: "Instagram", icon: "📷", timeAgo: "5 minutes ago" },
  { id: "3", location: "Tokyo", service: "2,000 TikTok Likes", platform: "TikTok", icon: "🎵", timeAgo: "8 minutes ago" },
  { id: "4", location: "Paris", service: "750 Twitter Followers", platform: "Twitter", icon: "🐦", timeAgo: "12 minutes ago" },
  { id: "5", location: "Sydney", service: "1,500 Instagram Likes", platform: "Instagram", icon: "📷", timeAgo: "15 minutes ago" },
  { id: "6", location: "Berlin", service: "300 YouTube Subscribers", platform: "YouTube", icon: "📺", timeAgo: "18 minutes ago" },
  { id: "7", location: "Toronto", service: "5,000 TikTok Views", platform: "TikTok", icon: "🎵", timeAgo: "22 minutes ago" },
  { id: "8", location: "Dubai", service: "1,000 Discord Members", platform: "Discord", icon: "🎮", timeAgo: "25 minutes ago" }
];

const SocialProofFeed = () => {
  const [currentPurchase, setCurrentPurchase] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentPurchase((prev) => (prev + 1) % mockPurchases.length);
        setIsVisible(true);
      }, 300);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const purchase = mockPurchases[currentPurchase];

  return (
    <div className="fixed bottom-6 left-6 z-50 max-w-sm">
      <div 
        className={`social-proof transform transition-all duration-300 ${
          isVisible ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'
        }`}
      >
        <div className="flex items-center gap-3">
          {/* Platform icon */}
          <div className="text-2xl">{purchase.icon}</div>
          
          {/* Purchase details */}
          <div className="flex-1">
            <div className="text-sm font-medium text-primary">
              Someone from <span className="font-semibold">{purchase.location}</span>
            </div>
            <div className="text-xs text-muted-foreground">
              just purchased {purchase.service}
            </div>
            <div className="flex items-center gap-1 text-xs text-accent-peach mt-1">
              <Clock className="w-3 h-3" />
              {purchase.timeAgo}
            </div>
          </div>
          
          {/* Location icon */}
          <MapPin className="w-4 h-4 text-accent-lavender" />
        </div>
        
        {/* Progress indicator */}
        <div className="mt-3 flex gap-1">
          {mockPurchases.map((_, index) => (
            <div
              key={index}
              className={`h-1 rounded-full transition-all duration-300 ${
                index === currentPurchase 
                  ? 'bg-accent-peach flex-1' 
                  : 'bg-accent-peach/30 w-1'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SocialProofFeed;