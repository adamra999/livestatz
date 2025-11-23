import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, Loader2 } from "lucide-react";

interface AvatarUploadProps {
  avatarUrl: string;
  initials: string;
  uploading: boolean;
  onFileSelect: (file: File) => void;
}

export const AvatarUpload = ({
  avatarUrl,
  initials,
  uploading,
  onFileSelect,
}: AvatarUploadProps) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) {
      return;
    }

    const file = event.target.files[0];
    onFileSelect(file);
  };

  return (
    <div className="flex items-center gap-6">
      <Avatar className="h-24 w-24">
        <AvatarImage src={avatarUrl} />
        <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
      </Avatar>

      <div className="flex-1">
        <Label htmlFor="avatar-upload" className="cursor-pointer">
          <Button
            type="button"
            variant="outline"
            disabled={uploading}
            className="cursor-pointer"
            asChild
          >
            <span>
              {uploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Avatar
                </>
              )}
            </span>
          </Button>
        </Label>
        <Input
          id="avatar-upload"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
          disabled={uploading}
        />
        <p className="text-sm text-muted-foreground mt-2">
          JPG, PNG or GIF. Max size 5MB.
        </p>
      </div>
    </div>
  );
};

