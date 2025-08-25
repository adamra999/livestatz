import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Upload, 
  Link2, 
  Video, 
  Scissors, 
  Download, 
  Play, 
  Edit, 
  Trash2, 
  Share2,
  Clock,
  Eye,
  TrendingUp,
  Zap,
  Youtube,
  Instagram,
  Music
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ContentManager = () => {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadedVideo, setUploadedVideo] = useState<any>(null);
  const [generatedClips, setGeneratedClips] = useState([
    {
      id: "1",
      title: "Best moment from stream",
      duration: "0:15",
      thumbnail: "/placeholder.svg",
      status: "ready",
      views: 0,
      platform: "tiktok",
      timestamp: "02:34 - 02:49"
    },
    {
      id: "2", 
      title: "Funny reaction clip",
      duration: "0:12",
      thumbnail: "/placeholder.svg",
      status: "ready",
      views: 0,
      platform: "instagram",
      timestamp: "15:22 - 15:34"
    },
    {
      id: "3",
      title: "Key insight moment",
      duration: "0:18",
      thumbnail: "/placeholder.svg",
      status: "ready",
      views: 0,
      platform: "youtube",
      timestamp: "28:15 - 28:33"
    }
  ]);

  const handleVideoUpload = async (file: File) => {
    setIsProcessing(true);
    
    // Simulate video processing
    setTimeout(() => {
      setUploadedVideo({
        name: file.name,
        duration: "45:32",
        size: "2.1 GB",
        uploadedAt: new Date().toISOString()
      });
      setIsProcessing(false);
      
      toast({
        title: "Video uploaded successfully!",
        description: "AI is analyzing your video for clip generation...",
      });
      
      // Simulate AI processing
      setTimeout(() => {
        toast({
          title: "🎬 Clips generated!",
          description: "3 viral-ready clips have been created from your video.",
        });
      }, 3000);
    }, 2000);
  };

  const handleYouTubeImport = async (url: string) => {
    setIsProcessing(true);
    
    // Simulate YouTube import
    setTimeout(() => {
      setUploadedVideo({
        name: "Imported from YouTube",
        duration: "32:18",
        size: "1.8 GB",
        uploadedAt: new Date().toISOString(),
        source: "youtube"
      });
      setIsProcessing(false);
      
      toast({
        title: "YouTube video imported!",
        description: "AI is processing your video for clips...",
      });
    }, 2000);
  };

  const exportToSocial = (clipId: string, platform: string) => {
    toast({
      title: `Exporting to ${platform}...`,
      description: "Your clip will be ready for posting in a few seconds.",
    });
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case "tiktok": return <Music className="h-4 w-4" />;
      case "instagram": return <Instagram className="h-4 w-4" />;
      case "youtube": return <Youtube className="h-4 w-4" />;
      default: return <Video className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">ClipGen</h1>
            <p className="text-muted-foreground">Transform long-form content into viral-ready clips with AI</p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline">
              <TrendingUp className="h-4 w-4 mr-2" />
              Analytics
            </Button>
            <Button>
              <Zap className="h-4 w-4 mr-2" />
              Generate Clips
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Clips Generated</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">127</div>
              <p className="text-xs text-muted-foreground">+12 this week</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2.4M</div>
              <p className="text-xs text-muted-foreground">Across all platforms</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Avg. Engagement</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8.7%</div>
              <p className="text-xs text-muted-foreground">+2.3% vs manual clips</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Time Saved</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">43hrs</div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>
        </div>

        {/* Upload Section */}
        {!uploadedVideo && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Video Upload */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Upload className="h-5 w-5 mr-2" />
                  Upload Video
                </CardTitle>
                <CardDescription>Upload a video file from your device</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
                  <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mb-4">
                    Drag & drop your video file here or click to browse
                  </p>
                  <input
                    type="file"
                    accept="video/*"
                    className="hidden"
                    id="video-upload"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleVideoUpload(file);
                    }}
                  />
                  <Button 
                    variant="outline" 
                    onClick={() => document.getElementById('video-upload')?.click()}
                    disabled={isProcessing}
                  >
                    {isProcessing ? "Processing..." : "Choose File"}
                  </Button>
                  <p className="text-xs text-muted-foreground mt-2">
                    Supports MP4, MOV, AVI (max 5GB)
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* YouTube Import */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Link2 className="h-5 w-5 mr-2" />
                  Import from YouTube
                </CardTitle>
                <CardDescription>Import a video directly from YouTube</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <input
                      type="url"
                      placeholder="Paste YouTube URL here..."
                      className="w-full p-3 border rounded-lg bg-background"
                      id="youtube-url"
                    />
                  </div>
                  <Button 
                    className="w-full"
                    onClick={() => {
                      const url = (document.getElementById('youtube-url') as HTMLInputElement)?.value;
                      if (url) handleYouTubeImport(url);
                    }}
                    disabled={isProcessing}
                  >
                    <Youtube className="h-4 w-4 mr-2" />
                    {isProcessing ? "Importing..." : "Import Video"}
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    We'll download and process your YouTube video for clip generation
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Uploaded Video Info */}
        {uploadedVideo && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Video className="h-5 w-5 mr-2" />
                Source Video
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">{uploadedVideo.name}</h3>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <span className="flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {uploadedVideo.duration}
                    </span>
                    <span>{uploadedVideo.size}</span>
                    {uploadedVideo.source && (
                      <Badge variant="outline">
                        <Youtube className="h-3 w-3 mr-1" />
                        YouTube
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Play className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Scissors className="h-4 w-4 mr-2" />
                    Generate More Clips
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Generated Clips */}
        {generatedClips.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center">
                  <Scissors className="h-5 w-5 mr-2" />
                  Generated Clips ({generatedClips.length})
                </span>
                <Button variant="outline" size="sm">
                  Generate More
                </Button>
              </CardTitle>
              <CardDescription>AI-generated clips ready for social media</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {generatedClips.map((clip) => (
                  <div key={clip.id} className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
                    {/* Thumbnail */}
                    <div className="aspect-video bg-muted rounded-lg mb-3 relative">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Play className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                        {clip.duration}
                      </div>
                    </div>
                    
                    {/* Clip Info */}
                    <div className="space-y-3">
                      <div>
                        <h3 className="font-medium text-sm">{clip.title}</h3>
                        <p className="text-xs text-muted-foreground">From: {clip.timestamp}</p>
                      </div>
                      
                      {/* Platform & Stats */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1">
                          {getPlatformIcon(clip.platform)}
                          <span className="text-xs capitalize">{clip.platform}</span>
                        </div>
                        <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                          <Eye className="h-3 w-3" />
                          <span>{clip.views}</span>
                        </div>
                      </div>
                      
                      {/* Actions */}
                      <div className="flex space-x-1">
                        <Button variant="outline" size="sm" className="flex-1">
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1"
                          onClick={() => exportToSocial(clip.id, clip.platform)}
                        >
                          <Share2 className="h-3 w-3" />
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1">
                          <Download className="h-3 w-3" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ContentManager;