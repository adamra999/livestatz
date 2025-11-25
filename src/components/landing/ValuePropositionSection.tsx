import { UserPlus, TrendingUp, Lightbulb } from "lucide-react";

export const ValuePropositionSection = () => {
  const valueBlocks = [
    {
      icon: <UserPlus className="w-8 h-8" />,
      title: "Get More RSVPs",
      description:
        "Create a clean event page and let fans RSVP in a single tap from your Link-in-bio.",
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Increase Live Attendance",
      description:
        "Fans automatically get calendar invites and reminders so they never miss your next session.",
    },
    {
      icon: <Lightbulb className="w-8 h-8" />,
      title: "Understand Your Audience",
      description:
        "After RSVPing, fans can share what they want from your live—giving you insights to tailor content.",
    },
  ];

  return (
    <section className="py-24 px-6">
      <div className="container mx-auto max-w-6xl">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-foreground">
          One Simple Tool. Three Powerful Results.
        </h2>

        <div className="grid gap-8 md:grid-cols-3">
          {valueBlocks.map((block, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center p-8 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all hover:shadow-lg"
            >
              <div className="mb-6 p-4 rounded-full bg-primary/10 text-primary">
                {block.icon}
              </div>
              <h3 className="text-xl font-bold mb-4 text-foreground">
                {block.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {block.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
