import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

export interface PlatformConnections {
  instagram: string;
  tiktok: string;
  youtube: string;
  youtubePrefix: string;
  twitch: string;
  facebook: string;
  rtmpServer: string;
  streamKey: string;
}

export interface AutomationSettings {
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

export interface CreatorMetadata {
  platforms?: PlatformConnections;
  automation?: AutomationSettings;
  twoFactorEnabled?: boolean;
}

const defaultPlatforms: PlatformConnections = {
  instagram: "",
  tiktok: "",
  youtube: "",
  youtubePrefix: "",
  twitch: "",
  facebook: "",
  rtmpServer: "",
  streamKey: "",
};

const defaultAutomation: AutomationSettings = {
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
};

export const useCreatorSettings = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [platforms, setPlatforms] = useState<PlatformConnections>(defaultPlatforms);
  const [automation, setAutomation] = useState<AutomationSettings>(defaultAutomation);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  // Load creator settings from profile metadata
  const loadSettings = useCallback(async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("metadata")
        .eq("id", user.id)
        .single();

      if (error && error.code !== "PGRST116") {
        console.error("Error loading creator settings:", error);
        return;
      }

      if (data?.metadata) {
        const metadata = data.metadata as CreatorMetadata;
        
        if (metadata.platforms) {
          setPlatforms({ ...defaultPlatforms, ...metadata.platforms });
        }
        
        if (metadata.automation) {
          setAutomation({ ...defaultAutomation, ...metadata.automation });
        }
        
        if (metadata.twoFactorEnabled !== undefined) {
          setTwoFactorEnabled(metadata.twoFactorEnabled);
        }
      }
    } catch (error) {
      console.error("Error loading creator settings:", error);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      loadSettings();
    }
  }, [user, loadSettings]);

  // Save platforms
  const savePlatforms = useCallback(
    async (updatedPlatforms: Partial<PlatformConnections>) => {
      if (!user) return;

      setLoading(true);
      try {
        const newPlatforms = { ...platforms, ...updatedPlatforms };
        
        const { error } = await supabase
          .from("profiles")
          .upsert({
            id: user.id,
            email: user.email,
            metadata: {
              platforms: newPlatforms,
              automation,
              twoFactorEnabled,
            } as any,
            updated_at: new Date().toISOString(),
          }, {
            onConflict: 'id'
          });

        if (error) throw error;

        setPlatforms(newPlatforms);
        toast.success("Platform settings saved!");
      } catch (error) {
        console.error("Error saving platforms:", error);
        toast.error("Failed to save platform settings");
      } finally {
        setLoading(false);
      }
    },
    [user, platforms, automation, twoFactorEnabled]
  );

  // Save automation settings
  const saveAutomation = useCallback(
    async (updatedAutomation: Partial<AutomationSettings>) => {
      if (!user) return;

      setLoading(true);
      try {
        const newAutomation = { ...automation, ...updatedAutomation };
        
        const { error } = await supabase
          .from("profiles")
          .upsert({
            id: user.id,
            email: user.email,
            metadata: {
              platforms,
              automation: newAutomation,
              twoFactorEnabled,
            } as any,
            updated_at: new Date().toISOString(),
          }, {
            onConflict: 'id'
          });

        if (error) throw error;

        setAutomation(newAutomation);
        toast.success("Automation settings saved!");
      } catch (error) {
        console.error("Error saving automation:", error);
        toast.error("Failed to save automation settings");
      } finally {
        setLoading(false);
      }
    },
    [user, platforms, automation, twoFactorEnabled]
  );

  // Save 2FA setting
  const save2FA = useCallback(
    async (enabled: boolean) => {
      if (!user) return;

      setLoading(true);
      try {
        const { error } = await supabase
          .from("profiles")
          .upsert({
            id: user.id,
            email: user.email,
            metadata: {
              platforms,
              automation,
              twoFactorEnabled: enabled,
            } as any,
            updated_at: new Date().toISOString(),
          }, {
            onConflict: 'id'
          });

        if (error) throw error;

        setTwoFactorEnabled(enabled);
        toast.success(
          enabled
            ? "2-Factor Authentication enabled"
            : "2-Factor Authentication disabled"
        );
      } catch (error) {
        console.error("Error saving 2FA setting:", error);
        toast.error("Failed to update 2FA setting");
      } finally {
        setLoading(false);
      }
    },
    [user, platforms, automation]
  );

  // Disconnect platform
  const disconnectPlatform = useCallback(
    async (platform: keyof PlatformConnections) => {
      const updatedPlatforms = { ...platforms, [platform]: "" };
      await savePlatforms(updatedPlatforms);
    },
    [platforms, savePlatforms]
  );

  return {
    platforms,
    automation,
    twoFactorEnabled,
    loading,
    setPlatforms,
    setAutomation,
    savePlatforms,
    saveAutomation,
    save2FA,
    disconnectPlatform,
  };
};
