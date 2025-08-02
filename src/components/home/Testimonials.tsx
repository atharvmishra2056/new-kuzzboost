import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';

const testimonials = [
  {
    name: 'Alex Johnson',
    role: 'Influencer',
    image: '/images/avatars/01.jpg',
    content: 'KuzzBoost helped me grow my Instagram following by 10k in just one month! The engagement is real and the support team is amazing.',
    rating: 5
  },
  {
    name: 'Sarah Williams',
    role: 'Small Business Owner',
    image: '/images/avatars/02.jpg',
    content: 'As a small business, getting visibility was tough. Thanks to KuzzBoost, our social media presence has skyrocketed!',
    rating: 5
  },
  {
    name: 'Michael Chen',
    role: 'Content Creator',
    image: '/images/avatars/03.jpg',
    content: 'I was skeptical at first, but the results speak for themselves. My TikTok following grew faster than I ever imagined!',
    rating: 4
  },
  {
    name: 'Emily Rodriguez',
    role: 'Marketing Manager',
    image: '/images/avatars/04.jpg',
    content: 'We use KuzzBoost for all our clients. The service is reliable, and the growth is consistent. Highly recommended!',
    rating: 5
  },
  {
    name: 'David Kim',
    role: 'Musician',
    image: '/images/avatars/05.jpg',
    content: 'Getting my music out there was challenging until I found KuzzBoost. My streams and followers have never been better!',
    rating: 5
  }
];

const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex gap-1">
    {[...Array(5)].map((_, i) => (
      <Star 
        key={i} 
        className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground/30'}`} 
      />
    ))}
  </div>
);

export default function Testimonials() {
  return (
    <section className="py-20 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Testimonials
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Clients Say</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Don't just take our word for it. Here's what our customers have to say about their experience.
          </p>
        </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
        {testimonials.map((testimonial, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="h-full bg-background/80 backdrop-blur-sm border-border/50 hover:border-primary/30 transition-all hover:shadow-lg">
              <CardContent className="p-6">
                <div className="relative">
                  <Quote className="absolute -top-2 -left-2 text-primary/10 w-12 h-12" />
                  <p className="relative z-10 text-muted-foreground italic mb-6">"{testimonial.content}"</p>
                </div>
                
                <div className="flex items-center gap-4 pt-4 border-t border-border/50">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={testimonial.image} alt={testimonial.name} />
                    <AvatarFallback className="bg-primary/10 text-primary font-medium">
                      {testimonial.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                    <StarRating rating={testimonial.rating} />
                  </div>
                </div>
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
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <div className="inline-flex flex-col items-center gap-4">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
            ))}
          </div>
          <p className="text-lg font-medium">Rated 4.9/5 from 1,000+ reviews</p>
          <p className="text-sm text-muted-foreground">Trusted by influencers, businesses, and creators worldwide</p>
        </div>
      </motion.div>
    </div>

    {/* Decorative elements */}
    <div className="absolute top-1/4 -right-40 w-96 h-96 rounded-full bg-primary/5 blur-3xl -z-0" />
    <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-background to-transparent -z-10" />
  </section>
  );
}
