import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ImageUpload } from "@/components/ui/image-upload";
import { Calendar } from "lucide-react";
import type { EventFormData } from "../types";
import { forwardRef, useImperativeHandle } from "react";

interface EventDetailsSectionProps {
  formData: EventFormData;
  onFieldChange: <K extends keyof EventFormData>(
    field: K,
    value: EventFormData[K]
  ) => void;
}

export interface StepValidationRef {
  validate: () => boolean;
}

export const EventDetailsSection = forwardRef<StepValidationRef, EventDetailsSectionProps>(
  ({ formData, onFieldChange }, ref) => {
    useImperativeHandle(ref, () => ({
      validate: () => {
        if (!formData.title.trim()) {
          return false;
        }
        if (!formData.dateTime) {
          return false;
        }
        if (!formData.startTime) {
          return false;
        }
        return true;
      },
    }));

    return (
      <div className="space-y-6">
        <div>
          <Label htmlFor="title" className="text-foreground">
            Event Title *
          </Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => onFieldChange("title", e.target.value)}
            placeholder="Enter event title"
            className="mt-2"
            required
          />
        </div>

        <div>
          <Label htmlFor="description" className="text-foreground">
            Description (optional)
          </Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => onFieldChange("description", e.target.value)}
            placeholder="Tell your fans what to expect..."
            className="mt-2 min-h-[100px]"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="dateTime" className="text-foreground">
              Date *
            </Label>
            <div className="relative mt-2">
              <Input
                id="dateTime"
                type="date"
                value={formData.dateTime.split("T")[0] || ""}
                onChange={(e) => {
                  const date = e.target.value;
                  const time = formData.startTime || "12:00";
                  onFieldChange("dateTime", `${date}T${time}`);
                }}
                required
              />
              <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            </div>
          </div>

          <div>
            <Label htmlFor="startTime" className="text-foreground">
              Start Time *
            </Label>
            <Input
              id="startTime"
              type="time"
              value={formData.startTime}
              onChange={(e) => {
                onFieldChange("startTime", e.target.value);
                if (formData.dateTime) {
                  const date = formData.dateTime.split("T")[0];
                  onFieldChange("dateTime", `${date}T${e.target.value}`);
                }
              }}
              className="mt-2"
              required
            />
          </div>
        </div>

        <div>
          <Label htmlFor="duration" className="text-foreground">
            Duration (optional)
          </Label>
          <Input
            id="duration"
            value={formData.duration}
            onChange={(e) => onFieldChange("duration", e.target.value)}
            placeholder="e.g., 60 min"
            className="mt-2"
          />
        </div>

        <ImageUpload
          value={formData.coverImage}
          onChange={(url) => onFieldChange("coverImage", url)}
          onRemove={() => onFieldChange("coverImage", "")}
          label="Cover Image (recommended)"
          maxSizeMB={5}
          maxWidth={1920}
          maxHeight={1080}
        />
      </div>
    );
  }
);

EventDetailsSection.displayName = "EventDetailsSection";
