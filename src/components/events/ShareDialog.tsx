import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Twitter, Facebook, Linkedin, Instagram, MessageSquare, Twitch } from "lucide-react";

interface ShareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  event: {
    title: string;
    url: string;
    dateTime: string;
  };
}

export function ShareDialog({ open, onOpenChange, event }: ShareDialogProps) {
  const { toast } = useToast();

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Event link copied to clipboard",
    });
  };

  const shareToSocial = (platform: string) => {
    const eventDate = new Date(event.dateTime).toLocaleDateString();
    const eventTime = new Date(event.dateTime).toLocaleTimeString();
    const message = `Join me for "${event.title}" on ${eventDate} at ${eventTime}! ${event.url}`;

    const urls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        message
      )}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        event.url
      )}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
        event.url
      )}`,
      discord: event.url,
      instagram: event.url,
      twitch: event.url,
    };

    if (["discord", "instagram", "twitch"].includes(platform)) {
      copyToClipboard(message);
    } else {
      window.open(urls[platform as keyof typeof urls], "_blank");
    }
  };

  const socialPlatforms = [
    { name: "Twitter", key: "twitter", icon: Twitter, color: "text-[#1DA1F2]" },
    { name: "Facebook", key: "facebook", icon: Facebook, color: "text-[#4267B2]" },
    { name: "LinkedIn", key: "linkedin", icon: Linkedin, color: "text-[#0077B5]" },
    { name: "Instagram", key: "instagram", icon: Instagram, color: "text-[#E4405F]" },
    { name: "Discord", key: "discord", icon: MessageSquare, color: "text-[#5865F2]" },
    { name: "Twitch", key: "twitch", icon: Twitch, color: "text-[#9146FF]" },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share on Social Media</DialogTitle>
          <DialogDescription>
            Share your event with your audience across different platforms
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-3 py-4">
          {socialPlatforms.map((platform) => {
            const Icon = platform.icon;
            return (
              <Button
                key={platform.key}
                variant="outline"
                onClick={() => shareToSocial(platform.key)}
                className="justify-start h-auto py-3"
              >
                <Icon className={`h-5 w-5 mr-2 ${platform.color}`} />
                {platform.name}
              </Button>
            );
          })}
        </div>
        <p className="text-xs text-muted-foreground text-center">
          Instagram, Discord & Twitch will copy the message to your clipboard
        </p>
      </DialogContent>
    </Dialog>
  );
}
