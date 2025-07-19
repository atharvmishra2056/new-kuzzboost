import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const TermsOfService = () => {
    return (
        <div className="min-h-screen bg-gradient-hero">
            <Navigation />
            <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto glass rounded-2xl p-8">
                    <h1 className="font-clash text-4xl font-bold text-primary mb-6">Terms of Service</h1>
                    <div className="prose prose-invert max-w-none text-muted-foreground space-y-4">
                        <p>Last updated: July 19, 2025</p>
                        <p>
                            Welcome to KuzzBoost! These Terms of Service ("Terms") govern your use of our website and the services we offer. By accessing or using our service, you agree to be bound by these Terms.
                        </p>
                        <h2 className="text-primary font-semibold">1. Services</h2>
                        <p>
                            KuzzBoost provides social media marketing services. We strive to deliver high-quality results, but we do not guarantee any specific outcomes, such as a certain number of likes, followers, or engagement, as these are subject to the policies of the respective social media platforms.
                        </p>
                        <h2 className="text-primary font-semibold">2. User Responsibilities</h2>
                        <p>
                            You agree to provide accurate information when placing an order, including the correct username or URL for the target profile or content. Your account or content must be public to receive our services. You agree not to use our services for any illegal or unauthorized purpose.
                        </p>
                        <h2 className="text-primary font-semibold">3. Payments and Refunds</h2>
                        <p>
                            All payments are processed securely. Due to the nature of our digital services, we generally do not offer refunds once an order has been placed and is in progress. Please review our Refund Policy for more details.
                        </p>
                        <h2 className="text-primary font-semibold">4. Limitation of Liability</h2>
                        <p>
                            KuzzBoost will not be liable for any damages or losses arising from your use of our services, including any account suspension or content removal by social media platforms.
                        </p>
                        <h2 className="text-primary font-semibold">5. Changes to Terms</h2>
                        <p>
                            We reserve the right to modify these Terms at any time. We will notify you of any changes by posting the new Terms on this page.
                        </p>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default TermsOfService;
