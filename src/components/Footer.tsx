import { Link } from 'react-router-dom';
import { SiInstagram, SiYoutube, SiDiscord, SiX } from 'react-icons/si';
import { motion } from 'framer-motion';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: <SiInstagram />, href: "https://instagram.com/kuzzboost", label: "Instagram" },
    { icon: <SiYoutube />, href: "https://youtube.com/@KuzzBoost", label: "YouTube" },
    { icon: <SiDiscord />, href: "https://discord.gg/your-server", label: "Discord" },
    { icon: <SiX />, href: "https://x.com/kuzzboost", label: "X (Twitter)" },
  ];

  const footerSections = [
    {
      title: "Services",
      links: [
        { name: "Instagram", href: "/services?platform=instagram" },
        { name: "YouTube", href: "/services?platform=youtube" },
        { name: "Discord", href: "/services?platform=discord" },
        { name: "More...", href: "/services" },
      ],
    },
    {
      title: "Company",
      links: [
        { name: "About Us", href: "/about" },
        { name: "Contact Us", href: "/contact" },
        { name: "Blog", href: "/blog" },
      ],
    },
    {
      title: "Legal",
      links: [
        { name: "Terms of Service", href: "/terms" },
        { name: "Privacy Policy", href: "/privacy" },
        { name: "Refund Policy", href: "/refund-policy" }, // Assuming this page will be created later
      ],
    },
    {
      title: "Contact Us",
      links: [
        { name: "support@kuzzboost.shop", href: "mailto:support@kuzzboost.shop" }
      ],
    },
  ];

  return (
      <footer className="bg-gradient-to-t from-black/20 via-transparent to-transparent text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            {/* KuzzBoost Info Section */}
            <div className="col-span-2 md:col-span-1">
              <h2 className="text-2xl font-clash font-bold text-primary">KuzzBoost</h2>
              <p className="mt-4 text-sm text-muted-foreground">
                Elevating your social media presence with top-tier services and unparalleled support.
              </p>
              <div className="flex space-x-4 mt-6">
                {socialLinks.map((social, index) => (
                    <motion.a
                        key={index}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-primary transition-colors"
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                        aria-label={social.label}
                    >
                      {social.icon}
                    </motion.a>
                ))}
              </div>
            </div>

            {/* Footer Links Sections */}
            {footerSections.map((section, index) => (
                <div key={index}>
                  <h3 className="font-semibold text-primary">{section.title}</h3>
                  <ul className="mt-4 space-y-2">
                    {section.links.map((link, linkIndex) => (
                        <li key={linkIndex}>
                          <Link
                              to={link.href}
                              className="text-sm text-muted-foreground hover:text-primary transition-colors"
                          >
                            {link.name}
                          </Link>
                        </li>
                    ))}
                  </ul>
                </div>
            ))}
          </div>

          <div className="mt-12 border-t border-border/20 pt-8 flex flex-col sm:flex-row justify-between items-center text-sm text-muted-foreground">
            <p>&copy; {currentYear} KuzzBoost. All rights reserved.</p>
            <p className="mt-4 sm:mt-0">Made with ❤️ in India</p>
          </div>
        </div>
      </footer>
  );
};

export default Footer;
