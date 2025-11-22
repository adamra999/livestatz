import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Users,
  Eye,
  Heart,
  Share2,
  TrendingUp,
  DollarSign,
  Copy,
  Download,
  Mail,
  ExternalLink,
  BarChart3,
  Instagram,
  Youtube,
  Play,
  MessageCircle,
  Sparkles,
  Target,
  Crown,
  Check,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useEvents } from "@/hooks/useEvents";
import { useRsvps } from "@/hooks/useRsvps";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import CreateEventPage from "./CreateEventPage";
import { Plus } from "lucide-react";
import { ShareDialog } from "@/components/events/ShareDialog";

// Mock event data - in real app, this would come from API
const mockEventData = {
  id: "abc123",
  title: "Team Building Workshop",
  description:
    "Join us for an interactive team building session with fun activities and networking opportunities.",
  platform: "Instagram Live",
  date: "8/15/2025",
  time: "2:30 PM",
  coverImage: "/placeholder.svg",
  isLive: false,
  isPaid: true,
  price: 29.99,
  monetizationEnabled: true,
  rsvpCount: 156,
  rsvpGoal: 200,
  organizer: "Sarah Chen",
  liveLink: "https://instagram.com/live/abc123",
  analytics: {
    totalViews: 2847,
    peakConcurrent: 145,
    likes: 892,
    shares: 67,
    newFollowers: 23,
    revenue: 2940.5,
  },
  rsvps: [
    {
      name: "John Smith",
      email: "john@example.com",
      source: "Instagram Story",
      rsvpType: "Yes",
    },
    {
      name: "Emma Wilson",
      email: "emma@example.com",
      source: "Direct Link",
      rsvpType: "Maybe",
    },
    {
      name: "Mike Johnson",
      email: "mike@example.com",
      source: "TikTok Post",
      rsvpType: "Yes",
    },
  ],
  hypeContent: [
    {
      date: "8/12/2025",
      type: "Instagram Reel",
      views: 12500,
      likes: 567,
      shares: 89,
      hasCTA: true,
      link: "https://instagram.com/p/abc",
    },
    {
      date: "8/13/2025",
      type: "TikTok Video",
      views: 8900,
      likes: 234,
      shares: 45,
      hasCTA: true,
      link: "https://tiktok.com/@user/video/123",
    },
  ],
  monetization: {
    tipRevenue: 450.0,
    ticketRevenue: 2490.5,
    merchRevenue: 0,
    clickThroughRate: 12.5,
    payoutStatus: "Pending",
  },
};

