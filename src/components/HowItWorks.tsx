import { motion, Variants } from "framer-motion";
import { Award, MousePointer, TrendingUp } from "lucide-react"; // Corrected import
import React from "react";
import { Link } from "react-router-dom";

const steps = [
    {
        icon: <MousePointer className="w-10 h-10" />, // Corrected component name
        title: "Choose Your Service",
        description: "Browse our wide range of services across all major social media platforms and select the one that fits your needs."
    },
    {
        icon: <Award className="w-10 h-10" />,
        title: "Customize Your Order",
        description: "Use our simple calculator to select the exact quantity you need. Our pricing is transparent with no hidden fees."
    },
    {
        icon: <TrendingUp className="w-10 h-10" />,
        title: "Watch Your Growth",
        description: "Once your order is placed, our system gets to work instantly. Watch your social presence grow within hours."
    }
];

const HowItWorks = () => {
    const sectionVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    // Corrected Variants type for framer-motion
    const stepVariants: Variants = {
        hidden: { opacity: 0, y: 50 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                ease: "easeOut" // This is a valid Easing string
            }
        }
    };

    return (
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-background">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="font-clash text-4xl md:text-5xl font-bold text-primary mb-6">
                        Get Started in 3 Easy Steps
                    </h2>
                    <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                        A seamless and straightforward process to kickstart your social media growth.
                    </p>
                </div>
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center"
                    variants={sectionVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                >
                    {steps.map((step, index) => (
                        <motion.div key={index} variants={stepVariants} className="flex flex-col items-center">
                            <div className="w-24 h-24 mb-6 flex items-center justify-center rounded-full bg-gradient-vibrant text-primary-foreground shadow-lg">
                                {step.icon}
                            </div>
                            <h3 className="font-clash text-2xl font-semibold text-primary mb-4">
                                {step.title}
                            </h3>
                            <p className="text-muted-foreground leading-relaxed">
                                {step.description}
                            </p>
                        </motion.div>
                    ))}
                </motion.div>
                <div className="text-center mt-16">
                    <Link to="/services" className="glass-button animate-breathing-glow">
                        View All Services
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;