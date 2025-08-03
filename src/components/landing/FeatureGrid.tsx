import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Users, BarChart3, DollarSign, Zap, Bot, Shield, Globe } from "lucide-react";

export const FeatureGrid = () => {
  const features = [
    {
      icon: Calendar,
      title: "Content Calendar",
      description: "Plan and schedule your content funnel with drag & drop simplicity",
      color: "creator-purple"
    },
    {
      icon: Users,
      title: "RSVP Management",
      description: "Create events, track RSVPs, and send automated reminders",
      color: "creator-blue"
    },
    {
      icon: BarChart3,
      title: "Live Analytics",
      description: "Real-time performance tracking and post-event insights",
      color: "creator-pink"
    },
    {
      icon: DollarSign,
      title: "Monetization",
      description: "Ticketed events, tip jars, and creator shop integration",
      color: "creator-yellow"
    },
    {
      icon: Bot,
      title: "AI Recommendations",
      description: "Smart insights on best posting times and content strategy",
      color: "creator-purple"
    },
    {
      icon: Globe,
      title: "Social Integration",
      description: "Connect TikTok, Instagram, YouTube, and Twitter accounts",
      color: "creator-blue"
    },
    {
      icon: Zap,
      title: "Automation",
      description: "Automated workflows for content promotion and follow-ups",
      color: "creator-pink"
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Bank-level security with analytics and admin controls",
      color: "creator-yellow"
    }
  ];

  return (
    <section className="py-20 px-4 bg-muted/30">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Everything You Need to Succeed</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            From content planning to monetization, we've got every aspect of your creator journey covered.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <Card 
                key={index} 
                className="group hover:shadow-creator transition-all duration-300 hover:-translate-y-1 bg-gradient-card border-0"
              >
                <CardHeader className="text-center pb-4">
                  <div className={`mx-auto w-16 h-16 rounded-full bg-${feature.color}/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className={`h-8 w-8 text-${feature.color}`} />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};