import { useState } from "react";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import ParticleField from "../components/ParticleField";
import { Code, Lightbulb, Users, Target, Star, Award } from "lucide-react";
import { useHref } from "react-router-dom";

const About = () => {
  const [hoveredFounder, setHoveredFounder] = useState<string | null>(null);

  const teamMembers = [
    {
      name: "Daksh",
      role: "Founder & CEO",
      bio: "Visionary entrepreneur with 5+ years in social media marketing. Daksh founded KuzzBoost with the mission to democratize social media growth for creators and businesses worldwide.",
      avatar: "daksh.png",
      specialties: ["Strategy", "Leadership", "Innovation"],
      achievements: ["10K+ Clients Served", "99% Success Rate", "Industry Pioneer"]
    },
    {
      name: "Atharv",
      role: "Co-Founder & Lead Developer",
      bio: "Full-stack developer and tech enthusiast who brings cutting-edge technology to social media growth. Atharv ensures our platform delivers the most advanced and secure growth solutions.",
      avatar: "atharv.webp",
      specialties: ["Development", "Security", "Automation"],
      achievements: ["Platform Architecture", "Security Systems", "AI Integration"]
    },
    {
      name: "Asad Saifi",
      role: "Head Manager - Marketing",
      bio: "A strategic marketing leader with a passion for building brands and driving growth. Asad leads our marketing efforts with creativity and data-driven insights.",
      avatar: "Saifi.webp",
      specialties: ["Brand Strategy", "Digital Marketing", "Team Leadership"],
      achievements: ["Led 5+ Major Campaigns", "200% ROI Increase", "Built High-Performing Team"]
    },
    {
      name: "Kavy Chauhan",
      role: "Marketing",
      bio: "A creative marketeer who excels at crafting compelling campaigns that resonate with audiences and drive engagement.",
      avatar: "kavy.webp",
      specialties: ["Content Creation", "Social Media", "Campaign Management"],
      achievements: ["Viral Campaign Creator", "Grew Socials by 50K", "Top Ad Converter"]
    },
    {
      name: "Ranbir Khurana",
      role: "Marketing",
      bio: "Analytical and results-oriented marketer specializing in performance marketing and customer acquisition.",
      avatar: "ranbir.webp",
      specialties: ["PPC Advertising", "SEO", "Data Analysis"],
      achievements: ["Managed $1M+ Ad Spend", "Top 1% SEO Ranker", "Data-Driven Strategist"]
    },
    {
      name: "Krish Kumar",
      role: "Investor",
      bio: "An experienced investor with a keen eye for disruptive technologies. Krish provides strategic guidance and support to fuel our growth.",
      avatar: "krish.webp",
      specialties: ["Venture Capital", "Financial Strategy", "Market Analysis"],
      achievements: ["Seed Round Leader", "Strategic Advisor", "Fintech Expert"]
    },
    {
      name: "Atharv Upadhyay",
      role: "Marketing",
      bio: "A dynamic marketer with expertise in community building and influencer partnerships. Atharv connects KuzzBoost with key voices in the industry.",
      avatar: "https://placehold.co/128x128/E9D5FF/4C1D95?text=🤝&font=sans",
      specialties: ["Community Management", "Influencer Outreach", "Partnerships"],
      achievements: ["Built 100K+ Community", "Secured 50+ Partnerships", "Brand Ambassador Program Lead"]
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
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="font-clash text-5xl md:text-7xl font-bold text-primary mb-6">
            Meet the KuzzBoost Team
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <div
                key={member.name}
                className="stagger-item relative group"
                style={{ animationDelay: `${index * 0.2}s` }}
                onMouseEnter={() => setHoveredFounder(member.name)}
                onMouseLeave={() => setHoveredFounder(null)}
              >
                <div className="glass rounded-3xl p-8 md:p-12 h-full relative overflow-hidden">
                  {/* Background particles effect */}
                  {hoveredFounder === member.name && (
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
                    <div className="w-32 h-32 mb-6 mx-auto transform group-hover:scale-110 transition-transform duration-500 rounded-full overflow-hidden border-4 border-primary/20 bg-primary/5">
                      <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" />
                    </div>

                    {/* Name & Role */}
                    <h3 className="font-clash text-2xl font-bold text-primary mb-1">
                      {member.name}
                    </h3>
                    <div className="text-accent-peach font-semibold mb-4">
                      {member.role}
                    </div>

                    {/* Bio */}
                    <p className="text-muted-foreground mb-6 leading-relaxed text-sm">
                      {member.bio}
                    </p>

                    {/* Specialties */}
                    <div className="mb-6">
                      <h4 className="font-semibold text-primary mb-3 flex items-center gap-2">
                        <Star className="w-4 h-4" />
                        Specialties
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {member.specialties.map((specialty) => (
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
                      <h4 className="font-semibold text-primary mb-3 flex items-center gap-2">
                        <Award className="w-4 h-4" />
                        Key Achievements
                      </h4>
                      <div className="space-y-2">
                        {member.achievements.map((achievement) => (
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
          <div className="text-center mb-12">
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
                <div className="text-accent-peach mb-3 mx-auto w-fit">
                  {value.icon}
                </div>
                <h3 className="font-clash text-xl font-semibold text-primary mb-2">
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

    </div>
  );
};

export default About;