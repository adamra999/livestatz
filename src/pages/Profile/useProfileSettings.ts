import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { ProfileData } from "./types";
import { useAuth } from "@/hooks/useAuth";

const initialProfile: ProfileData = {
  full_name: "",
  email: "",
  avatar_url: "",
  phone: "",
  username: "",
};

export const useProfileSettings = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<ProfileData>(initialProfile);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const isLoadingRef = useRef(false);
  const loadedUserIdRef = useRef<string | null>(null);

  const loadProfile = useCallback(async () => {
    if (!user?.id || isLoadingRef.current || loadedUserIdRef.current === user.id) return;

    isLoadingRef.current = true;
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error && error.code !== "PGRST116") {
        console.error("Error loading profile:", error);
        return;
      }

      if (data) {
        setProfile({
          full_name: data.full_name || "",
          email: data.email || user.email || "",
          avatar_url: data.avatar_url || "",
          phone: data.phone || "",
          username: data.username || "",
        });
      } else {
        setProfile({
          full_name: user.user_metadata?.full_name || "",
          email: user.email || "",
          avatar_url: user.user_metadata?.avatar_url || "",
          phone: user.user_metadata?.phone || "",
          username: "",
        });
      }
      loadedUserIdRef.current = user.id;
    } catch (error) {
      console.error("Error loading profile:", error);
    } finally {
      isLoadingRef.current = false;
    }
  }, [user?.id]);

  useEffect(() => {
    if (user?.id && loadedUserIdRef.current !== user.id) {
      loadProfile();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const handleAvatarUpload = useCallback(
    async (file: File) => {
      if (!user) return;

      const fileExt = file.name.split(".").pop();
      const fileName = `${user.id}/${Math.random()}.${fileExt}`;

      setUploading(true);

      try {
        // Upload to Supabase Storage
        const { error: uploadError } = await supabase.storage
          .from("avatars")
          .upload(fileName, file, { upsert: true });

        if (uploadError) throw uploadError;

        // Get public URL
        const {
          data: { publicUrl },
        } = supabase.storage.from("avatars").getPublicUrl(fileName);

        // Update profile with new avatar URL
        const { error: updateError } = await supabase
          .from("profiles")
          .upsert({
            id: user.id,
            avatar_url: publicUrl,
            email: user.email,
            updated_at: new Date().toISOString(),
          });

        if (updateError) throw updateError;

        setProfile((prev) => ({ ...prev, avatar_url: publicUrl }));
        toast.success("Avatar uploaded successfully!");
      } catch (error) {
        console.error("Error uploading avatar:", error);
        toast.error("Error uploading avatar");
      } finally {
        setUploading(false);
      }
    },
    [user]
  );

  const handleSave = useCallback(async () => {
    if (!user) return;

    setLoading(true);

    try {
      const { error } = await supabase.from("profiles").upsert({
        id: user.id,
        full_name: profile.full_name,
        email: profile.email,
        phone: profile.phone,
        username: profile.username,
        avatar_url: profile.avatar_url,
        updated_at: new Date().toISOString(),
      });

      if (error) throw error;

      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Error updating profile");
    } finally {
      setLoading(false);
    }
  }, [user, profile]);

  const updateProfileField = useCallback(
    <K extends keyof ProfileData>(field: K, value: ProfileData[K]) => {
      setProfile((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const getUserInitials = useCallback(() => {
    if (profile.full_name) {
      return profile.full_name.charAt(0).toUpperCase();
    }
    return profile.email.charAt(0).toUpperCase();
  }, [profile.full_name, profile.email]);

  return {
    profile,
    loading,
    uploading,
    handleAvatarUpload,
    handleSave,
    updateProfileField,
    getUserInitials,
  };
};

