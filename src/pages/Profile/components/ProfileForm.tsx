import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ProfileData } from "../types";

interface ProfileFormProps {
  profile: ProfileData;
  onFieldChange: <K extends keyof ProfileData>(
    field: K,
    value: ProfileData[K]
  ) => void;
}

export const ProfileForm = ({ profile, onFieldChange }: ProfileFormProps) => {
  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="full_name">Full Name</Label>
        <Input
          id="full_name"
          type="text"
          value={profile.full_name}
          onChange={(e) => onFieldChange("full_name", e.target.value)}
          placeholder="Enter your full name"
        />
      </div>

      <div>
        <Label htmlFor="username">Handle</Label>
        <Input
          id="username"
          type="text"
          value={profile.username}
          onChange={(e) => onFieldChange("username", e.target.value)}
          placeholder="@yourhandle"
        />
      </div>

      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={profile.email}
          onChange={(e) => onFieldChange("email", e.target.value)}
          placeholder="Enter your email"
          disabled
        />
      </div>

      <div>
        <Label htmlFor="phone">Phone</Label>
        <Input
          id="phone"
          type="tel"
          value={profile.phone}
          onChange={(e) => onFieldChange("phone", e.target.value)}
          placeholder="Enter your phone number"
        />
      </div>
    </div>
  );
};

