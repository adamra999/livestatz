import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { useEvents } from "@/hooks/useEvents";

interface CreateEventPageProps {
  onClose?: () => void;
  embedded?: boolean;
  onSuccess?: (event: any) => void;
}

export default function CreateEventPage({ onClose, embedded = false, onSuccess }: CreateEventPageProps) {
  const navigate = useNavigate();
  const { createEvent } = useEvents();
  const [isCreating, setIsCreating] = useState(false);
  const [urlError, setUrlError] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    platform: "Instagram Live",
    dateTime: "",
    description: "",
    eventUrl: "",
    targetAudience: 50,
    isPaid: false,
    price: "",
    attendeeBenefits: [] as string[],
    includeReplay: false,
    includePerks: false,
    perkDescription: "",
    offerWithSubscription: false,
  });

  const validateUrl = (url: string): boolean => {
    if (!url) {
      setUrlError("Event URL is required");
      return false;
    }

    try {
      const urlObj = new URL(url);
      if (!urlObj.protocol.match(/^https?:$/)) {
        setUrlError("URL must start with http:// or https://");
        return false;
      }
      setUrlError("");
      return true;
    } catch {
      setUrlError("Please enter a valid URL (e.g., https://example.com/event)");
      return false;
    }
  };

  const handleCreateEvent = async () => {
    if (!formData.title || !formData.dateTime || !formData.eventUrl) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    if (!validateUrl(formData.eventUrl)) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid event URL",
        variant: "destructive",
      });
      return;
    }

    setIsCreating(true);
    try {
      const response = await createEvent({ ...formData });
      toast({
        title: "Event Created!",
        description:
          "Your live event has been successfully created. Redirecting to RSVP page...",
      });
      
      if (embedded && onSuccess) {
        // When embedded in dialog, notify parent and close
        onSuccess(response);
        onClose?.();
      } else {
        // When standalone page, navigate
        navigate(`/events/success/${response?.id}`);
      }
    } catch (error) {
      toast({
        title: "Error creating event",
        description: (error as Error).message,
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleCancel = () => {
    if (onClose) {
      onClose();
    } else {
      navigate(-1);
    }
  };

  return (
    <div className={`${embedded ? '' : 'min-h-screen'} bg-background text-foreground flex flex-col`}>
      {/* Header */}
      <header className={`p-4 border-b bg-card ${embedded ? '' : 'sticky top-0 z-10'}`}>
        <h1 className="text-xl font-semibold text-center">Create Live Event</h1>
      </header>

      {/* Form */}
      <main className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Basic Info */}
        <section className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Event Title *
            </label>
            <input
              type="text"
              className="w-full p-3 border rounded-lg bg-background"
              placeholder="e.g., Morning Workout Session"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Platform</label>
            <select
              className="w-full p-3 border rounded-lg bg-background"
              value={formData.platform}
              onChange={(e) =>
                setFormData({ ...formData, platform: e.target.value })
              }
            >
              <option>Instagram Live</option>
              <option>TikTok Live</option>
              <option>YouTube Live</option>
              <option>Twitter Spaces</option>
              <option>Twitch</option>
              <option>Discord</option>
              <option>Facebook Live</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Date & Time *
            </label>
            <input
              type="datetime-local"
              className="w-full p-3 border rounded-lg bg-background"
              value={formData.dateTime}
              onChange={(e) =>
                setFormData({ ...formData, dateTime: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Event URL *
            </label>
            <input
              type="url"
              className={`w-full p-3 border rounded-lg bg-background ${
                urlError ? "border-destructive focus:ring-destructive" : ""
              }`}
              placeholder="https://example.com/your-event"
              value={formData.eventUrl}
              onChange={(e) => {
                const value = e.target.value;
                setFormData({ ...formData, eventUrl: value });
                validateUrl(value);
              }}
              onBlur={(e) => validateUrl(e.target.value)}
            />
            {urlError && (
              <p className="text-sm text-destructive mt-1">{urlError}</p>
            )}
            {!urlError && formData.eventUrl && (
              <p className="text-sm text-muted-foreground mt-1">✓ Valid URL</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Event Description
            </label>
            <textarea
              className="w-full p-3 border rounded-lg bg-background h-28 resize-none"
              placeholder="What will you be sharing with your audience?"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Target Audience
            </label>
            <input
              type="number"
              className="w-full p-3 border rounded-lg bg-background"
              placeholder="50"
              value={formData.targetAudience}
              onChange={(e) =>
                setFormData({ ...formData, targetAudience: parseInt(e.target.value) || 50 })
              }
            />
          </div>
        </section>

        {/* Payment Section */}
        <section className="border-t pt-6 space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Event Type</label>
            <div className="flex items-center space-x-4">
              <span
                className={`text-sm ${
                  !formData.isPaid ? "text-green-600" : "text-muted-foreground"
                }`}
              >
                Free
              </span>
              <button
                onClick={() =>
                  setFormData({
                    ...formData,
                    isPaid: !formData.isPaid,
                    price: "",
                    attendeeBenefits: [],
                  })
                }
                className={`h-8 w-16 rounded-full relative transition-all ${
                  formData.isPaid ? "bg-yellow-400" : "bg-gray-300"
                }`}
              >
                <span
                  className={`absolute top-1 left-1 h-6 w-6 bg-white rounded-full transition-transform ${
                    formData.isPaid ? "translate-x-8" : "translate-x-0"
                  }`}
                />
              </button>
              <span
                className={`text-sm ${
                  formData.isPaid ? "text-yellow-600" : "text-muted-foreground"
                }`}
              >
                Paid
              </span>
            </div>
          </div>

          {formData.isPaid && (
            <div className="space-y-4 bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
              <div>
                <label className="block text-sm font-medium mb-1">
                  💵 Ticket Price (USD)
                </label>
                <input
                  type="number"
                  className="w-full p-3 border rounded-lg bg-white"
                  placeholder="29.99"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  🎯 Attendee Benefits
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    "Live Q&A",
                    "Exclusive content",
                    "Behind-the-scenes",
                    "VIP access",
                  ].map((benefit) => (
                    <label
                      key={benefit}
                      className="flex items-center space-x-2"
                    >
                      <input
                        type="checkbox"
                        checked={formData.attendeeBenefits.includes(benefit)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData({
                              ...formData,
                              attendeeBenefits: [
                                ...formData.attendeeBenefits,
                                benefit,
                              ],
                            });
                          } else {
                            setFormData({
                              ...formData,
                              attendeeBenefits:
                                formData.attendeeBenefits.filter(
                                  (b) => b !== benefit
                                ),
                            });
                          }
                        }}
                      />
                      <span className="text-sm">{benefit}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Submit */}
        <div className="flex flex-col sm:flex-row-reverse gap-3 pt-4">
          <Button
            onClick={handleCreateEvent}
            className="flex-1 py-3"
            disabled={isCreating}
          >
            {isCreating ? "Creating..." : "Create Event"}
          </Button>
          <Button
            onClick={handleCancel}
            variant="outline"
            className="flex-1 py-3"
            disabled={isCreating}
          >
            Cancel
          </Button>
        </div>
      </main>
    </div>
  );
}
