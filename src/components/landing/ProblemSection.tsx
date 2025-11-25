import { AlertCircle, UserX, BellOff, HelpCircle, Database } from "lucide-react";

export const ProblemSection = () => {
  const problems = [
    {
      icon: <BellOff className="w-5 h-5" />,
      text: "Followers miss your live notifications",
    },
    {
      icon: <UserX className="w-5 h-5" />,
      text: "No simple way to collect RSVPs",
    },
    {
      icon: <AlertCircle className="w-5 h-5" />,
      text: "No reminders = low attendance",
    },
    {
      icon: <HelpCircle className="w-5 h-5" />,
      text: "No idea what fans want from the live",
    },
    {
      icon: <Database className="w-5 h-5" />,
      text: "No email list or fan database to grow long-term",
    },
  ];

  return (
    <section className="py-24 px-6 bg-muted/30">
      <div className="container mx-auto max-w-5xl">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-foreground">
          Why Going Live Isn't Working Today
        </h2>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-12">
          {problems.map((problem, index) => (
            <div
              key={index}
              className="flex items-start gap-3 p-4 rounded-lg bg-background border border-border hover:border-primary/30 transition-colors"
            >
              <div className="text-primary mt-1">{problem.icon}</div>
              <p className="text-foreground font-medium">{problem.text}</p>
            </div>
          ))}
        </div>

        <div className="bg-primary/5 border border-primary/10 rounded-2xl p-8 text-center">
          <p className="text-lg text-foreground leading-relaxed max-w-3xl mx-auto">
            Creators lose <span className="font-bold text-primary">60–80%</span> of
            potential viewers simply because their fans don't know when they're
            going live.{" "}
            <span className="font-bold text-foreground">Livestatz fixes that.</span>
          </p>
        </div>
      </div>
    </section>
  );
};
