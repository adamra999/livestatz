import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { X, Edit2 } from "lucide-react";
import type { EventFormData, PlatformDetails } from "../types";
import { forwardRef, useImperativeHandle, useState } from "react";

interface PlatformsSectionProps {
  formData: EventFormData;
  onFieldChange: <K extends keyof EventFormData>(
    field: K,
    value: EventFormData[K]
  ) => void;
  creatorPlatforms?: {
    instagram?: string;
    tiktok?: string;
    youtube?: string;
    twitch?: string;
    facebook?: string;
    customRtmp?: { url: string; key: string };
  };
}

export interface StepValidationRef {
  validate: () => boolean;
}

const AVAILABLE_PLATFORMS = [
  { id: "instagram", label: "Instagram Live", needsLink: false },
  { id: "tiktok", label: "TikTok Live", needsLink: true },
  { id: "youtube", label: "YouTube Live", needsLink: true },
  { id: "twitch", label: "Twitch", needsLink: false },
  { id: "facebook", label: "Facebook Live", needsLink: false },
  { id: "custom", label: "Custom RTMP", needsLink: false },
];

export const PlatformsSection = forwardRef<StepValidationRef, PlatformsSectionProps>(
  ({ formData, onFieldChange, creatorPlatforms }, ref) => {
    const [editingPlatform, setEditingPlatform] = useState<string | null>(null);

    useImperativeHandle(ref, () => ({
      validate: () => {
        return formData.selectedPlatforms.length > 0;
      },
    }));

    const isPlatformSelected = (platformId: string) => {
      return formData.selectedPlatforms.some((p) => p.platform === platformId);
    };

    const getPlatformDetails = (platformId: string): PlatformDetails | undefined => {
      return formData.selectedPlatforms.find((p) => p.platform === platformId);
    };

    const handlePlatformToggle = (platformId: string, checked: boolean) => {
      if (checked) {
        // Add platform with auto-filled data if available
        const newPlatform: PlatformDetails = {
          platform: platformId,
          profileUrl: creatorPlatforms?.[platformId as keyof typeof creatorPlatforms] as string || "",
          scheduledLink: "",
        };

        if (platformId === "custom" && creatorPlatforms?.customRtmp) {
          newPlatform.rtmpUrl = creatorPlatforms.customRtmp.url;
          newPlatform.streamKey = creatorPlatforms.customRtmp.key;
        }

        onFieldChange("selectedPlatforms", [...formData.selectedPlatforms, newPlatform]);
      } else {
        // Remove platform
        onFieldChange(
          "selectedPlatforms",
          formData.selectedPlatforms.filter((p) => p.platform !== platformId)
        );
      }
    };

    const updatePlatformDetails = (platformId: string, updates: Partial<PlatformDetails>) => {
      onFieldChange(
        "selectedPlatforms",
        formData.selectedPlatforms.map((p) =>
          p.platform === platformId ? { ...p, ...updates } : p
        )
      );
      setEditingPlatform(null);
    };

    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-4">Select one or multiple platforms:</h3>

          {AVAILABLE_PLATFORMS.map((platform) => {
            const isSelected = isPlatformSelected(platform.id);
            const details = getPlatformDetails(platform.id);
            const isEditing = editingPlatform === platform.id;

            return (
              <div key={platform.id} className="mb-6">
                <div className="flex items-center space-x-2 mb-2">
                  <Checkbox
                    id={platform.id}
                    checked={isSelected}
                    onCheckedChange={(checked) =>
                      handlePlatformToggle(platform.id, checked as boolean)
                    }
                  />
                  <Label htmlFor={platform.id} className="text-base font-medium cursor-pointer">
                    {platform.label}
                  </Label>
                </div>

                {isSelected && details && (
                  <div className="ml-6 mt-3 p-4 bg-muted/50 rounded-lg space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        {isEditing ? (
                          <div className="space-y-3">
                            <div>
                              <Label className="text-sm">
                                {platform.id === "custom" ? "RTMP Server URL" : "Profile URL"}
                              </Label>
                              <Input
                                value={
                                  platform.id === "custom"
                                    ? details.rtmpUrl || ""
                                    : details.profileUrl
                                }
                                onChange={(e) =>
                                  platform.id === "custom"
                                    ? updatePlatformDetails(platform.id, { rtmpUrl: e.target.value })
                                    : updatePlatformDetails(platform.id, {
                                        profileUrl: e.target.value,
                                      })
                                }
                                className="mt-1"
                              />
                            </div>

                            {platform.id === "custom" && (
                              <div>
                                <Label className="text-sm">Stream Key</Label>
                                <Input
                                  type="password"
                                  value={details.streamKey || ""}
                                  onChange={(e) =>
                                    updatePlatformDetails(platform.id, {
                                      streamKey: e.target.value,
                                    })
                                  }
                                  className="mt-1"
                                />
                              </div>
                            )}

                            {platform.needsLink && (
                              <div>
                                <Label className="text-sm">Scheduled Live Link (optional)</Label>
                                <Input
                                  value={details.scheduledLink || ""}
                                  onChange={(e) =>
                                    updatePlatformDetails(platform.id, {
                                      scheduledLink: e.target.value,
                                    })
                                  }
                                  placeholder="Paste your scheduled stream link"
                                  className="mt-1"
                                />
                              </div>
                            )}

                            <Button
                              size="sm"
                              onClick={() => setEditingPlatform(null)}
                              className="mt-2"
                            >
                              Done
                            </Button>
                          </div>
                        ) : (
                          <>
                            {platform.id === "custom" ? (
                              <>
                                <p className="text-sm text-muted-foreground">
                                  RTMP URL: {details.rtmpUrl || "Not set"}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  Stream Key: {details.streamKey ? "••••••••" : "Not set"}
                                </p>
                              </>
                            ) : (
                              <>
                                <p className="text-sm text-muted-foreground">
                                  {details.profileUrl || "Not set"}
                                </p>
                                {platform.needsLink && details.scheduledLink && (
                                  <p className="text-sm text-muted-foreground mt-1">
                                    Link: {details.scheduledLink}
                                  </p>
                                )}
                              </>
                            )}
                          </>
                        )}
                      </div>

                      {!isEditing && (
                        <div className="flex gap-2 ml-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setEditingPlatform(platform.id)}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handlePlatformToggle(platform.id, false)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
);

PlatformsSection.displayName = "PlatformsSection";
