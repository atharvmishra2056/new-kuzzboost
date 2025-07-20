import { useEffect } from "react";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import { motion, Variants } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useServices } from "@/components/Services";
import { Badge } from "@/components/ui/badge";
import { useCurrency } from "../context/CurrencyContext";

const Services = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { services, loading } = useServices();
  const { getSymbol, convert } = useCurrency();

  useEffect(() => {
    if (currentUser) {
      navigate('/dashboard');
    }
  }, [currentUser, navigate]);

  if (loading) {
    return <div className="text-center py-20 text-lg font-semibold">Loading Services...</div>;
  }

  const limitedServices = services
    .sort((a, b) => b.reviews - a.reviews)
    .slice(0, 6);

  const listVariants: Variants = { visible: { transition: { staggerChildren: 0.1 } } };
  const itemVariants: Variants = { hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } };

  return (
    <div className="min-h-screen bg-gradient-hero">
      <Navigation />
      <section className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="font-clash text-5xl md:text-7xl font-bold text-primary mb-6">Our Services</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">Premium social media growth services to elevate your online presence.</p>
          </div>
        </div>
      </section>
      <section className="pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" initial="hidden" animate="visible" variants={listVariants}>
            {limitedServices.map((service) => (
              <motion.div
                key={service.id}
                className="service-card group relative cursor-not-allowed h-full flip-container"
                variants={itemVariants}
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flipper">
                  <div className="front flex flex-col h-full p-4">
                    <div className="relative mb-6">
                      <div className="text-5xl mb-2 flex justify-center">
                        {service.icon}
                      </div>
                      <div className="text-center">
                        <Badge className="bg-accent-peach/20 text-primary">{service.platform.charAt(0).toUpperCase() + service.platform.slice(1)}</Badge>
                      </div>
                    </div>
                    <h3 className="font-clash text-xl font-semibold text-primary mb-2 line-clamp-2">
                      {service.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-3 filter blur-sm">
                      Sign up to see details
                    </p>
                  </div>
                  <div className="back flex flex-col h-full p-4">
                    <div className="relative mb-6">
                      <div className="text-5xl mb-2 flex justify-center">
                        {service.icon}
                      </div>
                      <div className="text-center">
                        <Badge className="bg-accent-peach/90 text-white">{service.badge}</Badge>
                      </div>
                    </div>
                    <h3 className="font-clash text-xl font-semibold text-primary mb-2 line-clamp-2">
                      {service.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {service.description.slice(0, 100)}...
                    </p>
                    {service.tiers && service.tiers.length > 0 && (
                      <div className="mt-auto pt-4 border-t border-border/20">
                        <div className="flex items-baseline justify-center gap-2">
                          <span className="text-lg font-bold text-primary font-clash">
                            Starting from {getSymbol()}{convert(service.tiers[0].price)}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
            <motion.div
              className="service-card flex flex-col items-center justify-center text-center p-6"
              variants={itemVariants}
            >
              <div className="text-5xl mb-4">...</div>
              <h3 className="font-clash text-2xl font-semibold text-primary mb-4">And Many More</h3>
              <p className="text-muted-foreground">Sign up to unlock all premium services and details.</p>
            </motion.div>
          </motion.div>
          <div className="text-center mt-16">
            <p className="text-xl text-muted-foreground mb-6">Sign in or Sign up to unlock all premium services.</p>
            <Link to="/auth" className="glass-button mr-4">Sign In</Link>
            <Link to="/auth?tab=signup" className="glass-button">Sign Up</Link>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Services;
