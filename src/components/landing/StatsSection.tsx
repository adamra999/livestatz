import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, Users, Play, DollarSign } from "lucide-react";

export const StatsSection = () => {
  const stats = [
    {
      icon: Users,
      value: "94%",
      label: "RSVP Show Rate",
      description: "Average attendance rate for creator events",
      trend: "+12% this month"
    },
    {
      icon: TrendingUp,
      value: "3.2x",
      label: "Revenue Growth",
      description: "Average creator revenue increase",
      trend: "vs traditional methods"
    },
    {
      icon: Play,
      value: "45min",
      label: "Time Saved Daily",
      description: "On content planning and management",
      trend: "per creator"
    },
    {
      icon: DollarSign,
      value: "$1,247",
      label: "Average Monthly Revenue",
      description: "Per active creator on the platform",
      trend: "+23% growth rate"
    }
  ];

  return (
    <section className="py-20 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">The Numbers Don't Lie</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            See how creators are transforming their business with our platform.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <Card 
                key={index} 
                className="text-center hover:shadow-creator transition-all duration-300 hover:-translate-y-1 bg-gradient-card border-0"
              >
                <CardContent className="pt-8 pb-6">
                  <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                    <IconComponent className="h-8 w-8 text-primary" />
                  </div>
                  
                  <div className="text-4xl font-bold text-primary mb-2">{stat.value}</div>
                  <div className="text-lg font-semibold mb-2">{stat.label}</div>
                  <div className="text-sm text-muted-foreground mb-3">{stat.description}</div>
                  <div className="text-xs font-medium text-secondary bg-secondary/10 px-3 py-1 rounded-full inline-block">
                    {stat.trend}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
        
        {/* Testimonial Section */}
        <div className="mt-20">
          <Card className="bg-gradient-primary p-8 text-white border-0 text-center">
            <div className="max-w-3xl mx-auto">
              <blockquote className="text-2xl font-medium mb-6 italic">
                "CreatorFlow completely transformed how I manage my content and engage with my audience. 
                My RSVP rates went from 20% to 78% in just two months!"
              </blockquote>
              <div className="flex items-center justify-center space-x-4">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <Users className="h-6 w-6" />
                </div>
                <div className="text-left">
                  <div className="font-semibold">Sarah Martinez</div>
                  <div className="text-white/80">Fashion & Lifestyle Creator • 2.3M followers</div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};