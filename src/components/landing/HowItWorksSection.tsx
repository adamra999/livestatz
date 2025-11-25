import { Calendar, Share2, UserCheck, Bell, BarChart3 } from "lucide-react";

export const HowItWorksSection = () => {
  const steps = [
    {
      number: 1,
      icon: <Calendar className="w-6 h-6" />,
      title: "Create your event",
      description:
        "Add your title, date, and platform (Instagram, YouTube, TikTok, Zoom, etc.)",
    },
    {
      number: 2,
      icon: <Share2 className="w-6 h-6" />,
      title: "Share your event link",
      description:
        "Drop it in your link-in-bio, WhatsApp groups, Discord, or email list.",
    },
    {
      number: 3,
      icon: <UserCheck className="w-6 h-6" />,
      title: "Fans RSVP in one tap",
      description:
        "They enter name/email or use Google SSO, then instantly get a calendar invite.",
    },
    {
      number: 4,
      icon: <Bell className="w-6 h-6" />,
      title: "Fans get reminders",
      description:
        "24 hours and 1 hour before the event—100% automated.",
    },
    {
      number: 5,
      icon: <BarChart3 className="w-6 h-6" />,
      title: "Get audience insights",
      description:
        "See what your fans want to learn, their experience level, and top requested topics.",
    },
  ];

  return (
    <section className="py-24 px-6 bg-muted/30">
      <div className="container mx-auto max-w-5xl">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-foreground">
          How Livestatz Works
        </h2>

        <div className="space-y-8">
          {steps.map((step, index) => (
            <div
              key={index}
              className="flex gap-6 items-start p-6 rounded-xl bg-background border border-border hover:border-primary/30 transition-all hover:shadow-md"
            >
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
                {step.number}
              </div>
              <div className="flex-shrink-0 mt-3 text-primary">
                {step.icon}
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-2 text-foreground">
                  {step.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
