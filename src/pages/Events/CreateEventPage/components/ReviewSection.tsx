import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Edit2 } from "lucide-react";
import type { EventFormData } from "../types";
import { format } from "date-fns";

interface ReviewSectionProps {
  formData: EventFormData;
  onEditStep: (step: number) => void;
}

export const ReviewSection = ({ formData, onEditStep }: ReviewSectionProps) => {
  const formatDateTime = () => {
    if (!formData.dateTime) return "Not set";
    try {
      return format(new Date(formData.dateTime), "MMM dd, yyyy 'at' h:mm a");
    } catch {
      return formData.dateTime;
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold">Review Your Event</h3>

      {/* Event Details */}
      <Card className="p-4">
        <div className="flex justify-between items-start mb-3">
          <h4 className="font-semibold">Event Details</h4>
          <Button size="sm" variant="ghost" onClick={() => onEditStep(0)}>
            <Edit2 className="h-4 w-4" />
          </Button>
        </div>
        <div className="space-y-2 text-sm">
          <div>
            <span className="text-muted-foreground">Title:</span>{" "}
            <span className="font-medium">{formData.title || "Not set"}</span>
          </div>
          {formData.description && (
            <div>
              <span className="text-muted-foreground">Description:</span>{" "}
              <span className="font-medium">{formData.description}</span>
            </div>
          )}
          <div>
            <span className="text-muted-foreground">Date & Time:</span>{" "}
            <span className="font-medium">{formatDateTime()}</span>
          </div>
          {formData.duration && (
            <div>
              <span className="text-muted-foreground">Duration:</span>{" "}
              <span className="font-medium">{formData.duration}</span>
            </div>
          )}
        </div>
      </Card>

      {/* Platforms */}
      <Card className="p-4">
        <div className="flex justify-between items-start mb-3">
          <h4 className="font-semibold">Platforms</h4>
          <Button size="sm" variant="ghost" onClick={() => onEditStep(1)}>
            <Edit2 className="h-4 w-4" />
          </Button>
        </div>
        <div className="space-y-2">
          {formData.selectedPlatforms.length === 0 ? (
            <p className="text-sm text-muted-foreground">No platforms selected</p>
          ) : (
            formData.selectedPlatforms.map((platform) => (
              <div key={platform.platform} className="text-sm">
                <span className="font-medium capitalize">{platform.platform}:</span>{" "}
                <span className="text-muted-foreground">
                  {platform.platform === "custom"
                    ? "Custom RTMP"
                    : platform.profileUrl || "Not configured"}
                </span>
              </div>
            ))
          )}
        </div>
      </Card>

      {/* RSVP Settings */}
      <Card className="p-4">
        <div className="flex justify-between items-start mb-3">
          <h4 className="font-semibold">RSVP Settings</h4>
          <Button size="sm" variant="ghost" onClick={() => onEditStep(2)}>
            <Edit2 className="h-4 w-4" />
          </Button>
        </div>
        <div className="space-y-2 text-sm">
          <div>
            <span className="text-muted-foreground">Max Attendees:</span>{" "}
            <span className="font-medium">
              {formData.hasMaxAttendees ? formData.maxAttendees : "No limit"}
            </span>
          </div>
          <div>
            <span className="text-muted-foreground">Reminders:</span>{" "}
            <span className="font-medium">
              {[
                formData.reminder24h && "24h",
                formData.reminder1h && "1h",
                formData.reminderLive && "Live alert",
              ]
                .filter(Boolean)
                .join(", ") || "None"}
            </span>
          </div>
          <div>
            <span className="text-muted-foreground">Calendar:</span>{" "}
            <span className="font-medium capitalize">{formData.calendarOption}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Email Required:</span>{" "}
            <span className="font-medium">{formData.requireEmail ? "Yes" : "No"}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Visibility:</span>{" "}
            <span className="font-medium capitalize">{formData.visibility}</span>
          </div>
        </div>
      </Card>

      {/* Monetization */}
      <Card className="p-4">
        <div className="flex justify-between items-start mb-3">
          <h4 className="font-semibold">Monetization</h4>
          <Button size="sm" variant="ghost" onClick={() => onEditStep(3)}>
            <Edit2 className="h-4 w-4" />
          </Button>
        </div>
        <div className="space-y-2 text-sm">
          <div>
            <span className="text-muted-foreground">Ticket Price:</span>{" "}
            <span className="font-medium">
              {formData.isPaid ? `$${formData.price}` : "Free event"}
            </span>
          </div>
          {formData.acceptTips && (
            <div>
              <span className="text-muted-foreground">Tips:</span>{" "}
              <span className="font-medium">
                Enabled via {formData.paymentMethod} ({formData.paymentHandle})
              </span>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};
