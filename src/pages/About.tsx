import { useState } from "react";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import ParticleField from "../components/ParticleField";
import { Code, Lightbulb, Users, Target, Star, Award } from "lucide-react";

const About = () => {
  const [hoveredFounder, setHoveredFounder] = useState<string | null>(null);

  const founders = [
    {
      name: "Daksh",
      role: "Founder & CEO",
      bio: "Visionary entrepreneur with 5+ years in social media marketing. Daksh founded KuzzBoost with the mission to democratize social media growth for creators and businesses worldwide.",
      avatar: "👨‍💼",
      specialties: ["Strategy", "Leadership", "Innovation"],
      achievements: ["10K+ Clients Served", "99% Success Rate", "Industry Pioneer"]
    },
    {
      name: "Atharv",
      role: "Co-Founder & Lead Developer",
      bio: "Full-stack developer and tech enthusiast who brings cutting-edge technology to social media growth. Atharv ensures our platform delivers the most advanced and secure growth solutions.",
      avatar: "👨‍💻",
      specialties: ["Development", "Security", "Automation"],
      achievements: ["Platform Architecture", "Security Systems", "AI Integration"]
    }
  ];

  const values = [
    {
      icon: <Target className="w-8 h-8" />,
      title: "Authenticity First",
      description: "We deliver real, engaged followers and genuine interactions that drive meaningful growth."
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Customer Success",
      description: "Your success is our success. We're committed to helping you achieve your social media goals."
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: "Quality Guarantee",
      description: "Premium services backed by our 30-day money-back guarantee and 24/7 support."
    },
    {
      icon: <Lightbulb className="w-8 h-8" />,
      title: "Innovation",
      description: "Constantly evolving our methods to stay ahead of platform changes and trends."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-hero relative overflow-hidden">
      <ParticleField />
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="font-clash text-5xl md:text-7xl font-bold text-primary mb-6">
            The Visionaries Behind KuzzBoost
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Meet the innovative minds who are revolutionizing social media growth 
            with authentic, secure, and cutting-edge solutions.
          </p>
        </div>
      </section>

      {/* Founders Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {founders.map((founder, index) => (
              <div
                key={founder.name}
                className="stagger-item relative group"
                style={{ animationDelay: `${index * 0.3}s` }}
                onMouseEnter={() => setHoveredFounder(founder.name)}
                onMouseLeave={() => setHoveredFounder(null)}
              >
                <div className="glass rounded-3xl p-8 md:p-12 h-full relative overflow-hidden">
                  {/* Background particles effect */}
                  {hoveredFounder === founder.name && (
                    <div className="absolute inset-0 pointer-events-none">
                      {[...Array(12)].map((_, i) => (
                        <div
                          key={i}
                          className="absolute w-2 h-2 bg-accent-peach/30 rounded-full animate-pulse"
                          style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${i * 0.2}s`,
                            animationDuration: '2s'
                          }}
                        />
                      ))}
                    </div>
                  )}

                  <div className="relative z-10">
                    {/* Avatar */}
                    <div className="text-8xl mb-6 transform group-hover:scale-110 transition-transform duration-500">
                      {founder.avatar}
                    </div>

                    {/* Name & Role */}
                    <h3 className="font-clash text-3xl font-bold text-primary mb-2">
                      {founder.name}
                    </h3>
                    <div className="text-accent-peach font-semibold mb-6">
                      {founder.role}
                    </div>

                    {/* Bio */}
                    <p className="text-muted-foreground mb-8 leading-relaxed">
                      {founder.bio}
                    </p>

                    {/* Specialties */}
                    <div className="mb-8">
                      <h4 className="font-semibold text-primary mb-4 flex items-center gap-2">
                        <Star className="w-4 h-4" />
                        Specialties
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {founder.specialties.map((specialty) => (
                          <span
                            key={specialty}
                            className="glass rounded-full px-3 py-1 text-sm font-medium text-primary border border-primary/20"
                          >
                            {specialty}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Achievements */}
                    <div>
                      <h4 className="font-semibold text-primary mb-4 flex items-center gap-2">
                        <Award className="w-4 h-4" />
                        Key Achievements
                      </h4>
                      <div className="space-y-2">
                        {founder.achievements.map((achievement) => (
                          <div key={achievement} className="flex items-center gap-2 text-sm text-muted-foreground">
                            <div className="w-1.5 h-1.5 rounded-full bg-accent-lavender" />
                            {achievement}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-clash text-4xl md:text-5xl font-bold text-primary mb-6">
              Our Core Values
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              The principles that guide everything we do and drive us to deliver 
              exceptional social media growth services.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <div
                key={value.title}
                className="stagger-item service-card text-center"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="text-accent-peach mb-4 mx-auto w-fit">
                  {value.icon}
                </div>
                <h3 className="font-clash text-xl font-semibold text-primary mb-4">
                  {value.title}
                </h3>
                <p className="text-muted-foreground">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Company Stats */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="glass rounded-3xl p-12 text-center">
            <h2 className="font-clash text-3xl font-bold text-primary mb-12">
              KuzzBoost by the Numbers
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div>
                <div className="text-4xl font-bold text-primary font-clash mb-2">10K+</div>
                <div className="text-muted-foreground">Happy Clients</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary font-clash mb-2">99%</div>
                <div className="text-muted-foreground">Success Rate</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary font-clash mb-2">24/7</div>
                <div className="text-muted-foreground">Support</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary font-clash mb-2">8</div>
                <div className="text-muted-foreground">Platforms</div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default About;