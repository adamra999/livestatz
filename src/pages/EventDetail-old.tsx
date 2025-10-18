import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft, Calendar, Clock, Users, Eye, Heart, Share2, TrendingUp,
  DollarSign, Copy, Download, Mail, ExternalLink, BarChart3, Instagram,
  Youtube, Play, MessageCircle, Sparkles, Target, Crown, Check
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useEvents } from "@/hooks/useEvents";
import { format } from "date-fns";

export default function EventDetail() {
  const { eventId } = useParams();
  const { toast } = useToast();
  const { fetchEventById } = useEvents();
  const [copiedLink, setCopiedLink] = useState(false);
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadEvent = async () => {
      if (eventId) {
        setLoading(true);
        const eventData = await fetchEventById(eventId);
        setEvent(eventData);
        setLoading(false);
      }
    };
    loadEvent();
  }, [eventId, fetchEventById]);

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

  const formattedDate = format(new Date(event.dateTime), "M/d/yyyy");
  const formattedTime = format(new Date(event.dateTime), "h:mm a");

  const copyLink = async () => {
    await navigator.clipboard.writeText(event.url);
    setCopiedLink(true);
    toast({
      title: "Link copied!",
      description: "Event link has been copied to clipboard"
    });
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const rsvpProgress = 0; // Mock data - will be replaced with real RSVP data later

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <div className="h-6 w-px bg-border" />
              <h1 className="text-xl font-semibold">{event.title}</h1>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant={event.isPaid ? "default" : "secondary"}>
                {event.isPaid ? (event.price ? `$${event.price}` : "Paid") : "Free"}
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
                    <CardTitle className="text-2xl mb-2">{event.title}</CardTitle>
                    <CardDescription className="text-base mb-4">{event.description}</CardDescription>
                    
                    <div className="flex flex-wrap gap-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <Instagram className="h-4 w-4 text-pink-500" />
                        <span>{event.platform}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4" />
                        <span>{formattedDate}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4" />
                        <span>{formattedTime}</span>
                      </div>
                    </div>
                  </div>
                  
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="text-center p-3 bg-primary/10 rounded-lg">
                    <Calendar className="h-6 w-6 text-primary mx-auto mb-1" />
                    <div className="text-xl font-bold">{event.isPublic ? 'Public' : 'Private'}</div>
                    <div className="text-xs text-muted-foreground">Visibility</div>
                  </div>
                  
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <Sparkles className="h-6 w-6 text-muted-foreground mx-auto mb-1" />
                    <div className="text-xl font-bold">{event.isPaid ? 'Paid' : 'Free'}</div>
                    <div className="text-xs text-muted-foreground">Access Type</div>
                  </div>
                </div>
                
                {event.description && (
                  <div className="mb-4">
                    <div className="text-sm text-muted-foreground mb-2">Description</div>
                    <p className="text-sm">{event.description}</p>
                  </div>
                )}
                
                {event.accessDescription && (
                  <div className="mb-4">
                    <div className="text-sm text-muted-foreground mb-2">Access Details</div>
                    <p className="text-sm">{event.accessDescription}</p>
                  </div>
                )}
                
                <div className="flex items-center justify-end">
                  <Button onClick={copyLink} variant="outline">
                    {copiedLink ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                    {copiedLink ? 'Copied!' : 'Copy Event Link'}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Tabbed Content */}
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="details">📋 Event Details</TabsTrigger>
                <TabsTrigger value="settings">⚙️ Settings</TabsTrigger>
              </TabsList>

              {/* Event Details Tab */}
              <TabsContent value="details" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Event Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {event.includeReplay && (
                      <div className="flex items-center space-x-2 text-sm">
                        <Play className="h-4 w-4 text-primary" />
                        <span>Replay available after event</span>
                      </div>
                    )}
                    {event.offerWithSubscription && (
                      <div className="flex items-center space-x-2 text-sm">
                        <Crown className="h-4 w-4 text-yellow-500" />
                        <span>Available with subscription</span>
                      </div>
                    )}
                    {event.includePerks && event.perkDescription && (
                      <div>
                        <div className="text-sm font-medium mb-1">Perks Included:</div>
                        <p className="text-sm text-muted-foreground">{event.perkDescription}</p>
                      </div>
                    )}
                    {event.attendeeBenefits && Array.isArray(event.attendeeBenefits) && event.attendeeBenefits.length > 0 && (
                      <div>
                        <div className="text-sm font-medium mb-2">Attendee Benefits:</div>
                        <ul className="space-y-1">
                          {event.attendeeBenefits.map((benefit: any, i: number) => (
                            <li key={i} className="text-sm text-muted-foreground flex items-center space-x-2">
                              <Check className="h-3 w-3 text-primary" />
                              <span>{benefit}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Settings Tab */}
              <TabsContent value="settings" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Event Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-sm text-muted-foreground">
                      Event settings and management options will be available here.
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Post-Event Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full" variant="default">
                  <Play className="mr-2 h-4 w-4" />
                  Create New Event
                </Button>
                <Button className="w-full" variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Download Report
                </Button>
                <Button className="w-full" variant="outline">
                  <Mail className="mr-2 h-4 w-4" />
                  Thank You Message
                </Button>
                <Button className="w-full" variant="outline">
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Leave Notes
                </Button>
              </CardContent>
            </Card>

            {/* Event Status */}
            <Card>
              <CardHeader>
                <CardTitle>Event Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Platform</span>
                    <span className="text-sm font-medium">{event.platform}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Date</span>
                    <span className="text-sm font-medium">{formattedDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Time</span>
                    <span className="text-sm font-medium">{formattedTime}</span>
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