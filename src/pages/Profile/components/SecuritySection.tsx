import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

interface SecuritySectionProps {
  twoFactorEnabled: boolean;
  save2FA: (enabled: boolean) => Promise<void>;
  loading: boolean;
}

export const SecuritySection = ({
  twoFactorEnabled,
  save2FA,
  loading,
}: SecuritySectionProps) => {
  const handleChangePassword = () => {
    toast.info("Password change feature coming soon!");
  };

  const handleToggle2FA = async (checked: boolean) => {
    await save2FA(checked);
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-foreground mb-4">Security</h2>
      <div className="bg-card rounded-lg border border-border p-6 space-y-6">
        <div>
          <Label className="text-base font-semibold mb-3 block">Password</Label>
          <Button variant="outline" onClick={handleChangePassword}>
            Change Password
          </Button>
        </div>

        <div>
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="2fa" className="text-base font-semibold">
                2-Factor Authentication
              </Label>
              <p className="text-sm text-muted-foreground mt-1">
                Add an extra layer of security to your account
              </p>
            </div>
            <Switch
              id="2fa"
              checked={twoFactorEnabled}
              onCheckedChange={handleToggle2FA}
              disabled={loading}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
