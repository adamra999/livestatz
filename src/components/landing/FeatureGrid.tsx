import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Users, BarChart3, DollarSign, Zap, Bot, Shield, Globe } from "lucide-react";

export const FeatureGrid = () => {
  const features = [
    {
      icon: Calendar,
      title: "Social Event Calendar",
      description: "One calendar for meetups, drops, collabs, and livestreams with smart RSVP links",
      color: "primary"
    },
    {
      icon: Users,
      title: "RSVP Management", 
      description: "Create events, track RSVPs, and send automated reminders",
      color: "primary"
    },
    {
      icon: BarChart3,
      title: "Live Analytics",
      description: "Real-time performance tracking and post-event insights",
      color: "secondary"
    },
    {
      icon: DollarSign,
      title: "Monetization",
      description: "Tiered access, VIP events, and monetization tools for your community",
      color: "accent"
    },
    {
      icon: Bot,
      title: "AI Recommendations",
      description: "Track RSVPs, attendance, and engagement across all your events",
      color: "primary"
    },
    {
      icon: Globe,
      title: "Social Integration",
      description: "Connect TikTok, Instagram, YouTube, and Twitter accounts",
      color: "primary"
    },
    {
      icon: Zap,
      title: "Automation",
      description: "Automated RSVP reminders and cross-platform event sharing tools",
      color: "secondary"
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Bank-level security with analytics and admin controls",
      color: "accent"
    }
  ];

  return (
    <section className="py-24 px-6">
      <div className="container mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">Simple, but powerful</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div key={index} className="text-center">
                <div className="mb-6">
                  <div className="mx-auto w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <IconComponent className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-3 text-foreground">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};