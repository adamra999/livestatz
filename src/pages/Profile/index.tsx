import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Loader2, Settings } from "lucide-react";
import { useProfileSettings } from "./useProfileSettings";
import { AvatarUpload } from "./components/AvatarUpload";
import { ProfileForm } from "./components/ProfileForm";

const Profile = () => {
  const navigate = useNavigate();
  const {
    profile,
    loading,
    uploading,
    handleAvatarUpload,
    handleSave,
    updateProfileField,
    getUserInitials,
  } = useProfileSettings();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Profile Settings</h1>

        <div className="space-y-6">
          {/* Creator Settings Link */}
          <div className="bg-gradient-primary rounded-lg p-6 border border-primary/20 shadow-creator">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Settings className="h-6 w-6 text-primary-foreground" />
                <div>
                  <h3 className="text-lg font-semibold text-primary-foreground">
                    Creator Settings
                  </h3>
                  <p className="text-sm text-primary-foreground/90">
                    Manage platforms, automation & security
                  </p>
                </div>
              </div>
              <Button
                variant="secondary"
                onClick={() => navigate("/profile/creator-settings")}
              >
                Open Settings
              </Button>
            </div>
          </div>

          <div className="bg-card rounded-lg p-6 border">
            <h2 className="text-xl font-semibold mb-4">Account Information</h2>

            <div className="space-y-6">
              <AvatarUpload
                avatarUrl={profile.avatar_url}
                initials={getUserInitials()}
                uploading={uploading}
                onFileSelect={handleAvatarUpload}
              />

              <ProfileForm profile={profile} onFieldChange={updateProfileField} />
            </div>
          </div>

          <div className="flex gap-3">
            <Button onClick={handleSave} disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
            <Button variant="outline" onClick={() => navigate(-1)} disabled={loading}>
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

