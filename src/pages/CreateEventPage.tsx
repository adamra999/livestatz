import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { useEvents } from "@/hooks/useEvents";

export default function CreateEventPage() {
  const navigate = useNavigate();
  const { createEvent } = useEvents();
  const [isCreating, setIsCreating] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    platform: "Instagram Live",
    dateTime: "",
    description: "",
    isPaid: false,
    price: "",
    attendeeBenefits: [] as string[],
    includeReplay: false,
    includePerks: false,
    perkDescription: "",
    offerWithSubscription: false,
  });

  const handleCreateEvent = async () => {
    if (!formData.title || !formData.dateTime) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
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
      navigate(`/events/success/${response?.id}`);
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

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Header */}
      <header className="p-4 border-b bg-card sticky top-0 z-10">
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
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <Button
            onClick={() => navigate(-1)}
            variant="outline"
            className="flex-1 py-3"
            disabled={isCreating}
          >
            Cancel
          </Button>
          <Button
            onClick={handleCreateEvent}
            className="flex-1 py-3"
            disabled={isCreating}
          >
            {isCreating ? "Creating..." : "Create Event"}
          </Button>
        </div>
      </main>
    </div>
  );
}
