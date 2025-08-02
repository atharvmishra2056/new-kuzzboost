import { motion } from 'framer-motion';
import { CheckCircle, Zap, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const features = [
  '30-Day Money Back Guarantee',
  '24/7 Customer Support',
  'Secure Payment Processing',
  'No Password Required',
  'Real, High-Quality Results'
];

export default function CallToAction() {
  const navigate = useNavigate();

  return (
    <section className="relative py-20 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="bg-gradient-to-r from-primary to-primary/90 rounded-3xl p-0.5">
          <div className="bg-background rounded-[calc(1.5rem-1px)] p-8 md:p-12 lg:p-16">
            <div className="max-w-4xl mx-auto text-center">
              <motion.div 
                className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                Ready to Grow?
              </motion.div>
              
              <motion.h2 
                className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                Start Growing Your Social Presence Today
              </motion.h2>
              
              <motion.p 
                className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                Join thousands of satisfied customers who have already boosted their social media presence with our premium services.
              </motion.p>
              
              <motion.div 
                className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Button 
                  size="lg" 
                  className="gap-2 group text-lg py-6 px-8"
                  onClick={() => navigate('/signup')}
                >
                  Get Started Now
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
                
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="gap-2 group text-lg py-6 px-8"
                  onClick={() => navigate('/services')}
                >
                  <Zap className="w-5 h-5 text-primary" />
                  View Our Services
                </Button>
              </motion.div>
              
              <motion.div 
                className="flex flex-wrap justify-center gap-4 mt-8"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle className="w-4 h-4 text-primary" />
                    <span>{feature}</span>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-background to-transparent -z-10" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-primary/5 blur-3xl -z-20" />
      <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-primary/5 blur-3xl -z-20" />
    </section>
  );
}
