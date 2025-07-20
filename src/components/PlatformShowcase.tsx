import { useState } from "react";
import { motion, Variants } from "framer-motion";
import { SiInstagram, SiYoutube, SiX, SiDiscord, SiTwitch, SiSpotify, SiSnapchat, SiWhatsapp } from "react-icons/si";
import { Link } from "react-router-dom"; // Import Link from react-router-dom

const platforms = [
  { name: "Instagram", icon: <SiInstagram />, color: "#E4405F", description: "Followers, Likes, Views" },
  { name: "YouTube", icon: <SiYoutube />, color: "#FF0000", description: "Subscribers, Views, Likes" },
  { name: "Snapchat", icon: <SiSnapchat />, color: "#FFFC00", description: "Followers, Likes, Views" },
  { name: "Twitter", icon: <SiX />, color: "#1DA1F2", description: "Followers, Retweets, Likes" },
  { name: "Discord", icon: <SiDiscord />, color: "#7289DA", description: "Server Members, Boosts" },
  { name: "Twitch", icon: <SiTwitch />, color: "#9146FF", description: "Followers, Views, Chat" },
  { name: "Spotify", icon: <SiSpotify />, color: "#1DB954", description: "Plays, Followers, Saves" },
  { name: "Whatsapp", icon: <SiWhatsapp />, color: "#25D366", description: "Group Members, Views" }
];

const PlatformShowcase = () => {
  const [hoveredPlatform, setHoveredPlatform] = useState<string | null>(null);

  const cardVariants: Variants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: (i: number) => ({
      opacity: 1,
      scale: 1,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: "easeOut"
      }
    })
  };

  return (
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-clash text-4xl md:text-5xl font-bold text-primary mb-6">
              Supported Platforms
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              We provide premium growth services across all major social media platforms.
              Choose your platform and watch your presence soar.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
            {platforms.map((platform, index) => (
                <motion.div
                    key={platform.name}
                    className="relative group"
                    custom={index}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    onMouseEnter={() => setHoveredPlatform(platform.name)}
                    onMouseLeave={() => setHoveredPlatform(null)}
                >
                  <div className="service-card text-center h-48 flex flex-col justify-center items-center relative overflow-hidden">
                    {/* Background glow effect */}
                    <div
                        className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500 rounded-3xl"
                        style={{ backgroundColor: platform.color }}
                    />

                    {/* Platform icon */}
                    <div className="text-6xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                      {platform.icon}
                    </div>

                    {/* Platform name */}
                    <h3 className="font-clash text-xl font-semibold text-primary mb-2">
                      {platform.name}
                    </h3>

                    {/* Services offered */}
                    <p className="text-sm text-muted-foreground px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {platform.description}
                    </p>

                    {/* Tooltip */}
                    {hoveredPlatform === platform.name && (
                        <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 glass rounded-lg px-3 py-1 text-sm font-medium whitespace-nowrap z-10">
                          {platform.name} Services
                          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-glass-border" />
                        </div>
                    )}
                  </div>
                </motion.div>
            ))}
          </div>

          {/* Call to action */}
          <div className="text-center mt-16">
            <div className="glass rounded-2xl p-8 max-w-2xl mx-auto">
              <h3 className="font-clash text-2xl font-semibold text-primary mb-4">
                Ready to Grow Your Presence?
              </h3>
              <p className="text-muted-foreground mb-6">
                Select your platform and discover our premium growth services tailored just for you.
              </p>
              <Link to="/services" className="glass-button">
                View All Services
              </Link>
            </div>
          </div>
        </div>
      </section>
  );
};

export default PlatformShowcase;
