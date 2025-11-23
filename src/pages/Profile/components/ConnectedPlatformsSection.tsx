import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Instagram, Youtube, Twitch, Facebook } from "lucide-react";
import { toast } from "sonner";

interface PlatformData {
  instagram: string;
  tiktok: string;
  youtube: string;
  youtubePrefix: string;
  twitch: string;
  facebook: string;
  rtmpServer: string;
  streamKey: string;
}

export const ConnectedPlatformsSection = () => {
  const [platforms, setPlatforms] = useState<PlatformData>({
    instagram: "",
    tiktok: "",
    youtube: "",
    youtubePrefix: "",
    twitch: "",
    facebook: "",
    rtmpServer: "",
    streamKey: "",
  });

  const handleSave = (platform: string) => {
    toast.success(`${platform} settings saved!`);
  };

  const handleDisconnect = (platform: string) => {
    toast.success(`${platform} disconnected!`);
  };

  return (
    <div>
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-foreground mb-2">Connected Platforms</h2>
        <p className="text-sm text-muted-foreground">
          Add your social links so LiveStatz can auto-fill event details.
        </p>
      </div>

      <div className="space-y-6">
        {/* Instagram */}
        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center gap-2 mb-4">
            <Instagram className="h-5 w-5 text-creator-pink" />
            <h3 className="font-semibold text-foreground">Instagram</h3>
          </div>
          <div className="space-y-4">
            <div>
              <Label htmlFor="instagram">Instagram Handle / URL</Label>
              <div className="flex gap-2 mt-2">
                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-border bg-muted text-muted-foreground text-sm">
                  instagram.com/
                </span>
                <Input
                  id="instagram"
                  value={platforms.instagram}
                  onChange={(e) => setPlatforms((prev) => ({ ...prev, instagram: e.target.value }))}
                  placeholder="yourhandle"
                  className="rounded-l-none"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button size="sm" onClick={() => handleSave("Instagram")}>Save</Button>
              <Button size="sm" variant="outline" onClick={() => handleDisconnect("Instagram")}>Disconnect</Button>
            </div>
          </div>
        </div>

        {/* TikTok */}
        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-5 w-5 bg-foreground rounded" />
            <h3 className="font-semibold text-foreground">TikTok</h3>
          </div>
          <div className="space-y-4">
            <div>
              <Label htmlFor="tiktok">TikTok Profile URL</Label>
              <div className="flex gap-2 mt-2">
                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-border bg-muted text-muted-foreground text-sm">
                  tiktok.com/@
                </span>
                <Input
                  id="tiktok"
                  value={platforms.tiktok}
                  onChange={(e) => setPlatforms((prev) => ({ ...prev, tiktok: e.target.value }))}
                  placeholder="username"
                  className="rounded-l-none"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button size="sm" onClick={() => handleSave("TikTok")}>Save</Button>
              <Button size="sm" variant="outline" onClick={() => handleDisconnect("TikTok")}>Disconnect</Button>
            </div>
          </div>
        </div>

        {/* YouTube */}
        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center gap-2 mb-4">
            <Youtube className="h-5 w-5 text-destructive" />
            <h3 className="font-semibold text-foreground">YouTube</h3>
          </div>
          <div className="space-y-4">
            <div>
              <Label htmlFor="youtube">YouTube Channel URL</Label>
              <div className="flex gap-2 mt-2">
                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-border bg-muted text-muted-foreground text-sm">
                  youtube.com/@
                </span>
                <Input
                  id="youtube"
                  value={platforms.youtube}
                  onChange={(e) => setPlatforms((prev) => ({ ...prev, youtube: e.target.value }))}
                  placeholder="channelname"
                  className="rounded-l-none"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="youtube-prefix">Scheduled Live Link Prefix (Optional)</Label>
              <Input
                id="youtube-prefix"
                value={platforms.youtubePrefix}
                onChange={(e) => setPlatforms((prev) => ({ ...prev, youtubePrefix: e.target.value }))}
                placeholder="https://youtube.com/live/..."
                className="mt-2"
              />
            </div>
            <div className="flex gap-2">
              <Button size="sm" onClick={() => handleSave("YouTube")}>Save</Button>
              <Button size="sm" variant="outline" onClick={() => handleDisconnect("YouTube")}>Disconnect</Button>
            </div>
          </div>
        </div>

        {/* Twitch */}
        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center gap-2 mb-4">
            <Twitch className="h-5 w-5 text-creator-purple" />
            <h3 className="font-semibold text-foreground">Twitch</h3>
          </div>
          <div className="space-y-4">
            <div>
              <Label htmlFor="twitch">Twitch Channel</Label>
              <div className="flex gap-2 mt-2">
                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-border bg-muted text-muted-foreground text-sm">
                  twitch.tv/
                </span>
                <Input
                  id="twitch"
                  value={platforms.twitch}
                  onChange={(e) => setPlatforms((prev) => ({ ...prev, twitch: e.target.value }))}
                  placeholder="username"
                  className="rounded-l-none"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button size="sm" onClick={() => handleSave("Twitch")}>Save</Button>
              <Button size="sm" variant="outline" onClick={() => handleDisconnect("Twitch")}>Disconnect</Button>
            </div>
          </div>
        </div>

        {/* Facebook Live */}
        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center gap-2 mb-4">
            <Facebook className="h-5 w-5 text-creator-blue" />
            <h3 className="font-semibold text-foreground">Facebook Live</h3>
          </div>
          <div className="space-y-4">
            <div>
              <Label htmlFor="facebook">Facebook Page URL</Label>
              <div className="flex gap-2 mt-2">
                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-border bg-muted text-muted-foreground text-sm">
                  facebook.com/
                </span>
                <Input
                  id="facebook"
                  value={platforms.facebook}
                  onChange={(e) => setPlatforms((prev) => ({ ...prev, facebook: e.target.value }))}
                  placeholder="pagename"
                  className="rounded-l-none"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button size="sm" onClick={() => handleSave("Facebook")}>Save</Button>
              <Button size="sm" variant="outline" onClick={() => handleDisconnect("Facebook")}>Disconnect</Button>
            </div>
          </div>
        </div>

        {/* Custom RTMP */}
        <div className="bg-card rounded-lg border border-border p-6">
          <div className="mb-4">
            <h3 className="font-semibold text-foreground">Custom RTMP (Advanced)</h3>
          </div>
          <div className="space-y-4">
            <div>
              <Label htmlFor="rtmp-server">RTMP Server URL</Label>
              <Input
                id="rtmp-server"
                value={platforms.rtmpServer}
                onChange={(e) => setPlatforms((prev) => ({ ...prev, rtmpServer: e.target.value }))}
                placeholder="rtmp://..."
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="stream-key">Stream Key</Label>
              <Input
                id="stream-key"
                type="password"
                value={platforms.streamKey}
                onChange={(e) => setPlatforms((prev) => ({ ...prev, streamKey: e.target.value }))}
                placeholder="Enter stream key"
                className="mt-2"
              />
            </div>
            <Button size="sm" onClick={() => handleSave("RTMP")}>Save</Button>
          </div>
        </div>
      </div>
    </div>
  );
};
