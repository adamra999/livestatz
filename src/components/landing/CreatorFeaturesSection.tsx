import { 
  MousePointerClick, 
  CalendarPlus, 
  MessageSquare, 
  Layers, 
  Lightbulb, 
  Download, 
  Palette, 
  MapPin 
} from "lucide-react";

export const CreatorFeaturesSection = () => {
  const features = [
    {
      icon: <MousePointerClick className="w-5 h-5" />,
      text: "One-tap RSVP from Link-in-bio",
    },
    {
      icon: <CalendarPlus className="w-5 h-5" />,
      text: "Automatic calendar invites",
    },
    {
      icon: <MessageSquare className="w-5 h-5" />,
      text: "SMS & email reminders (optional)",
    },
    {
      icon: <Layers className="w-5 h-5" />,
      text: "Multi-platform event support",
    },
    {
      icon: <Lightbulb className="w-5 h-5" />,
      text: "Audience intent insights",
    },
    {
      icon: <Download className="w-5 h-5" />,
      text: "Exportable fan database",
    },
    {
      icon: <Palette className="w-5 h-5" />,
      text: "Customizable event pages",
    },
    {
      icon: <MapPin className="w-5 h-5" />,
      text: "Works for online or in-person events",
    },
  ];

  return (
    <section className="py-24 px-6">
      <div className="container mx-auto max-w-5xl">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-foreground">
          Designed for Creators Who Host Events
        </h2>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex items-start gap-4 p-5 rounded-lg bg-card border border-border hover:border-primary/30 transition-colors"
            >
              <div className="flex-shrink-0 mt-1 text-primary">
                {feature.icon}
              </div>
              <p className="text-foreground font-medium leading-relaxed">
                {feature.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
