import { useState, useEffect } from "react";
import {
  Link,
  useNavigate,
  useSearchParams,
  useParams,
} from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, Check, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useEvents } from "@/hooks/useEvents";

function EventSuccessPage() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { fetchEventById } = useEvents();
  const [createdEvent, setCreatedEvent] = useState<any>(null);
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (eventId) fetchEventById(eventId).then(setCreatedEvent);
  }, [eventId, fetchEventById]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({
      title: "Copied!",
      description: "Event link copied to clipboard",
    });
  };

  const shareToSocial = (platform: string) => {
    const eventDate = new Date(createdEvent?.dateTime).toLocaleDateString();
    const eventTime = new Date(createdEvent?.dateTime).toLocaleTimeString();
    const message = `Join me for "${createdEvent?.title}" on ${eventDate} at ${eventTime}! ${createdEvent?.url}`;

    const urls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        message
      )}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        createdEvent?.url
      )}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
        createdEvent?.url
      )}`,
      discord: createdEvent?.url,
      instagram: createdEvent?.url,
      x: `https://x.com/intent/tweet?text=${encodeURIComponent(message)}`,
      twitch: createdEvent?.url,
    };

    if (["discord", "instagram", "twitch"].includes(platform)) {
      copyToClipboard(message);
    } else {
      window.open(urls[platform as keyof typeof urls], "_blank");
    }
  };

  if (!createdEvent) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading event details...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background px-4 py-6 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* ✅ Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-foreground">
            Event Created Successfully!
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base">
            Your live event is ready to share with your audience
          </p>
        </div>

        {/* ✅ Event Link */}
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 sm:p-6 mb-6">
          <h3 className="font-semibold mb-3 text-base sm:text-lg">
            Your Event Link
          </h3>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <input
              type="text"
              value={createdEvent?.url}
              readOnly
              className="flex-1 p-3 border rounded-lg bg-background font-mono text-sm"
            />
            <Button
              onClick={() => copyToClipboard(createdEvent?.url)}
              variant="outline"
              className="w-full sm:w-auto"
            >
              {copied ? (
                <Check className="w-4 h-4 text-green-600" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
              <span className="ml-2 sm:ml-0 sm:hidden">Copy</span>
            </Button>
          </div>
        </div>

        {/* ✅ Event Details */}
        <div className="space-y-6 sm:space-y-8 mb-8">
          <div>
            <h3 className="font-semibold mb-3 sm:mb-4 text-base sm:text-lg">
              Event Details
            </h3>
            <div className="space-y-2 text-sm">
              <div>
                <strong>Title:</strong> {createdEvent?.title}
              </div>
              <div>
                <strong>Platform:</strong> {createdEvent?.platform}
              </div>
              <div>
                <strong>Date:</strong>{" "}
                {new Date(createdEvent?.dateTime).toLocaleDateString()}
              </div>
              <div>
                <strong>Time:</strong>{" "}
                {new Date(createdEvent?.dateTime).toLocaleTimeString()}
              </div>

              {createdEvent?.isPaid && (
                <>
                  <div className="flex items-center gap-2">
                    <strong>Price:</strong>
                    <Badge className="bg-yellow-100 text-yellow-800">
                      ${createdEvent?.price}
                    </Badge>
                  </div>
                  {createdEvent?.includeReplay && (
                    <Badge variant="outline">48hr Replay</Badge>
                  )}
                  {createdEvent?.includePerks && (
                    <Badge variant="outline">Downloadable Perks</Badge>
                  )}
                  {createdEvent?.offerWithSubscription && (
                    <Badge variant="outline">Free with Subscription</Badge>
                  )}
                </>
              )}
            </div>
          </div>

          {/* ✅ Share Section */}
          <div>
            <h3 className="font-semibold mb-3 sm:mb-4 text-base sm:text-lg">
              Share on Social Media
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { name: "Twitter", key: "twitter", icon: "🐦" },
                { name: "Facebook", key: "facebook", icon: "📘" },
                { name: "LinkedIn", key: "linkedin", icon: "💼" },
                { name: "Instagram", key: "instagram", icon: "📸" },
                { name: "Discord", key: "discord", icon: "🎮" },
                { name: "Twitch", key: "twitch", icon: "🎯" },
              ].map((platform) => (
                <Button
                  key={platform.key}
                  variant="outline"
                  size="sm"
                  onClick={() => shareToSocial(platform.key)}
                  className="text-xs sm:text-sm"
                >
                  {platform.icon} {platform.name}
                </Button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Instagram, Discord & Twitch will copy the message to your
              clipboard
            </p>
          </div>
        </div>

        {/* ✅ Footer Actions */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
          <Button
            variant="outline"
            onClick={() => navigate("/events")}
            className="w-full sm:w-auto"
          >
            Close
          </Button>
          <Button
            onClick={() => navigate("/events/new")}
            className="w-full sm:w-auto"
          >
            Create Another Event
          </Button>
          <Link to={`/e/${createdEvent?.id}`} className="w-full sm:w-auto">
            <Button variant="outline" className="w-full sm:w-auto">
              <ExternalLink className="w-4 h-4 mr-2" />
              Preview Event Page
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default EventSuccessPage;
