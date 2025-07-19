import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Mail, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const ContactUs = () => {
    return (
        <div className="min-h-screen bg-gradient-hero">
            <Navigation />
            <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-2xl mx-auto text-center">
                    <h1 className="font-clash text-4xl md:text-5xl font-bold text-primary mb-4">Get in Touch</h1>
                    <p className="text-lg text-muted-foreground mb-12">
                        Have questions about our services or need help with an order? We're here to help!
                    </p>
                </div>
                <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="glass rounded-2xl p-8">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 bg-accent-peach/20 rounded-lg flex items-center justify-center">
                                <Mail className="w-6 h-6 text-accent-peach" />
                            </div>
                            <h2 className="font-clash text-2xl font-semibold text-primary">Email Support</h2>
                        </div>
                        <p className="text-muted-foreground mb-4">
                            The best way to reach us is by email. We aim to respond to all inquiries within 24 hours.
                        </p>
                        <a href="mailto:support@kuzzboost.shop">
                            <Button className="w-full glass-button">
                                support@kuzzboost.shop
                            </Button>
                        </a>
                    </div>
                    <div className="glass rounded-2xl p-8">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 bg-accent-peach/20 rounded-lg flex items-center justify-center">
                                <HelpCircle className="w-6 h-6 text-accent-peach" />
                            </div>
                            <h2 className="font-clash text-2xl font-semibold text-primary">Frequently Asked Questions</h2>
                        </div>
                        <p className="text-muted-foreground mb-4">
                            Many common questions are already answered on our FAQ page. Check it out to see if your question is there!
                        </p>
                        <Button variant="outline" className="w-full" disabled>
                            (Coming Soon)
                        </Button>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default ContactUs;
