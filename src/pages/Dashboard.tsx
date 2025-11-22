import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Users,
  TrendingUp,
  Zap,
  DollarSign,
  BarChart3,
  Crown,
  Sparkles,
  Copy,
  Check,
  Share2,
  ExternalLink,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { EventCard } from "@/components/events/EventCard";
import { useEvents } from "@/hooks/useEvents";
import { useAuth } from "@/hooks/useAuth";
import { useRsvps } from "@/hooks/useRsvps";
import { useWeeklyFanReports } from "@/hooks/useWeeklyFanReports";
import { format } from "date-fns";
import { useProfile } from "@/hooks/useProfile";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import CreateEventPage from "./CreateEventPage";

const Dashboard = () => {
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const { user } = useAuth();
  console.log(user);

  const {
    events,
    loading,
    error,
    createEvent,
    fetchEventCountByUser,
    eventCount,
  } = useEvents();
  const { fetchTotalRsvpCount, fetchRsvpCountByEvent } = useRsvps();
  const { getWeeklyReport } = useWeeklyFanReports();
  const [showEventForm, setShowEventForm] = useState(false);
  const [showSuccessPage, setShowSuccessPage] = useState(false);
  const [createdEvent, setCreatedEvent] = useState<any>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [totalRsvps, setTotalRsvps] = useState<number>(0);
  const [rsvpCounts, setRsvpCounts] = useState<Record<string, number>>({});
  const [weeklyReport, setWeeklyReport] = useState({
    newFansThisWeek: 0,
    fansAttendedThisWeek: 0,
    rsvpsGrowthThisWeek: 0,
  });
  const { profile, fetchProfile } = useProfile();

  const [currentView, setCurrentView] = useState<
    "dashboard" | "calendar" | "analytics" | "events"
  >("dashboard");

  useEffect(() => {
    const view = searchParams.get("view");
    if (view && ["calendar", "analytics", "events"].includes(view)) {
      setCurrentView(view as "calendar" | "analytics" | "events");
    } else {
      setCurrentView("dashboard");
    }
  }, [searchParams]);

  useEffect(() => {
    const loadRsvpCount = async () => {
      const { count } = await fetchTotalRsvpCount();
      setTotalRsvps(count);
    };

    if (user?.id) {
      loadRsvpCount();
    }
  }, [user?.id, fetchTotalRsvpCount]);

  useEffect(() => {
    const loadWeeklyReport = async () => {
      const { data } = await getWeeklyReport();
      if (data) {
        setWeeklyReport(data);
      }
    };

    if (user?.id) {
      loadWeeklyReport();
    }
  }, [user?.id, getWeeklyReport]);

  useEffect(() => {
    const loadRsvpCounts = async () => {
      if (events.length === 0) return;

      const counts: Record<string, number> = {};

      for (const event of events) {
        const { count } = await fetchRsvpCountByEvent(event.id);
        counts[event.id] = count;
      }

      setRsvpCounts(counts);
    };

    if (user?.id && events.length > 0) {
      loadRsvpCounts();
    }
  }, [user?.id, events, fetchRsvpCountByEvent]);

  useEffect(() => {
    if (user?.id) {
      fetchProfile(user.id);
    }
  }, [user?.id, fetchProfile]);
  const handleClick = () => {
    if (isDesktop) {
      setShowEventForm(true); // open dialog with mobile version
    } else {
      navigate("/events/create-event"); // go to page on mobile
    }
  };
  return (
    <div className="min-h-screen bg-background">
      {/* Dashboard Content */}
      <div className="container mx-auto px-4 py-6">
        {
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Welcome Section */}
              <Card className="bg-gradient-card border-0 shadow-creator">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-2xl">
                        Welcome back,{" "}
                        {profile?.username || user?.user_metadata?.full_name || "Creator"}
                        ! 🚀
                      </CardTitle>
                      <CardDescription>
                        Here's what's happening with your content
                      </CardDescription>
                    </div>
                    <Badge
                      variant="outline"
                      className="bg-primary text-primary-foreground min-w-[72px]"
                    >
                      Pro Plan
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-primary/10 rounded-lg">
                      <Users className="h-8 w-8 text-primary mx-auto mb-2" />
                      <div className="text-2xl font-bold">{totalRsvps}</div>
                      <div className="text-sm text-muted-foreground">
                        Total RSVPs
                      </div>
                    </div>
                    <div className="text-center p-4 bg-primary/10 rounded-lg">
                      <Calendar className="h-8 w-8 text-primary mx-auto mb-2" />
                      <div className="text-2xl font-bold">
                        {events?.length || 0}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Live Events
                      </div>
                    </div>
                    {/* <div className="text-center p-4 bg-secondary/10 rounded-lg">
                      <TrendingUp className="h-8 w-8 text-secondary-foreground mx-auto mb-2" />
                      <div className="text-2xl font-bold">78%</div>
                      <div className="text-sm text-muted-foreground">
                        Show Rate
                      </div>
                    </div>
                    <div className="text-center p-4 bg-accent/10 rounded-lg">
                      <DollarSign className="h-8 w-8 text-accent-foreground mx-auto mb-2" />
                      <div className="text-2xl font-bold">$1.2K</div>
                      <div className="text-sm text-muted-foreground">
                        Revenue
                      </div>
                    </div> */}
                  </div>
                </CardContent>
              </Card>

              {/* Upcoming Events */}
              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Live Events</CardTitle>
                  <CardDescription>
                    Your scheduled sessions and RSVPs
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      // {
                      //   id: "1",
                      //   title: "Morning Workout Session",
                      //   date: "Today",
                      //   time: "9:00 AM",
                      //   rsvpCount: 156,
                      //   platform: "Instagram Live",
                      //   isPaid: false,
                      //   isLive: true,
                      //   liveLink: "https://instagram.com/live/workout123",
                      // },
                      // {
                      //   id: "2",
                      //   title: "Gaming Stream Q&A",
                      //   date: "Tomorrow",
                      //   time: "7:00 PM",
                      //   rsvpCount: 89,
                      //   platform: "TikTok Live",
                      //   isPaid: true,
                      //   price: 9.99,
                      // },
                      // {
                      //   id: "3",
                      //   title: "Fashion Haul & Tips",
                      //   date: "Friday",
                      //   time: "3:00 PM",
                      //   rsvpCount: 203,
                      //   platform: "YouTube Live",
                      //   isPaid: false,
                      //   rsvpGoal: 300,
                      //   totalViews: 1250,
                      //   revenue: 145.5,
                      // },
                      ...events.map((e) => {
                        return {
                          id: e.id,
                          title: e.title,
                          date: format(new Date(e.dateTime), "M/d/yyyy"),
                          time: format(new Date(e.dateTime), "h:mm a"),
                          rsvpCount: rsvpCounts[e.id] || 0,
                          platform: e.platform,
                          isPaid: e.isPaid,
                          isLive: true,
                          liveLink: e.link,
                        };
                      }),
                    ].map((event) => (
                      <EventCard
                        key={event.id}
                        event={event}
                        variant="compact"
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    className="w-full"
                    variant="default"
                    // onClick={() => setShowEventForm(true)}
                    onClick={handleClick}
                  >
                    <Zap className="mr-2 h-4 w-4" />
                    Create Live Event
                  </Button>
                  {/* <Button className="w-full" variant="outline">
                    <Calendar className="mr-2 h-4 w-4" />
                    Schedule Content
                  </Button> */}
                  <Button
                    className="w-full"
                    variant="outline"
                    onClick={() => navigate("/analytics")}
                  >
                    <BarChart3 className="mr-2 h-4 w-4" />
                    View Analytics
                  </Button>
                </CardContent>
              </Card>

              {/* Performance Insights */}
              <Card>
                <CardHeader>
                  <CardTitle>Performance Insights</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>RSVP Conversion</span>
                        <span>78%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full"
                          style={{ width: "78%" }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Engagement Rate</span>
                        <span>92%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-secondary h-2 rounded-full"
                          style={{ width: "92%" }}
                        ></div>
                      </div>
                    </div>
                    {/* <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Revenue Growth</span>
                        <span>156%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-accent h-2 rounded-full"
                          style={{ width: "100%" }}
                        ></div>
                      </div>
                    </div> */}
                  </div>
                </CardContent>
              </Card>

              {/* Weekly Fan Growth */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    🔥 Weekly Fan Growth
                  </CardTitle>
                  <CardDescription>
                    Your fan growth metrics this week
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">🎉</div>
                      <div>
                        <div className="font-semibold">
                          <Link
                            to="/profile?tab=fans"
                            className="text-primary hover:underline cursor-pointer"
                          >
                            {weeklyReport.newFansThisWeek} New Fans joined this week
                          </Link>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Growing your community!
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">💜</div>
                      <div>
                        <div className="font-semibold">
                          <Link
                            to="/profile?tab=superfans"
                            className="text-primary hover:underline cursor-pointer"
                          >
                            {weeklyReport.fansAttendedThisWeek} Fans attended events
                          </Link>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Active participants this week
                        </div>
                      </div>
                    </div>
                    <div className="p-4 bg-primary/5 rounded-lg border border-primary/10">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-primary">
                          Total RSVP Growth
                        </span>
                        <span className="font-bold text-xl text-primary">
                          +{weeklyReport.rsvpsGrowthThisWeek}
                        </span>
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        New RSVPs this week
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        }
      </div>

      {/* Create Event Dialog - Mobile Version on Desktop */}
      <Dialog open={showEventForm} onOpenChange={setShowEventForm}>
        <DialogContent className="max-w-[90vw] w-full max-h-[90vh] h-full md:max-w-md md:h-auto p-0 overflow-hidden">
          <CreateEventPage onClose={() => setShowEventForm(false)} embedded={true} />
        </DialogContent>
      </Dialog>

      {/* Success Page */}
      {showSuccessPage && createdEvent && <EventSuccessPage />}
    </div>
  );

  function EventSuccessPage() {
    const [copied, setCopied] = useState(false);

    const copyToClipboard = (text: string) => {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({
        title: "Copied!",
        description: "Event link copied to clipboard",
      });
    };

    const shareToSocial = (platform: string) => {
      const eventDate = new Date(createdEvent.dateTime).toLocaleDateString();
      const eventTime = new Date(createdEvent.dateTime).toLocaleTimeString();
      const message = `Join me for "${createdEvent.title}" on ${eventDate} at ${eventTime}! ${createdEvent.url}`;

      const urls = {
        twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(
          message
        )}`,
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          createdEvent.url
        )}`,
        linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
          createdEvent.url
        )}`,
        discord: createdEvent.url, // Copy for Discord
        instagram: createdEvent.url, // Copy for Instagram
        x: `https://x.com/intent/tweet?text=${encodeURIComponent(message)}`,
        twitch: createdEvent.url, // Copy for Twitch
      };

      if (
        platform === "discord" ||
        platform === "instagram" ||
        platform === "twitch"
      ) {
        copyToClipboard(message);
      } else {
        window.open(urls[platform as keyof typeof urls], "_blank");
      }
    };

    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
        <div className="bg-card rounded-xl max-w-4xl w-full p-8 max-h-[90vh] overflow-y-auto">
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

          {/* Event URL Section */}
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
                onClick={() => copyToClipboard(createdEvent.url)}
                variant="outline"
                className="px-4"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-green-600" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Event Details Preview */}
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="font-semibold mb-4">Event Details</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <strong>Title:</strong> {createdEvent.title}
                </div>
                <div>
                  <strong>Platform:</strong> {createdEvent.platform}
                </div>
                <div>
                  <strong>Date:</strong>{" "}
                  {new Date(createdEvent.dateTime).toLocaleDateString()}
                </div>
                <div>
                  <strong>Time:</strong>{" "}
                  {new Date(createdEvent.dateTime).toLocaleTimeString()}
                </div>
                {createdEvent.isPaid && (
                  <>
                    <div className="flex items-center gap-2">
                      <strong>Price:</strong>
                      <Badge className="bg-yellow-100 text-yellow-800">
                        ${createdEvent.price}
                      </Badge>
                    </div>
                    {createdEvent.includeReplay && (
                      <Badge variant="outline">48hr Replay</Badge>
                    )}
                    {createdEvent.includePerks && (
                      <Badge variant="outline">Downloadable Perks</Badge>
                    )}
                    {createdEvent.offerWithSubscription && (
                      <Badge variant="outline">Free with Subscription</Badge>
                    )}
                  </>
                )}
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Share on Social Media</h3>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { name: "Twitter", key: "twitter", icon: "🐦" },
                  { name: "Facebook", key: "facebook", icon: "📘" },
                  { name: "LinkedIn", key: "linkedin", icon: "💼" },
                  { name: "Instagram", key: "instagram", icon: "📸" },
                  { name: "Discord", key: "discord", icon: "🎮" },
                  { name: "X", key: "x", icon: "✖️" },
                  { name: "Twitch", key: "twitch", icon: "🎯" },
                ].map((platform) => (
                  <Button
                    key={platform.key}
                    variant="outline"
                    size="sm"
                    onClick={() => shareToSocial(platform.key)}
                    className="text-xs"
                  >
                    {platform.icon} {platform.name}
                  </Button>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Instagram, Discord & Twitch will copy the message to your
                clipboard
              </p>
            </div>
          </div>

          {/* Actions */}
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
      </div>
    );
  }
};

export default Dashboard;
