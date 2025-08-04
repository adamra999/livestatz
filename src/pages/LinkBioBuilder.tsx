import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Copy, Eye, Link, Palette, Plus, Trash2 } from "lucide-react";

interface BioLink {
  id: string;
  title: string;
  url: string;
  type: 'rsvp' | 'tip' | 'merch' | 'calendar' | 'custom';
}

export default function LinkBioBuilder() {
  const [bioTitle, setBioTitle] = useState("💥 Join My Next Live — Aug 8 @ 7PM • RSVP Now 💥");
  const [bioDescription, setBioDescription] = useState("Don't miss out on exclusive content and live interactions!");
  const [profileImage, setProfileImage] = useState("");
  const [backgroundColor, setBackgroundColor] = useState("#1a1a1a");
  const [textColor, setTextColor] = useState("#ffffff");
  const [links, setLinks] = useState<BioLink[]>([
    { id: '1', title: 'RSVP for Live Event', url: '/e/live-event-123', type: 'rsvp' },
    { id: '2', title: 'Support with Tips', url: '#', type: 'tip' },
    { id: '3', title: 'Shop Merch', url: '#', type: 'merch' },
    { id: '4', title: 'Add to Calendar', url: '#', type: 'calendar' }
  ]);
  const [newLinkTitle, setNewLinkTitle] = useState("");
  const [newLinkUrl, setNewLinkUrl] = useState("");
  const { toast } = useToast();

  const handleAddLink = () => {
    if (!newLinkTitle || !newLinkUrl) return;
    
    const newLink: BioLink = {
      id: Date.now().toString(),
      title: newLinkTitle,
      url: newLinkUrl,
      type: 'custom'
    };
    
    setLinks([...links, newLink]);
    setNewLinkTitle("");
    setNewLinkUrl("");
  };

  const handleRemoveLink = (id: string) => {
    setLinks(links.filter(link => link.id !== id));
  };

  const handleCopyBioLink = () => {
    const bioUrl = `${window.location.origin}/bio/creator-name`;
    navigator.clipboard.writeText(bioUrl);
    toast({
      title: "Link copied!",
      description: "Your bio link has been copied to clipboard.",
    });
  };

  const getLinkTypeColor = (type: string) => {
    switch (type) {
      case 'rsvp': return 'bg-blue-500';
      case 'tip': return 'bg-green-500';
      case 'merch': return 'bg-purple-500';
      case 'calendar': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Link-in-Bio Builder</h1>
          <p className="text-muted-foreground">Create a customizable landing page for your bio links</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Builder Panel */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="w-5 h-5" />
                  Customize Your Page
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Bio Title</label>
                  <Textarea
                    value={bioTitle}
                    onChange={(e) => setBioTitle(e.target.value)}
                    placeholder="💥 Join My Next Live — Aug 8 @ 7PM • RSVP Now 💥"
                    className="min-h-[80px]"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">Description</label>
                  <Textarea
                    value={bioDescription}
                    onChange={(e) => setBioDescription(e.target.value)}
                    placeholder="Add a description about your upcoming event..."
                    className="min-h-[80px]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Background Color</label>
                    <div className="flex gap-2">
                      <Input
                        type="color"
                        value={backgroundColor}
                        onChange={(e) => setBackgroundColor(e.target.value)}
                        className="w-16 h-10 p-1"
                      />
                      <Input
                        value={backgroundColor}
                        onChange={(e) => setBackgroundColor(e.target.value)}
                        placeholder="#1a1a1a"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Text Color</label>
                    <div className="flex gap-2">
                      <Input
                        type="color"
                        value={textColor}
                        onChange={(e) => setTextColor(e.target.value)}
                        className="w-16 h-10 p-1"
                      />
                      <Input
                        value={textColor}
                        onChange={(e) => setTextColor(e.target.value)}
                        placeholder="#ffffff"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Link className="w-5 h-5" />
                  Manage Links
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {links.map((link) => (
                    <div key={link.id} className="flex items-center gap-3 p-3 border rounded-lg">
                      <div className={`w-3 h-3 rounded-full ${getLinkTypeColor(link.type)}`} />
                      <div className="flex-1">
                        <p className="font-medium text-sm">{link.title}</p>
                        <p className="text-xs text-muted-foreground">{link.url}</p>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {link.type}
                      </Badge>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleRemoveLink(link.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4 space-y-3">
                  <h4 className="font-medium text-sm">Add New Link</h4>
                  <Input
                    placeholder="Link title"
                    value={newLinkTitle}
                    onChange={(e) => setNewLinkTitle(e.target.value)}
                  />
                  <Input
                    placeholder="URL"
                    value={newLinkUrl}
                    onChange={(e) => setNewLinkUrl(e.target.value)}
                  />
                  <Button onClick={handleAddLink} className="w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Link
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-3">
              <Button onClick={handleCopyBioLink} className="flex-1">
                <Copy className="w-4 h-4 mr-2" />
                Copy Bio Link
              </Button>
              <Button variant="outline">
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </Button>
            </div>
          </div>

          {/* Live Preview */}
          <div className="lg:sticky lg:top-4">
            <Card>
              <CardHeader>
                <CardTitle>Live Preview</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div 
                  className="aspect-[9/16] max-w-sm mx-auto rounded-lg overflow-hidden"
                  style={{ backgroundColor, color: textColor }}
                >
                  <div className="p-6 text-center space-y-6">
                    {/* Profile Section */}
                    <div className="space-y-3">
                      <div className="w-20 h-20 bg-gray-300 rounded-full mx-auto" />
                      <div>
                        <h2 className="font-bold text-lg leading-tight">{bioTitle}</h2>
                        <p className="text-sm opacity-80 mt-2">{bioDescription}</p>
                      </div>
                    </div>

                    {/* Links */}
                    <div className="space-y-3">
                      {links.map((link) => (
                        <div
                          key={link.id}
                          className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-3 hover:bg-white/20 transition-colors cursor-pointer"
                        >
                          <div className="flex items-center justify-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${getLinkTypeColor(link.type)}`} />
                            <span className="font-medium text-sm">{link.title}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}