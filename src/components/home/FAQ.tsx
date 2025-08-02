import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle, ShieldCheck, Zap, Clock, Users, MessageSquare } from 'lucide-react';

const faqs = [
  {
    question: 'Is it safe to buy followers and likes?',
    answer: 'Yes, our services are completely safe and comply with all platform guidelines. We use organic growth methods that won\'t put your account at risk.',
    icon: <ShieldCheck className="w-5 h-5 text-primary" />
  },
  {
    question: 'How quickly will I see results?',
    answer: 'Most orders start delivering within a few minutes after purchase, but delivery times may vary depending on the service and order size. You\'ll receive a notification once your order is complete.',
    icon: <Zap className="w-5 h-5 text-primary" />
  },
  {
    question: 'Will I lose my followers after some time?',
    answer: 'No, the followers and engagement you receive are permanent. We use high-quality, real accounts to ensure long-term results.',
    icon: <Users className="w-5 h-5 text-primary" />
  },
  {
    question: 'Do you offer refunds?',
    answer: 'We offer a 30-day money-back guarantee if we fail to deliver your order as described. Please contact our support team for assistance with any issues.',
    icon: <HelpCircle className="w-5 h-5 text-primary" />
  },
  {
    question: 'How do I place an order?',
    answer: 'Simply select your desired service, choose your package, complete the checkout process, and we\'ll take care of the rest. No password required!',
    icon: <MessageSquare className="w-5 h-5 text-primary" />
  },
  {
    question: 'Is there a limit to how many followers I can get?',
    answer: 'While there\'s no strict limit, we recommend growing your account gradually to maintain a natural growth pattern. Our support team can help you determine the best strategy.',
    icon: <Clock className="w-5 h-5 text-primary" />
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20 relative overflow-hidden bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            FAQs
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to know about our services. Can't find the answer you're looking for?
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto">
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                className="bg-background rounded-xl overflow-hidden border border-border/50 shadow-sm hover:shadow-md transition-all"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <button
                  className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 focus:outline-none"
                  onClick={() => toggleFAQ(index)}
                  aria-expanded={openIndex === index}
                  aria-controls={`faq-${index}`}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0">
                      {faq.icon}
                    </div>
                    <h3 className="text-lg font-medium">
                      {faq.question}
                    </h3>
                  </div>
                  <motion.span
                    animate={{ rotate: openIndex === index ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-muted-foreground"
                  >
                    <ChevronDown className="w-5 h-5" />
                  </motion.span>
                </button>
                
                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      id={`faq-${index}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 pt-0 text-muted-foreground">
                        <div className="pl-10 border-t border-border/50 pt-5">
                          {faq.answer}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>

          <motion.div 
            className="mt-16 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <div className="bg-background/80 backdrop-blur-sm rounded-2xl p-8 border border-border/50 shadow-lg">
              <h3 className="text-2xl font-bold mb-4">Still have questions?</h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Our support team is available 24/7 to help you with any questions or concerns.
              </p>
              <button className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors">
                <MessageSquare className="w-5 h-5" />
                Contact Support
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute -top-40 -left-40 w-80 h-80 rounded-full bg-primary/5 blur-3xl -z-10" />
      <div className="absolute -bottom-40 -right-40 w-80 h-80 rounded-full bg-primary/5 blur-3xl -z-10" />
    </section>
  );
}
