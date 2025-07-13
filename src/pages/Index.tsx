import { useState, ReactElement } from "react";
import Navigation from "../components/Navigation";
import HeroSection from "../components/HeroSection";
import PlatformShowcase from "../components/PlatformShowcase";
import FeaturedServices from "../components/FeaturedServices";
import HowItWorks from "../components/HowItWorks";
import Testimonials from "../components/Testimonials";
import Footer from "../components/Footer";
import ParticleField from "../components/ParticleField";
import Cart from "../components/Cart";
import { ServiceCalculatorModal, Service } from "./Services"; // Import modal and Service type
import { Dialog } from "@/components/ui/dialog";

const Index = () => {
    const [selectedServiceForCalc, setSelectedServiceForCalc] = useState<Service | null>(null);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [cartItems, setCartItems] = useState<any[]>([]);

    const handleCustomizeClick = (service: Service) => {
        setSelectedServiceForCalc(service);
    };

    const handleCloseModal = () => {
        setSelectedServiceForCalc(null);
    };

    const addToCart = (service: Service, quantity: number, price: number) => {
        setCartItems(prev => [...prev, { ...service, quantity, price }]);
        handleCloseModal();
        setIsCartOpen(true);
    };

    return (
        <div className="min-h-screen bg-gradient-hero relative overflow-hidden">
            <ParticleField />
            <Navigation cartItemCount={cartItems.length} onCartClick={() => setIsCartOpen(true)} />
            <HeroSection />
            <PlatformShowcase />
            <FeaturedServices onCustomizeClick={handleCustomizeClick} />
            <HowItWorks />
            <Testimonials />
            <Footer />

            <Dialog open={!!selectedServiceForCalc} onOpenChange={(isOpen) => { if (!isOpen) handleCloseModal(); }}>
                {selectedServiceForCalc && (
                    <ServiceCalculatorModal
                        service={selectedServiceForCalc}
                        onAddToCart={addToCart}
                    />
                )}
            </Dialog>

            <Cart
                isOpen={isCartOpen}
                onClose={() => setIsCartOpen(false)}
                items={cartItems}
                onUpdateQuantity={() => {}}
                onRemoveItem={() => {}}
                onClearCart={() => setCartItems([])}
            />
        </div>
    );
};

export default Index;