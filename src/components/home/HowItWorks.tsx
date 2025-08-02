import { motion } from 'framer-motion';
import { CheckCircle, Zap, BarChart2, Users, ShieldCheck } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const steps = [
  {
    icon: <Zap className="w-8 h-8 text-primary" />,
    title: "Select Your Service",
    description: "Choose from our wide range of social media growth services tailored to your needs.",
  },
  {
    icon: <BarChart2 className="w-8 h-8 text-primary" />,
    title: "Customize Your Order",
    description: "Set your preferences and target audience for optimal growth and engagement.",
  },
  {
    icon: <Users className="w-8 h-8 text-primary" />,
    title: "Watch Your Audience Grow",
    description: "See real results as your followers and engagement increase rapidly.",
  },
  {
    icon: <ShieldCheck className="w-8 h-8 text-primary" />,
    title: "Enjoy the Benefits",
    description: "Build your brand and increase your online presence with your new audience.",
  },
];

export default function HowItWorks() {
  return (
    <section className="py-20 bg-muted/40 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Simple & Effective
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Get started in minutes and see real results with our straightforward process
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full bg-background/80 backdrop-blur-sm border-border/50 hover:border-primary/30 transition-colors group">
                <CardHeader>
                  <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    {step.icon}
                  </div>
                  <CardTitle className="text-xl">
                    <span className="text-primary">0{index + 1}.</span> {step.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {step.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div 
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary/5 border border-border/50 text-primary font-medium">
            <CheckCircle className="w-5 h-5" />
            <span>No password required • 24/7 Support • 100% Safe & Secure</span>
          </div>
        </motion.div>
      </div>

      {/* Decorative elements */}
      <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-primary/5 blur-3xl -z-0" />
      <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-primary/5 blur-3xl -z-0" />
    </section>
  );
}
