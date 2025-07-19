import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const PrivacyPolicy = () => {
    return (
        <div className="min-h-screen bg-gradient-hero">
            <Navigation />
            <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto glass rounded-2xl p-8">
                    <h1 className="font-clash text-4xl font-bold text-primary mb-6">Privacy Policy</h1>
                    <div className="prose prose-invert max-w-none text-muted-foreground space-y-4">
                        <p>Last updated: July 19, 2025</p>
                        <p>
                            Your privacy is important to us. This Privacy Policy explains how KuzzBoost collects, uses, and protects your personal information.
                        </p>
                        <h2 className="text-primary font-semibold">1. Information We Collect</h2>
                        <p>
                            We collect information you provide to us directly, such as your name, email address, and payment information when you place an order. We also collect information automatically, such as your IP address and browsing behavior on our site.
                        </p>
                        <h2 className="text-primary font-semibold">2. How We Use Your Information</h2>
                        <p>
                            We use your information to process your orders, communicate with you about your account, improve our services, and for marketing purposes, if you have opted in.
                        </p>
                        <h2 className="text-primary font-semibold">3. Information Sharing</h2>
                        <p>
                            We do not sell or rent your personal information to third parties. We may share your information with trusted service providers who assist us in operating our website and conducting our business, such as payment processors.
                        </p>
                        <h2 className="text-primary font-semibold">4. Data Security</h2>
                        <p>
                            We implement a variety of security measures to maintain the safety of your personal information. All payment transactions are encrypted using SSL technology.
                        </p>
                        <h2 className="text-primary font-semibold">5. Your Rights</h2>
                        <p>
                            You have the right to access, update, or delete your personal information at any time by accessing your account settings or contacting us directly.
                        </p>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default PrivacyPolicy;
