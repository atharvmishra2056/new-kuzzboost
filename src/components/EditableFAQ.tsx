import React from 'react';
import {
  TruckIcon,
  SparklesIcon,
  LockClosedIcon,
  ArrowPathIcon,
  UserGroupIcon,
  ChatBubbleLeftRightIcon,
  ShieldCheckIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  CheckBadgeIcon,
  RocketLaunchIcon,
  QuestionMarkCircleIcon, // Generic icon
} from '@heroicons/react/24/outline';

interface FAQItem {
  question: string;
  answer: string;
  category?: string;
}

interface EditableFAQProps {
  className?: string;
}

const getIconForCategory = (category: string = '') => {
  const iconProps = { className: 'w-6 h-6 text-primary' };
  switch (category.toLowerCase()) {
    case 'delivery': return <TruckIcon {...iconProps} />;
    case 'quality': return <SparklesIcon {...iconProps} />;
    case 'security': return <LockClosedIcon {...iconProps} />;
    case 'retention': return <ArrowPathIcon {...iconProps} />;
    case 'targeting': return <UserGroupIcon {...iconProps} />;
    case 'engagement': return <ChatBubbleLeftRightIcon {...iconProps} />;
    case 'safety': return <ShieldCheckIcon {...iconProps} />;
    case 'billing': return <CurrencyDollarIcon {...iconProps} />;
    case 'tracking': return <ChartBarIcon {...iconProps} />;
    case 'authenticity': return <CheckBadgeIcon {...iconProps} />;
    case 'virality': return <RocketLaunchIcon {...iconProps} />;
    case 'general': return <QuestionMarkCircleIcon {...iconProps} />;
    case 'support': return <ChatBubbleLeftRightIcon {...iconProps} />;
    case 'campaign management': return <RocketLaunchIcon {...iconProps} />;
    case 'platforms': return <UserGroupIcon {...iconProps} />;
    default: return <SparklesIcon {...iconProps} />;
  }
};

const faqs: FAQItem[] = [
    {
      question: 'What makes your service different?',
      answer: 'We use a unique combination of strategic UK advertising and ready-to-grow accounts to create authentic, sustainable growth. Unlike services that rely on bots or fake accounts, our method drives real engagement from genuinely interested users.',
      category: 'General',
    },
    {
      question: 'How do you ensure account safety?',
      answer: 'Account security is our top priority. We never require passwords and work entirely through external promotion. Our methods are fully compliant with platform terms of service and use the same advertising strategies as major brands.',
      category: 'Security',
    },
    {
      question: 'What is your refund policy?',
      answer: 'We offer a 30-day satisfaction guarantee. If you\'re not completely satisfied with your results, we\'ll work with you to optimize the campaign or provide a full refund. Your success is our priority.',
      category: 'Billing',
    },
    {
      question: 'How long does delivery take?',
      answer: 'Most services begin showing results within 24-48 hours. Full delivery typically completes within 3-7 days, depending on the service and package size. We prioritize quality and natural growth patterns over speed.',
      category: 'Delivery',
    },
    {
      question: 'Do you offer 24/7 customer support?',
      answer: 'Yes! Our support team is available around the clock to assist with any questions or concerns. You can reach us through live chat, email, or our support portal for immediate assistance.',
      category: 'Support',
    },
    {
      question: 'How do I track my campaign progress?',
      answer: 'You can monitor real-time progress through your personal dashboard, which shows detailed analytics, delivery status, and performance metrics. We also send regular progress updates via email.',
      category: 'Tracking',
    }
];

const EditableFAQ: React.FC<EditableFAQProps> = ({ className }) => {
  return (
    <section className={`py-16 md:py-24 bg-background ${className}`}>
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12 md:mb-16">
          <div className="inline-block bg-primary-light/20 text-primary font-semibold py-1 px-3 rounded-full text-sm mb-4">
            FAQs
          </div>
          <h2 className="font-clash text-4xl md:text-5xl font-bold text-primary mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-muted-foreground">
            Stuck on something? We're here to help with all your questions about our services.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
          {faqs.map((faq, index) => (
            <div key={index} className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-10 h-10 bg-primary-light/20 rounded-full flex items-center justify-center">
                {getIconForCategory(faq.category)}
              </div>
              <div>
                <h3 className="font-semibold text-lg text-foreground mb-2">{faq.question}</h3>
                <p className="text-muted-foreground">{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EditableFAQ;
