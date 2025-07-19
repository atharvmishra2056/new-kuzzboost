import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const RefundPolicy = () => {
    return (
        <div className="min-h-screen bg-gradient-hero">
            <Navigation />
            <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto glass rounded-2xl p-8">
                    <h1 className="font-clash text-4xl font-bold text-primary mb-6">Refund Policy</h1>
                    <div className="prose prose-invert max-w-none text-muted-foreground space-y-4">
                        <p>Last updated: July 19, 2025</p>
                        <p>
                            At KuzzBoost, we are committed to providing high-quality services. Our refund policy is designed to be fair and transparent.
                        </p>
                        <h2 className="text-primary font-semibold">1. General Policy</h2>
                        <p>
                            Due to the nature of our digital services, once an order is placed and the delivery process has begun, we are unable to offer a refund. The resources and server costs for fulfilling your order are incurred immediately after purchase.
                        </p>
                        <h2 className="text-primary font-semibold">2. Non-Delivery of Service</h2>
                        <p>
                            In the rare event that we are unable to deliver your order within the estimated timeframe, you will be eligible for a full refund to your original payment method. We will proactively contact you if such an issue arises.
                        </p>
                        <h2 className="text-primary font-semibold">3. Incorrect Information</h2>
                        <p>
                            We are not responsible for non-delivery or issues arising from incorrect information provided by the customer (e.g., wrong username, incorrect URL, or a private profile). Please double-check all information before placing your order, as we cannot provide refunds in these cases.
                        </p>
                        <h2 className="text-primary font-semibold">4. How to Request a Refund</h2>
                        <p>
                            If you believe you are eligible for a refund based on the criteria above, please contact our support team at <a href="mailto:support@kuzzboost.shop" className="text-accent-peach hover:underline">support@kuzzboost.shop</a> with your order ID and a description of the issue.
                        </p>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default RefundPolicy;
