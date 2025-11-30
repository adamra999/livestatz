import { useState, useImperativeHandle, forwardRef, useEffect, useCallback, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Upload, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

export interface BasicInfoSectionRef {
  validate: () => boolean;
}

export const BasicInfoSection = forwardRef<BasicInfoSectionRef>((props, ref) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const isLoadingRef = useRef(false);
  const loadedUserIdRef = useRef<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: user?.email || "",
    avatarUrl: "",
    bio: "",
  });

  const loadProfile = useCallback(async () => {
    if (!user?.id || isLoadingRef.current || loadedUserIdRef.current === user.id) return;

    isLoadingRef.current = true;
    const { data, error } = await supabase
      .from("profiles")
      .select("full_name, avatar_url, metadata")
      .eq("id", user.id)
      .single();

    if (data && !error) {
      const metadata = data.metadata as any;
      setFormData((prev) => ({
        ...prev,
        name: data.full_name || "",
        avatarUrl: data.avatar_url || "",
        bio: metadata?.bio || "",
      }));
    }
    loadedUserIdRef.current = user.id;
    isLoadingRef.current = false;
  }, [user?.id]);

  useEffect(() => {
    if (user?.id && loadedUserIdRef.current !== user.id) {
      loadProfile();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  useImperativeHandle(ref, () => ({
    validate: () => {
      if (!formData.name || formData.name.trim() === "") {
        toast.error("Please enter your name to continue");
        return false;
      }
      return true;
    },
  }));

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    const fileExt = file.name.split(".").pop();
    const fileName = `${user.id}/${Math.random()}.${fileExt}`;

    setUploading(true);

    try {
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from("avatars").getPublicUrl(fileName);

      setFormData((prev) => ({ ...prev, avatarUrl: publicUrl }));
      toast.success("Avatar uploaded successfully!");
    } catch (error) {
      console.error("Error uploading avatar:", error);
      toast.error("Error uploading avatar");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;
    
    if (!formData.name || formData.name.trim() === "") {
      toast.error("Name is required");
      return;
    }

    setLoading(true);

    try {
      // First fetch existing metadata to preserve other fields
      const { data: existingProfile } = await supabase
        .from("profiles")
        .select("metadata")
        .eq("id", user.id)
        .single();

      const existingMetadata = (existingProfile?.metadata as any) || {};

      const { error } = await supabase
        .from("profiles")
        .upsert({
          id: user.id,
          full_name: formData.name,
          avatar_url: formData.avatarUrl,
          email: user.email,
          metadata: {
            ...existingMetadata,
            bio: formData.bio,
          },
        }, {
          onConflict: 'id'
        });

      if (error) throw error;

      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Error updating profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-foreground mb-4">Basic Info</h2>
      <div className="bg-card rounded-lg border border-border p-6 space-y-6">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            type="text"
            value={formData.name}
            onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
            placeholder="Enter your name"
            className="mt-2"
          />
        </div>

        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            disabled
            className="mt-2"
          />
        </div>

        <div>
          <Label>Profile Image</Label>
          <div className="flex items-center gap-4 mt-2">
            <Avatar className="h-20 w-20">
              <AvatarImage src={formData.avatarUrl} />
              <AvatarFallback className="bg-primary text-primary-foreground">
                {formData.name ? formData.name.charAt(0).toUpperCase() : formData.email.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <input
                type="file"
                id="avatar-upload"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="hidden"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => document.getElementById("avatar-upload")?.click()}
                disabled={uploading}
              >
                {uploading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Change Photo
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        <div>
          <Label htmlFor="bio">Bio (optional)</Label>
          <p className="text-sm text-muted-foreground mb-2">
            Add a short description about yourself.
          </p>
          <Textarea
            id="bio"
            value={formData.bio}
            onChange={(e) => setFormData((prev) => ({ ...prev, bio: e.target.value }))}
            placeholder="Tell us about yourself..."
            rows={4}
          />
        </div>

        <Button onClick={handleSave} disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Saving...
            </>
          ) : (
            "Save Changes"
          )}
        </Button>
      </div>
    </div>
  );
});

BasicInfoSection.displayName = "BasicInfoSection";
