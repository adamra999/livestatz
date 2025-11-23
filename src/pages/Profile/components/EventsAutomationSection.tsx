import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface AutomationSettings {
  defaultPlatforms: {
    instagram: boolean;
    tiktok: boolean;
    youtube: boolean;
    twitch: boolean;
    facebook: boolean;
  };
  reminders: {
    twentyFour: boolean;
    oneHour: boolean;
    liveAlert: boolean;
  };
  calendar: {
    autoSend: boolean;
  };
}

export const EventsAutomationSection = () => {
  const [settings, setSettings] = useState<AutomationSettings>({
    defaultPlatforms: {
      instagram: true,
      tiktok: false,
      youtube: true,
      twitch: false,
      facebook: false,
    },
    reminders: {
      twentyFour: true,
      oneHour: true,
      liveAlert: true,
    },
    calendar: {
      autoSend: true,
    },
  });

  const handleSave = () => {
    toast.success("Automation settings saved!");
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-foreground mb-4">Events & Automation</h2>
      <div className="bg-card rounded-lg border border-border p-6 space-y-6">
        {/* Default Platforms */}
        <div>
          <Label className="text-base font-semibold mb-3 block">
            Default Platforms for New Events
          </Label>
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="platform-instagram"
                checked={settings.defaultPlatforms.instagram}
                onCheckedChange={(checked) =>
                  setSettings((prev) => ({
                    ...prev,
                    defaultPlatforms: { ...prev.defaultPlatforms, instagram: checked as boolean },
                  }))
                }
              />
              <Label htmlFor="platform-instagram" className="font-normal cursor-pointer">
                Instagram Live
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="platform-tiktok"
                checked={settings.defaultPlatforms.tiktok}
                onCheckedChange={(checked) =>
                  setSettings((prev) => ({
                    ...prev,
                    defaultPlatforms: { ...prev.defaultPlatforms, tiktok: checked as boolean },
                  }))
                }
              />
              <Label htmlFor="platform-tiktok" className="font-normal cursor-pointer">
                TikTok Live
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="platform-youtube"
                checked={settings.defaultPlatforms.youtube}
                onCheckedChange={(checked) =>
                  setSettings((prev) => ({
                    ...prev,
                    defaultPlatforms: { ...prev.defaultPlatforms, youtube: checked as boolean },
                  }))
                }
              />
              <Label htmlFor="platform-youtube" className="font-normal cursor-pointer">
                YouTube Live
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="platform-twitch"
                checked={settings.defaultPlatforms.twitch}
                onCheckedChange={(checked) =>
                  setSettings((prev) => ({
                    ...prev,
                    defaultPlatforms: { ...prev.defaultPlatforms, twitch: checked as boolean },
                  }))
                }
              />
              <Label htmlFor="platform-twitch" className="font-normal cursor-pointer">
                Twitch
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="platform-facebook"
                checked={settings.defaultPlatforms.facebook}
                onCheckedChange={(checked) =>
                  setSettings((prev) => ({
                    ...prev,
                    defaultPlatforms: { ...prev.defaultPlatforms, facebook: checked as boolean },
                  }))
                }
              />
              <Label htmlFor="platform-facebook" className="font-normal cursor-pointer">
                Facebook Live
              </Label>
            </div>
          </div>
        </div>

        {/* Reminder Defaults */}
        <div>
          <Label className="text-base font-semibold mb-3 block">Reminder Defaults</Label>
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="reminder-24h"
                checked={settings.reminders.twentyFour}
                onCheckedChange={(checked) =>
                  setSettings((prev) => ({
                    ...prev,
                    reminders: { ...prev.reminders, twentyFour: checked as boolean },
                  }))
                }
              />
              <Label htmlFor="reminder-24h" className="font-normal cursor-pointer">
                24-hour reminder
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="reminder-1h"
                checked={settings.reminders.oneHour}
                onCheckedChange={(checked) =>
                  setSettings((prev) => ({
                    ...prev,
                    reminders: { ...prev.reminders, oneHour: checked as boolean },
                  }))
                }
              />
              <Label htmlFor="reminder-1h" className="font-normal cursor-pointer">
                1-hour reminder
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="reminder-live"
                checked={settings.reminders.liveAlert}
                onCheckedChange={(checked) =>
                  setSettings((prev) => ({
                    ...prev,
                    reminders: { ...prev.reminders, liveAlert: checked as boolean },
                  }))
                }
              />
              <Label htmlFor="reminder-live" className="font-normal cursor-pointer">
                "We're Live!" instant alert
              </Label>
            </div>
          </div>
        </div>

        {/* Calendar Options */}
        <div>
          <Label className="text-base font-semibold mb-3 block">Calendar Options</Label>
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="calendar-auto"
                checked={settings.calendar.autoSend}
                onCheckedChange={(checked) =>
                  setSettings((prev) => ({
                    ...prev,
                    calendar: { ...prev.calendar, autoSend: checked as boolean },
                  }))
                }
              />
              <Label htmlFor="calendar-auto" className="font-normal cursor-pointer">
                Auto-send calendar invite after RSVP
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="calendar-ask"
                checked={!settings.calendar.autoSend}
                onCheckedChange={(checked) =>
                  setSettings((prev) => ({
                    ...prev,
                    calendar: { ...prev.calendar, autoSend: !(checked as boolean) },
                  }))
                }
              />
              <Label htmlFor="calendar-ask" className="font-normal cursor-pointer">
                Ask each time
              </Label>
            </div>
          </div>
        </div>

        <Button onClick={handleSave}>Save Settings</Button>
      </div>
    </div>
  );
};
