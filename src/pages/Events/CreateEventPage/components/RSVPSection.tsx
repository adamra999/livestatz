import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { EventFormData } from "../types";
import { forwardRef, useImperativeHandle } from "react";

interface RSVPSectionProps {
  formData: EventFormData;
  onFieldChange: <K extends keyof EventFormData>(
    field: K,
    value: EventFormData[K]
  ) => void;
}

export interface StepValidationRef {
  validate: () => boolean;
}

export const RSVPSection = forwardRef<StepValidationRef, RSVPSectionProps>(
  ({ formData, onFieldChange }, ref) => {
    useImperativeHandle(ref, () => ({
      validate: () => {
        // All fields in this step are optional
        return true;
      },
    }));

    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-4">RSVP Settings</h3>

          <div className="space-y-4">
            <div>
              <Label className="text-base font-medium">Max Attendees</Label>
              <RadioGroup
                value={formData.hasMaxAttendees ? "limited" : "unlimited"}
                onValueChange={(value) => {
                  onFieldChange("hasMaxAttendees", value === "limited");
                  if (value === "unlimited") {
                    onFieldChange("maxAttendees", null);
                  }
                }}
                className="mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="unlimited" id="unlimited" />
                  <Label htmlFor="unlimited" className="font-normal cursor-pointer">
                    No limit
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="limited" id="limited" />
                  <Label htmlFor="limited" className="font-normal cursor-pointer">
                    Limit to:
                  </Label>
                  {formData.hasMaxAttendees && (
                    <Input
                      type="number"
                      min="1"
                      value={formData.maxAttendees || ""}
                      onChange={(e) =>
                        onFieldChange("maxAttendees", parseInt(e.target.value) || null)
                      }
                      className="w-24"
                      placeholder="100"
                    />
                  )}
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label className="text-base font-medium mb-3 block">
                Should fans receive reminders?
              </Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="reminder24h"
                    checked={formData.reminder24h}
                    onCheckedChange={(checked) => onFieldChange("reminder24h", checked as boolean)}
                  />
                  <Label htmlFor="reminder24h" className="font-normal cursor-pointer">
                    24-hour reminder
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="reminder1h"
                    checked={formData.reminder1h}
                    onCheckedChange={(checked) => onFieldChange("reminder1h", checked as boolean)}
                  />
                  <Label htmlFor="reminder1h" className="font-normal cursor-pointer">
                    1-hour reminder
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="reminderLive"
                    checked={formData.reminderLive}
                    onCheckedChange={(checked) => onFieldChange("reminderLive", checked as boolean)}
                  />
                  <Label htmlFor="reminderLive" className="font-normal cursor-pointer">
                    "We're Live!" alert with correct platform link
                  </Label>
                </div>
              </div>
            </div>

            <div>
              <Label className="text-base font-medium">Calendar Options</Label>
              <RadioGroup
                value={formData.calendarOption}
                onValueChange={(value) =>
                  onFieldChange("calendarOption", value as "auto" | "ask" | "none")
                }
                className="mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="auto" id="auto" />
                  <Label htmlFor="auto" className="font-normal cursor-pointer">
                    Auto-send calendar invite
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="ask" id="ask" />
                  <Label htmlFor="ask" className="font-normal cursor-pointer">
                    Ask fan before sending
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="none" id="none" />
                  <Label htmlFor="none" className="font-normal cursor-pointer">
                    Do not send invites
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label className="text-base font-medium mb-3 block">Require Email to RSVP?</Label>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="requireEmail"
                  checked={formData.requireEmail}
                  onCheckedChange={(checked) => onFieldChange("requireEmail", checked as boolean)}
                />
                <Label htmlFor="requireEmail" className="font-normal cursor-pointer">
                  Yes (otherwise name only)
                </Label>
              </div>
            </div>

            <div>
              <Label className="text-base font-medium">Visibility</Label>
              <RadioGroup
                value={formData.visibility}
                onValueChange={(value) =>
                  onFieldChange("visibility", value as "public" | "followers" | "private")
                }
                className="mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="public" id="public" />
                  <Label htmlFor="public" className="font-normal cursor-pointer">
                    Public (anyone can RSVP)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="followers" id="followers" />
                  <Label htmlFor="followers" className="font-normal cursor-pointer">
                    Followers only
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="private" id="private" />
                  <Label htmlFor="private" className="font-normal cursor-pointer">
                    Private (invite-only)
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

RSVPSection.displayName = "RSVPSection";
