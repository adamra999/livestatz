import { Video, Youtube, Music2, Tv, MonitorPlay } from "lucide-react";

export const PlatformBanner = () => {
  const platforms = [
    { name: "Instagram", logo: "/platform-logos/instagram.png" },
    { name: "YouTube", logo: "/platform-logos/youtube.png" },
    { name: "TikTok", logo: "/platform-logos/tiktok.png" },
    { name: "Twitch", logo: "/platform-logos/twitch.png" },
    { name: "Zoom", logo: "/platform-logos/zoom.png" },
  ];

  return (
    <section className="py-12 px-6 border-b border-border bg-muted/20">
      <div className="container mx-auto max-w-4xl">
        <p className="text-center text-sm text-muted-foreground mb-8">
          Works seamlessly with your favorite platforms
        </p>
        <div className="flex flex-wrap justify-center items-center gap-12 md:gap-16">
          {platforms.map((platform, index) => (
            <div
              key={index}
              className="flex items-center justify-center grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition-all duration-300"
              title={platform.name}
            >
              <img
                src={platform.logo}
                alt={`${platform.name} logo`}
                className="h-8 w-auto object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
