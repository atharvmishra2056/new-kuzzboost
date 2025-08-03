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
  MusicalNoteIcon,
  EyeIcon,
} from '@heroicons/react/24/outline';

interface FAQItem {
  question: string;
  answer: string;
  category?: string;
}

interface ServiceFAQProps {
  serviceType: string;
  serviceName: string;
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
    case 'monetization': return <CurrencyDollarIcon {...iconProps} />;
    case 'tracking': return <ChartBarIcon {...iconProps} />;
    case 'authenticity': return <CheckBadgeIcon {...iconProps} />;
    case 'virality': return <RocketLaunchIcon {...iconProps} />;
    case 'strategy': return <MusicalNoteIcon {...iconProps} />;
    case 'impact': return <EyeIcon {...iconProps} />;
    default: return <SparklesIcon {...iconProps} />;
  }
};

const getFAQsByService = (type: string): FAQItem[] => {
  const faqData: Record<string, FAQItem[]> = {
    'instagram-followers': [
      {
        question: "How quickly will I see follower growth?",
        answer: "Growth typically begins within 24-48 hours after campaign launch. Our strategic approach ensures steady, natural-looking growth that maintains authenticity while building momentum through our UK ad network.",
        category: "Delivery"
      },
      {
        question: "What type of accounts will follow me?",
        answer: "Our followers come from real, active accounts sourced through targeted UK advertising campaigns. These are genuine users interested in your content niche, ensuring better engagement rates and authentic growth.",
        category: "Quality"
      },
      {
        question: "Do I need to provide my password?",
        answer: "Absolutely not! We never require your password. Our growth method works entirely through external promotion via ads and organic engagement strategies. Your account security remains completely in your hands.",
        category: "Security"
      },
      {
        question: "What happens if followers drop?",
        answer: "Minor fluctuations are normal with any growth. However, our retention rate is typically 85-95% because we focus on attracting genuinely interested users through targeted advertising rather than fake accounts.",
        category: "Retention"
      },
      {
        question: "Can I target specific demographics?",
        answer: "Yes! Our UK ad campaigns can be customized for age groups, interests, location, and other demographics. This ensures your new followers align with your target audience and content strategy.",
        category: "Targeting"
      },
      {
        question: "Will this affect my engagement rate?",
        answer: "Our method actually improves engagement rates because we attract users who are genuinely interested in your content through strategic ad placement, leading to more meaningful interactions.",
        category: "Engagement"
      }
    ],
    'youtube-views': [
      {
        question: "How are views delivered safely?",
        answer: "Views are delivered through our UK ad network with natural viewing patterns that mimic organic traffic. We use gradual delivery schedules and diverse traffic sources to maintain YouTube's quality standards.",
        category: "Safety"
      },
      {
        question: "Will this affect my monetization?",
        answer: "Our views are from real users through legitimate advertising, so they support rather than harm monetization eligibility. Many creators see improved ad revenue due to increased visibility and engagement.",
        category: "Monetization"
      },
      {
        question: "What's the retention rate?",
        answer: "Our average retention rate is 60-80%, which is excellent for promoted content. High retention comes from targeting users genuinely interested in your content category through precise ad targeting.",
        category: "Quality"
      },
      {
        question: "Can I choose view sources?",
        answer: "Yes, we can focus on specific geographic regions (primarily UK-based) and demographic groups that align with your content and target audience preferences.",
        category: "Targeting"
      },
      {
        question: "How do I track progress?",
        answer: "You can monitor progress directly in your YouTube Analytics. We also provide regular updates on campaign performance and can adjust strategies based on your analytics data.",
        category: "Tracking"
      }
    ],
    'tiktok-engagement': [
      {
        question: "How do you ensure authentic engagement?",
        answer: "We drive engagement through targeted UK ads that reach users genuinely interested in your content type. This creates natural interactions from real accounts rather than artificial engagement.",
        category: "Authenticity"
      },
      {
        question: "What's the delivery timeframe?",
        answer: "Engagement typically begins within 12-24 hours and builds gradually over 3-7 days. This natural progression helps maintain authenticity and aligns with TikTok's algorithm preferences.",
        category: "Delivery"
      },
      {
        question: "Is this service safe for my account?",
        answer: "Yes, our methods are 100% compliant with TikTok's terms of service. We use legitimate promotional techniques to ensure your account's safety and long-term health.",
        category: "Safety"
      },
      {
        question: "Will this help me go viral?",
        answer: "While we can't guarantee virality, our service significantly boosts your video's visibility and engagement metrics, which are key factors in the TikTok algorithm for wider promotion.",
        category: "Virality"
      }
    ],
    'spotify-playlist-followers': [
      {
        question: "How do you get followers for my playlist?",
        answer: "We promote your playlist across our UK-based music communities and ad networks, targeting listeners with a genuine interest in your playlist's genre. This ensures organic growth with engaged followers.",
        category: "Strategy"
      },
      {
        question: "Are these real followers?",
        answer: "Yes, all followers are from real, active Spotify accounts. We strictly avoid bots or fake accounts, focusing on building a genuine audience for your playlist.",
        category: "Quality"
      },
      {
        question: "How long does it take to see results?",
        answer: "You'll start seeing new followers within 24-48 hours. The campaign is paced to look natural and organic, typically completing over several days.",
        category: "Delivery"
      },
      {
        question: "Will this help my tracks get more streams?",
        answer: "A popular playlist with a strong follower base is more likely to be discovered and listened to, which can lead to increased streams for the tracks included in it.",
        category: "Impact"
      }
    ]
  };
  return faqData[type] || [];
};

const ServiceFAQ: React.FC<ServiceFAQProps> = ({ serviceType, serviceName }) => {
  const faqs = getFAQsByService(serviceType);

  if (faqs.length === 0) return null;

  return (
    <section className="py-12 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-8 md:mb-16">
          <div className="inline-block bg-primary-light/20 text-primary font-semibold py-1 px-3 rounded-full text-sm mb-3">
            FAQs
          </div>
          <h2 className="font-clash text-3xl md:text-5xl font-bold text-primary mb-3 md:mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-base md:text-lg text-muted-foreground">
            Stuck on something? We're here to help with all your questions about our {serviceName} service.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 md:gap-x-12 gap-y-6 md:gap-y-10">
          {faqs.map((faq, index) => (
            <div key={index} className="flex items-start space-x-3 md:space-x-4">
              <div className="flex-shrink-0 w-8 h-8 md:w-10 md:h-10 bg-primary-light/20 rounded-full flex items-center justify-center">
                {getIconForCategory(faq.category)}
              </div>
              <div>
                <h3 className="font-semibold text-base md:text-lg text-foreground mb-1 md:mb-2">{faq.question}</h3>
                <p className="text-sm md:text-base text-muted-foreground">{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServiceFAQ;
