import instagramLogo from "@/assets/platform-logos/instagram.png";
import youtubeLogo from "@/assets/platform-logos/youtube.png";
import tiktokLogo from "@/assets/platform-logos/tiktok.svg";
import twitchLogo from "@/assets/platform-logos/twitch.png";
import zoomLogo from "@/assets/platform-logos/zoom.jpg";

export const PlatformBanner = () => {
  const platforms = [
    { name: "Instagram", logo: instagramLogo },
    { name: "YouTube", logo: youtubeLogo },
    { name: "TikTok", logo: tiktokLogo },
    { name: "Twitch", logo: twitchLogo },
    { name: "Zoom", logo: zoomLogo },
  ];

  return (
    <section className="py-12 px-6 border-b border-border bg-muted/20">
      <div className="container mx-auto max-w-5xl">
        <p className="text-center text-sm text-muted-foreground mb-8">
          Works seamlessly with your favorite platforms
        </p>
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
          {platforms.map((platform, index) => (
            <div
              key={index}
              className="flex items-center justify-center grayscale hover:grayscale-0 opacity-70 hover:opacity-100 transition-all duration-300"
              title={platform.name}
            >
              <img
                src={platform.logo}
                alt={`${platform.name} logo`}
                className="h-16 w-24 object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
