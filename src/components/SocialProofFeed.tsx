import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { MapPin, Clock, X } from "lucide-react";

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

const NOTIFICATION_VISIBLE_TIME = 8000; // 8 seconds
// FIX: Defined the missing constant for the cycle time
const NOTIFICATION_CYCLE_TIME = 15 * 60 * 1000; // 15 minutes

const SocialProofFeed = () => {
  const [currentPurchaseIndex, setCurrentPurchaseIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(() => sessionStorage.getItem('socialProofDismissed') === 'true');

  useEffect(() => {
    if (isDismissed) return;

    let hideTimeout: NodeJS.Timeout;
    let cycleTimeout: NodeJS.Timeout;
    let initialDelay: NodeJS.Timeout;

    const showNotification = () => {
      setIsVisible(true);
      // Hide the notification after 8 seconds
      hideTimeout = setTimeout(() => {
        setIsVisible(false);
      }, NOTIFICATION_VISIBLE_TIME);
    };

    // This function will now run correctly
    const cycleNotification = () => {
      showNotification();

      // Set the next cycle for 15 minutes later
      cycleTimeout = setTimeout(() => {
        setCurrentPurchaseIndex(prev => (prev + 1) % mockPurchases.length);
        // The recursive call is intended to create the loop
      }, NOTIFICATION_CYCLE_TIME);
    };

    // Start the first notification after a 2-second delay
    initialDelay = setTimeout(cycleNotification, 2000);

    // Cleanup all timers when the component unmounts or is dismissed
    return () => {
      clearTimeout(initialDelay);
      clearTimeout(hideTimeout);
      clearTimeout(cycleTimeout);
    };
    // We add currentPurchaseIndex to the dependency array to trigger the next cycle
  }, [isDismissed, currentPurchaseIndex]);

  const handleDismiss = () => {
    setIsVisible(false);
    setIsDismissed(true);
    sessionStorage.setItem('socialProofDismissed', 'true');
  };

  const purchase = mockPurchases[currentPurchaseIndex];

  if (isDismissed && !isVisible) return null;

  return (
      <div className="fixed bottom-6 left-6 z-50 max-w-sm w-[calc(100%-3rem)]">
        <div
            key={currentPurchaseIndex}
            className={`social-proof transform transition-all duration-500 ${
                isVisible ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'
            }`}
        >
          <div
              className="absolute top-2 right-2 w-8 h-8 cursor-pointer group"
              onClick={handleDismiss}
          >
            <svg className="progress-circle z-10" width="32" height="32" viewBox="0 0 32 32">
              <circle cx="16" cy="16" r="14" className="progress-circle__background" />
              <circle cx="16" cy="16" r="14" className="progress-circle__circle" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center w-full h-full bg-gradient-vibrant rounded-full text-white group-hover:scale-110 transition-transform duration-200 z-0">
              <X className="w-4 h-4 z-20" />
            </div>
          </div>

          <div className="flex items-center gap-3 pr-8">
            <div className="text-2xl">{purchase.icon}</div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-primary truncate">
                Someone from <span className="font-semibold">{purchase.location}</span>
              </div>
              <div className="text-xs text-muted-foreground truncate">
                just purchased {purchase.service}
              </div>
              <div className="flex items-center gap-1 text-xs text-accent-peach mt-1">
                <Clock className="w-3 h-3" />
                {purchase.timeAgo}
              </div>
            </div>
            <MapPin className="w-4 h-4 text-accent-lavender flex-shrink-0" />
          </div>
        </div>

      </div>
  );
};

export default SocialProofFeed;
