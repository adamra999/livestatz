import { Video, Youtube, Music2, Tv, MonitorPlay } from "lucide-react";

export const PlatformBanner = () => {
  const platforms = [
    { name: "Instagram", icon: <Video className="w-6 h-6" /> },
    { name: "YouTube", icon: <Youtube className="w-6 h-6" /> },
    { name: "TikTok", icon: <Music2 className="w-6 h-6" /> },
    { name: "Twitch", icon: <Tv className="w-6 h-6" /> },
    { name: "Zoom", icon: <MonitorPlay className="w-6 h-6" /> },
  ];

  return (
    <section className="py-8 px-6 border-b border-border bg-background/50 backdrop-blur-sm">
      <div className="container mx-auto">
        <p className="text-center text-sm text-muted-foreground mb-6">
          Works seamlessly with your favorite platforms
        </p>
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
          {platforms.map((platform, index) => (
            <div
              key={index}
              className="flex flex-col items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <div className="p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                {platform.icon}
              </div>
              <span className="text-xs font-medium">{platform.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
