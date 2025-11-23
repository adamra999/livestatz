import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { EventFormData } from "../types";
import { PLATFORMS } from "../types";

interface BasicInfoSectionProps {
  formData: EventFormData;
  urlError: string;
  onFieldChange: <K extends keyof EventFormData>(
    field: K,
    value: EventFormData[K]
  ) => void;
  onUrlBlur: (url: string) => void;
}

export const BasicInfoSection = ({
  formData,
  urlError,
  onFieldChange,
  onUrlBlur,
}: BasicInfoSectionProps) => {
  return (
    <section className="space-y-4">
      <div>
        <Label htmlFor="title">
          Event Title <span className="text-destructive">*</span>
        </Label>
        <Input
          id="title"
          type="text"
          placeholder="e.g., Morning Workout Session"
          value={formData.title}
          onChange={(e) => onFieldChange("title", e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="platform">Platform</Label>
        <Select
          value={formData.platform}
          onValueChange={(value) => onFieldChange("platform", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select platform" />
          </SelectTrigger>
          <SelectContent>
            {PLATFORMS.map((platform) => (
              <SelectItem key={platform} value={platform}>
                {platform}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="dateTime">
          Date & Time <span className="text-destructive">*</span>
        </Label>
        <Input
          id="dateTime"
          type="datetime-local"
          value={formData.dateTime}
          onChange={(e) => onFieldChange("dateTime", e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="eventUrl">
          Event URL <span className="text-destructive">*</span>
        </Label>
        <Input
          id="eventUrl"
          type="url"
          className={urlError ? "border-destructive focus:ring-destructive" : ""}
          placeholder="example.com/your-event"
          value={formData.eventUrl}
          onChange={(e) => onFieldChange("eventUrl", e.target.value)}
          onBlur={(e) => onUrlBlur(e.target.value)}
        />
        {urlError && (
          <p className="text-sm text-destructive mt-1">{urlError}</p>
        )}
        {!urlError && formData.eventUrl && (
          <p className="text-sm text-muted-foreground mt-1">✓ Valid URL</p>
        )}
      </div>

      <div>
        <Label htmlFor="description">Event Description</Label>
        <Textarea
          id="description"
          className="h-28 resize-none"
          placeholder="What will you be sharing with your audience?"
          value={formData.description}
          onChange={(e) => onFieldChange("description", e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="targetAudience">Target Audience</Label>
        <Input
          id="targetAudience"
          type="number"
          placeholder="Enter expected number of attendees"
          value={formData.targetAudience ?? ""}
          onChange={(e) =>
            onFieldChange(
              "targetAudience",
              e.target.value ? parseInt(e.target.value) : null
            )
          }
        />
      </div>
    </section>
  );
};

