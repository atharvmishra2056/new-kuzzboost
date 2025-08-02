import { motion } from 'framer-motion';
import { Users, ThumbsUp, Zap, CheckCircle } from 'lucide-react';

const socialProofItems = [
  {
    id: 1,
    platform: 'instagram',
    username: 'jennifer_doe',
    action: 'just purchased',
    service: '1,000 Instagram Followers',
    time: '2m ago',
    icon: <Users className="w-4 h-4 text-pink-500" />
  },
  {
    id: 2,
    platform: 'tiktok',
    username: 'mike_tiktoker',
    action: 'gained',
    service: '5,000 TikTok Likes',
    time: '5m ago',
    icon: <ThumbsUp className="w-4 h-4 text-blue-400" />
  },
  {
    id: 3,
    platform: 'youtube',
    username: 'creative_vibes',
    action: 'just ordered',
    service: '10,000 YouTube Views',
    time: '12m ago',
    icon: <Zap className="w-4 h-4 text-red-500" />
  },
  {
    id: 4,
    platform: 'twitter',
    username: 'techtalker',
    action: 'completed order for',
    service: '2,500 Twitter Followers',
    time: '18m ago',
    icon: <Users className="w-4 h-4 text-blue-400" />
  },
  {
    id: 5,
    platform: 'instagram',
    username: 'travel_addict',
    action: 'received',
    service: '500 Instagram Likes',
    time: '25m ago',
    icon: <ThumbsUp className="w-4 h-4 text-pink-500" />
  },
  {
    id: 6,
    platform: 'tiktok',
    username: 'dance_queen',
    action: 'just purchased',
    service: '1,000 TikTok Followers',
    time: '32m ago',
    icon: <Users className="w-4 h-4 text-black dark:text-white" />
  }
];

const getPlatformColor = (platform: string) => {
  switch (platform) {
    case 'instagram':
      return 'bg-gradient-to-r from-pink-500 to-yellow-500';
    case 'tiktok':
      return 'bg-gradient-to-r from-black to-pink-500';
    case 'youtube':
      return 'bg-red-600';
    case 'twitter':
      return 'bg-blue-400';
    default:
      return 'bg-primary';
  }
};

export default function SocialProofFeed() {
  return (
    <section className="py-16 bg-muted/40 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Real-time Social Proof</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join thousands of satisfied customers growing their social presence with us
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Feed container */}
            <div className="space-y-4">
              {socialProofItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  className="bg-background/80 backdrop-blur-sm rounded-xl p-4 border border-border/50 shadow-sm hover:shadow-md transition-all"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white ${getPlatformColor(item.platform)}`}>
                      {item.platform.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{item.username}</span>
                          <span className="text-muted-foreground text-sm">{item.action}</span>
                          <span className="font-medium text-primary">{item.service}</span>
                        </div>
                        <div className="flex items-center gap-1 text-muted-foreground text-sm">
                          {item.icon}
                          <span>{item.time}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Stats */}
            <motion.div 
              className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <div className="bg-background rounded-xl p-6 text-center border border-border/50">
                <div className="text-3xl font-bold text-primary mb-2">50K+</div>
                <div className="text-muted-foreground">Happy Clients</div>
              </div>
              <div className="bg-background rounded-xl p-6 text-center border border-border/50">
                <div className="text-3xl font-bold text-primary mb-2">10M+</div>
                <div className="text-muted-foreground">Orders Completed</div>
              </div>
              <div className="bg-background rounded-xl p-6 text-center border border-border/50">
                <div className="text-3xl font-bold text-primary mb-2">99.9%</div>
                <div className="text-muted-foreground">Uptime</div>
              </div>
              <div className="bg-background rounded-xl p-6 text-center border border-border/50">
                <div className="text-3xl font-bold text-primary mb-2">24/7</div>
                <div className="text-muted-foreground">Support</div>
              </div>
            </motion.div>

            <motion.div 
              className="mt-12 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary/5 border border-border/50 text-primary font-medium">
                <CheckCircle className="w-5 h-5" />
                <span>30-Day Money Back Guarantee • Secure Payment • No Password Required</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-background to-transparent -z-10" />
      <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-primary/5 blur-3xl -z-0" />
    </section>
  );
}
