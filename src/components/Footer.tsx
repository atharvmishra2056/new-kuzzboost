import { Instagram, Youtube, Twitter, MessageCircle, Mail, Phone } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const platforms = [
    { name: "Instagram", icon: Instagram, href: "#" },
    { name: "YouTube", icon: Youtube, href: "#" },
    { name: "Twitter", icon: Twitter, href: "#" },
    { name: "Discord", icon: MessageCircle, href: "#" }
  ];

  const services = [
    "Instagram Growth",
    "YouTube Promotion", 
    "TikTok Boost",
    "Twitter Engagement",
    "Discord Communities",
    "Spotify Promotion"
  ];

  const company = [
    "About Us",
    "Our Team", 
    "Careers",
    "Blog",
    "Press Kit"
  ];

  const support = [
    "Help Center",
    "Contact Support",
    "API Documentation",
    "Status Page",
    "Terms of Service",
    "Privacy Policy"
  ];

  return (
    <footer className="bg-gradient-hero border-t border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <h3 className="font-clash text-2xl font-bold text-primary mb-4">
              KuzzBoost
            </h3>
            <p className="text-muted-foreground mb-6 max-w-md">
              The ultimate marketplace for authentic social media growth. 
              Elevate your online presence with our premium services and 
              24/7 expert support.
            </p>
            
            {/* Social Links */}
            <div className="flex gap-4 mb-6">
              {platforms.map((platform) => {
                const Icon = platform.icon;
                return (
                  <a
                    key={platform.name}
                    href={platform.href}
                    className="w-10 h-10 glass rounded-xl flex items-center justify-center hover:scale-110 transition-all duration-300 group"
                  >
                    <Icon className="w-5 h-5 text-muted-foreground group-hover:text-accent-peach" />
                  </a>
                );
              })}
            </div>

            {/* Contact Info */}
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>support@kuzzboost.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>24/7 Live Support</span>
              </div>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold text-primary mb-4">Services</h4>
            <ul className="space-y-3">
              {services.map((service) => (
                <li key={service}>
                  <a 
                    href="#" 
                    className="text-muted-foreground hover:text-accent-peach transition-colors duration-200 text-sm"
                  >
                    {service}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-primary mb-4">Company</h4>
            <ul className="space-y-3">
              {company.map((item) => (
                <li key={item}>
                  <a 
                    href="#" 
                    className="text-muted-foreground hover:text-accent-peach transition-colors duration-200 text-sm"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold text-primary mb-4">Support</h4>
            <ul className="space-y-3">
              {support.map((item) => (
                <li key={item}>
                  <a 
                    href="#" 
                    className="text-muted-foreground hover:text-accent-peach transition-colors duration-200 text-sm"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="glass rounded-2xl p-6 mb-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="font-semibold text-primary mb-2">Stay Updated</h4>
              <p className="text-muted-foreground text-sm">
                Get the latest social media growth tips and exclusive offers.
              </p>
            </div>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-4 py-2 bg-background/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-peach/50 text-sm min-w-[200px]"
              />
              <button className="glass-button px-6 py-2 text-sm">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-border/50">
          <p className="text-muted-foreground text-sm mb-4 md:mb-0">
            © {currentYear} KuzzBoost. All rights reserved.
          </p>
          
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-accent-peach transition-colors duration-200">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-accent-peach transition-colors duration-200">
              Terms of Service
            </a>
            <a href="#" className="hover:text-accent-peach transition-colors duration-200">
              Cookie Policy
            </a>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="flex flex-wrap items-center justify-center gap-6 mt-8 pt-8 border-t border-border/30">
          <div className="text-xs text-muted-foreground flex items-center gap-2">
            <div className="w-2 h-2 bg-success rounded-full"></div>
            SSL Secured
          </div>
          <div className="text-xs text-muted-foreground flex items-center gap-2">
            <div className="w-2 h-2 bg-accent-peach rounded-full"></div>
            99.9% Uptime
          </div>
          <div className="text-xs text-muted-foreground flex items-center gap-2">
            <div className="w-2 h-2 bg-accent-mint rounded-full"></div>
            24/7 Support
          </div>
          <div className="text-xs text-muted-foreground flex items-center gap-2">
            <div className="w-2 h-2 bg-accent-lavender rounded-full"></div>
            Money Back Guarantee
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;