export default function EventDetail() {
  const { eventId } = useParams();
  const { toast } = useToast();
  const { fetchEventById } = useEvents();
  const { fetchRsvpCountByEvent, fetchRsvpsWithFanDetails } = useRsvps();
  const [copiedLink, setCopiedLink] = useState(false);
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [rsvpCount, setRsvpCount] = useState(0);
  const [rsvpsList, setRsvpsList] = useState<any[]>([]);
  const [organizerUsername, setOrganizerUsername] = useState<string | null>(null);
  const [showEventForm, setShowEventForm] = useState(false);
  const [showSuccessPage, setShowSuccessPage] = useState(false);
  const [createdEvent, setCreatedEvent] = useState<any>(null);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);
  const [showShareDialog, setShowShareDialog] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // const event = mockEventData; // In real app: fetch event by eventId

  useEffect(() => {
    const loadEvent = async () => {
      if (eventId) {
        setLoading(true);
        const eventData = await fetchEventById(eventId);
        const { count } = await fetchRsvpCountByEvent(eventId);
        const { data: rsvpsData } = await fetchRsvpsWithFanDetails(eventId);
        setRsvpCount(count);
        setRsvpsList(rsvpsData);
        setEvent({ ...mockEventData, ...eventData, rsvpCount: count });
        
        // Fetch organizer username from profiles
        if (eventData?.influencerId) {
          const { data: profileData } = await supabase
            .from("profiles")
            .select("username")
            .eq("id", eventData.influencerId)
            .single();
          
          if (profileData?.username) {
            setOrganizerUsername(profileData.username);
          }
        }
        
        setLoading(false);
      }
    };
    loadEvent();
  }, [eventId, fetchEventById, fetchRsvpCountByEvent, fetchRsvpsWithFanDetails]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg">Loading event...</div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg">Event not found</div>
          <Link to="/">
            <Button className="mt-4">Back to Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  const copyLink = async () => {
    await navigator.clipboard.writeText(event.url);
    setCopiedLink(true);
    toast({
      title: "Link copied!",
      description: "Event link has been copied to clipboard",
    });
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleShare = () => {
    setShowShareDialog(true);
  };

  const rsvpProgress = (event.rsvpCount / event.rsvpGoal) * 100;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-2 md:gap-4 min-w-0 flex-1">
              <Link to="/">
                <Button variant="ghost" size="sm" className="shrink-0">
                  <ArrowLeft className="h-4 w-4 md:mr-2" />
                  <span className="hidden sm:inline">Back to Dashboard</span>
                </Button>
              </Link>
              <div className="hidden md:block h-6 w-px bg-border shrink-0" />
              <h1 className="text-base md:text-xl font-semibold truncate">{event.title}</h1>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {isDesktop && (
                <Button
                  onClick={() => setShowEventForm(true)}
                  size="sm"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Event
                </Button>
              )}
              {event.isLive && (
                <Badge variant="destructive" className="animate-pulse">
                  🔴 LIVE
                </Badge>
              )}
              <Badge variant={event.isPaid ? "default" : "secondary"}>
                {event.isPaid ? `$${event.price}` : "Free"}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Event Overview Panel */}
            <Card className="bg-gradient-card border-0 shadow-creator">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-2xl mb-2">
                      {event.title}
                    </CardTitle>
                    <CardDescription className="text-base mb-4">
                      {event.description}
                    </CardDescription>

                    <div className="flex flex-wrap gap-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <Instagram className="h-4 w-4 text-pink-500" />
                        <span>{event.platform}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4" />
                        <span>{format(new Date(event.dateTime), "MMM d, yyyy")}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4" />
                        <span>{format(new Date(event.dateTime), "h:mm a")}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Crown className="h-4 w-4" />
                        <span>by {organizerUsername || event.Influencers?.name || "Unknown"}</span>
                      </div>
                    </div>
                  </div>

                  {event.coverImage && (
                    <div className="ml-6">
                      <img
                        src={event.coverImage}
                        alt="Event cover"
                        className="w-24 h-24 rounded-lg object-cover"
                      />
                    </div>
                  )}
                </div>
              </CardHeader>

              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
                  <div className="text-center p-3 md:p-4 bg-primary/10 rounded-lg">
                    <Users className="h-5 w-5 md:h-6 md:w-6 text-primary mx-auto mb-1" />
                    <div className="text-lg md:text-xl font-bold">{event.rsvpCount}</div>
                    <div className="text-xs text-muted-foreground">RSVPs</div>
                  </div>

                  <div className="text-center p-3 md:p-4 bg-secondary/10 rounded-lg">
                    <Target className="h-5 w-5 md:h-6 md:w-6 text-secondary-foreground mx-auto mb-1" />
                    <div className="text-lg md:text-xl font-bold">
                      {Math.round(rsvpProgress)}%
                    </div>
                    <div className="text-xs text-muted-foreground">of Goal</div>
                  </div>

                  <div className="text-center p-3 md:p-4 bg-muted rounded-lg col-span-2 md:col-span-1">
                    <Sparkles className="h-5 w-5 md:h-6 md:w-6 text-muted-foreground mx-auto mb-1" />
                    <div className="text-lg md:text-xl font-bold">
                      {event.monetizationEnabled ? "Yes" : "No"}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Monetized
                    </div>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="text-sm text-muted-foreground mb-1">
                      RSVP Progress
                    </div>
                    <Progress value={rsvpProgress} className="w-full md:w-48" />
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={copyLink} variant="outline" className="flex-1 md:flex-none">
                      {copiedLink ? (
                        <Check className="h-4 w-4 mr-2" />
                      ) : (
                        <Copy className="h-4 w-4 mr-2" />
                      )}
                      {copiedLink ? "Copied!" : "Copy Link"}
                    </Button>
                    <Button onClick={handleShare} variant="outline" className="flex-1 md:flex-none">
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tabbed Content */}
            <Tabs defaultValue="analytics" className="w-full">
              <TabsList className="grid w-full grid-cols-2 h-auto">
                <TabsTrigger value="analytics" className="text-sm md:text-base py-2">
                  <span className="hidden sm:inline">📈 </span>Analytics
                </TabsTrigger>
                <TabsTrigger value="rsvps" className="text-sm md:text-base py-2">
                  <span className="hidden sm:inline">👥 </span>RSVPs
                </TabsTrigger>
              </TabsList>

              {/* Live Analytics Tab */}
              <TabsContent value="analytics" className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                  <Card>
                    <CardContent className="p-4 text-center">
                      <Eye className="h-8 w-8 text-primary mx-auto mb-2" />
                      <div className="text-2xl font-bold">
                        {event.analytics.totalViews.toLocaleString()}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Total Views
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4 text-center">
                      <Users className="h-8 w-8 text-secondary-foreground mx-auto mb-2" />
                      <div className="text-2xl font-bold">
                        {event.analytics.peakConcurrent}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Peak Concurrent
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4 text-center">
                      <Heart className="h-8 w-8 text-red-500 mx-auto mb-2" />
                      <div className="text-2xl font-bold">
                        {event.analytics.likes}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Likes/Hearts
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4 text-center">
                      <Share2 className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                      <div className="text-2xl font-bold">
                        {event.analytics.shares}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Shares
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4 text-center">
                      <TrendingUp className="h-8 w-8 text-green-500 mx-auto mb-2" />
                      <div className="text-2xl font-bold">
                        +{event.analytics.newFollowers}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        New Followers
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* RSVP Management Tab */}
              <TabsContent value="rsvps" className="space-y-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0 flex-1">
                    <h3 className="text-base md:text-lg font-semibold">RSVP Management</h3>
                    <p className="text-xs md:text-sm text-muted-foreground">
                      {event.rsvpCount} total RSVPs • {Math.round(rsvpProgress)}% of goal
                    </p>
                  </div>
                  <Button variant="outline" size="sm" className="w-full sm:w-auto">
                    <Mail className="h-4 w-4 mr-2" />
                    Send Reminder
                  </Button>
                </div>

                <div className="space-y-2">
                  {rsvpsList.length > 0 ? (
                    rsvpsList.map((rsvp) => (
                      <div
                        key={rsvp.id}
                        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 border rounded-lg"
                      >
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          {rsvp.fans?.avatar_url && (
                            <img
                              src={rsvp.fans.avatar_url}
                              alt={rsvp.fans.name}
                              className="w-10 h-10 rounded-full shrink-0"
                            />
                          )}
                          <div className="min-w-0 flex-1">
                            <div className="font-medium truncate">{rsvp.fans?.name || "Unknown"}</div>
                            <div className="text-sm text-muted-foreground truncate">
                              {rsvp.fans?.email || "No email"}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-3">
                          <div className="text-xs sm:text-sm text-muted-foreground">
                            {format(new Date(rsvp.created_at), "MMM d, yyyy")}
                          </div>
                          <Badge
                            variant={
                              rsvp.status === "confirmed" ? "default" : "secondary"
                            }
                            className="shrink-0"
                          >
                            {rsvp.status}
                          </Badge>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      No RSVPs yet
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6 lg:sticky lg:top-4">
            {/* Event Status */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base md:text-lg">Event Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center gap-2">
                    <span className="text-sm">Status</span>
                    <Badge variant={new Date(event.dateTime) < new Date() ? "default" : "secondary"}>
                      {new Date(event.dateTime) < new Date() ? "Past Event" : "Scheduled"}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center gap-2">
                    <span className="text-sm">RSVPs</span>
                    <span className="text-sm font-medium">{rsvpCount}</span>
                  </div>
                  <div className="flex justify-between items-center gap-2">
                    <span className="text-sm">Platform</span>
                    <span className="text-sm font-medium truncate max-w-[150px]">
                      {event.platform}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Create Event Dialog */}
      <Dialog open={showEventForm} onOpenChange={setShowEventForm}>
        <DialogContent className="max-w-[90vw] w-full max-h-[90vh] md:max-w-md p-0 overflow-y-auto">
          <CreateEventPage 
            onClose={() => setShowEventForm(false)} 
            embedded={true}
            onSuccess={(event) => {
              setCreatedEvent(event);
              setShowSuccessPage(true);
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Success Page Dialog */}
      <Dialog open={showSuccessPage && !!createdEvent} onOpenChange={(open) => {
        if (!open) {
          setShowSuccessPage(false);
          setCreatedEvent(null);
        }
      }}>
        <DialogContent className="max-w-[90vw] md:max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          {createdEvent && (
            <div className="p-4">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="text-3xl font-bold mb-2">
                  Event Created Successfully!
                </h2>
                <p className="text-muted-foreground">
                  Your live event is ready to share with your audience
                </p>
              </div>

              <div className="bg-primary/5 border border-primary/20 rounded-lg p-6 mb-8">
                <h3 className="font-semibold mb-3">Your Event Link</h3>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={createdEvent.url}
                    readOnly
                    className="flex-1 p-3 border rounded-lg bg-background font-mono text-sm"
                  />
                  <Button
                    onClick={async () => {
                      await navigator.clipboard.writeText(createdEvent.url);
                      toast({
                        title: "Copied!",
                        description: "Event link copied to clipboard",
                      });
                    }}
                    variant="outline"
                    className="px-4"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="flex gap-4 justify-center">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowSuccessPage(false);
                    setCreatedEvent(null);
                  }}
                >
                  Close
                </Button>
                <Button
                  onClick={() => {
                    setShowSuccessPage(false);
                    setCreatedEvent(null);
                    setShowEventForm(true);
                  }}
                >
                  Create Another Event
                </Button>
                <Link to={`/e/${createdEvent.id}`}>
                  <Button variant="outline">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Preview Event Page
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Floating Share Button (Mobile Only) */}
      {!isDesktop && (
        <button
          onClick={handleShare}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center active:scale-95"
          aria-label="Share event"
        >
          <Share2 className="h-6 w-6" />
        </button>
      )}

      {/* Share Dialog */}
      <ShareDialog
        open={showShareDialog}
        onOpenChange={setShowShareDialog}
        event={{
          title: event.title,
          url: event.url,
          dateTime: event.dateTime,
        }}
      />
    </div>
  );
}
