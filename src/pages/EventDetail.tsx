import { useState } from "react";
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

// Mock event data - in real app, this would come from API
const mockEventData = {
  id: "abc123",
  title: "Team Building Workshop",
  description: "Join us for an interactive team building session with fun activities and networking opportunities.",
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
    revenue: 2940.50
  },
  rsvps: [
    { name: "John Smith", email: "john@example.com", source: "Instagram Story", rsvpType: "Yes" },
    { name: "Emma Wilson", email: "emma@example.com", source: "Direct Link", rsvpType: "Maybe" },
    { name: "Mike Johnson", email: "mike@example.com", source: "TikTok Post", rsvpType: "Yes" }
  ],
  hypeContent: [
    { 
      date: "8/12/2025", 
      type: "Instagram Reel", 
      views: 12500, 
      likes: 567, 
      shares: 89, 
      hasCTA: true,
      link: "https://instagram.com/p/abc"
    },
    { 
      date: "8/13/2025", 
      type: "TikTok Video", 
      views: 8900, 
      likes: 234, 
      shares: 45, 
      hasCTA: true,
      link: "https://tiktok.com/@user/video/123"
    }
  ],
  monetization: {
    tipRevenue: 450.00,
    ticketRevenue: 2490.50,
    merchRevenue: 0,
    clickThroughRate: 12.5,
    payoutStatus: "Pending"
  }
};

export default function EventDetail() {
  const { eventId } = useParams();
  const { toast } = useToast();
  const [copiedLink, setCopiedLink] = useState(false);
  
  const event = mockEventData; // In real app: fetch event by eventId

  const copyLink = async () => {
    await navigator.clipboard.writeText(event.liveLink);
    setCopiedLink(true);
    toast({
      title: "Link copied!",
      description: "Event link has been copied to clipboard"
    });
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const rsvpProgress = (event.rsvpCount / event.rsvpGoal) * 100;

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
                    <CardTitle className="text-2xl mb-2">{event.title}</CardTitle>
                    <CardDescription className="text-base mb-4">{event.description}</CardDescription>
                    
                    <div className="flex flex-wrap gap-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <Instagram className="h-4 w-4 text-pink-500" />
                        <span>{event.platform}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4" />
                        <span>{event.date}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Crown className="h-4 w-4" />
                        <span>by {event.organizer}</span>
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
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center p-3 bg-primary/10 rounded-lg">
                    <Users className="h-6 w-6 text-primary mx-auto mb-1" />
                    <div className="text-xl font-bold">{event.rsvpCount}</div>
                    <div className="text-xs text-muted-foreground">RSVPs</div>
                  </div>
                  
                  <div className="text-center p-3 bg-secondary/10 rounded-lg">
                    <Target className="h-6 w-6 text-secondary-foreground mx-auto mb-1" />
                    <div className="text-xl font-bold">{Math.round(rsvpProgress)}%</div>
                    <div className="text-xs text-muted-foreground">of Goal</div>
                  </div>
                  
                  <div className="text-center p-3 bg-accent/10 rounded-lg">
                    <DollarSign className="h-6 w-6 text-accent-foreground mx-auto mb-1" />
                    <div className="text-xl font-bold">${event.monetization.ticketRevenue.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">Revenue</div>
                  </div>
                  
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <Sparkles className="h-6 w-6 text-muted-foreground mx-auto mb-1" />
                    <div className="text-xl font-bold">{event.monetizationEnabled ? 'Yes' : 'No'}</div>
                    <div className="text-xs text-muted-foreground">Monetized</div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">RSVP Progress</div>
                    <Progress value={rsvpProgress} className="w-48" />
                  </div>
                  
                  <Button onClick={copyLink} variant="outline">
                    {copiedLink ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                    {copiedLink ? 'Copied!' : 'Copy Link'}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Tabbed Content */}
            <Tabs defaultValue="analytics" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="analytics">📈 Analytics</TabsTrigger>
                <TabsTrigger value="rsvps">👥 RSVPs</TabsTrigger>
                <TabsTrigger value="hype">📣 Hype Content</TabsTrigger>
                <TabsTrigger value="monetization">💸 Revenue</TabsTrigger>
              </TabsList>

              {/* Live Analytics Tab */}
              <TabsContent value="analytics" className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-4 text-center">
                      <Eye className="h-8 w-8 text-primary mx-auto mb-2" />
                      <div className="text-2xl font-bold">{event.analytics.totalViews.toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground">Total Views</div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4 text-center">
                      <Users className="h-8 w-8 text-secondary-foreground mx-auto mb-2" />
                      <div className="text-2xl font-bold">{event.analytics.peakConcurrent}</div>
                      <div className="text-sm text-muted-foreground">Peak Concurrent</div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4 text-center">
                      <Heart className="h-8 w-8 text-red-500 mx-auto mb-2" />
                      <div className="text-2xl font-bold">{event.analytics.likes}</div>
                      <div className="text-sm text-muted-foreground">Likes/Hearts</div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4 text-center">
                      <Share2 className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                      <div className="text-2xl font-bold">{event.analytics.shares}</div>
                      <div className="text-sm text-muted-foreground">Shares</div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4 text-center">
                      <TrendingUp className="h-8 w-8 text-green-500 mx-auto mb-2" />
                      <div className="text-2xl font-bold">+{event.analytics.newFollowers}</div>
                      <div className="text-sm text-muted-foreground">New Followers</div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4 text-center">
                      <DollarSign className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                      <div className="text-2xl font-bold">${event.analytics.revenue.toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground">Total Revenue</div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* RSVP Management Tab */}
              <TabsContent value="rsvps" className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">RSVP Management</h3>
                    <p className="text-sm text-muted-foreground">
                      {event.rsvpCount} total RSVPs • {Math.round(rsvpProgress)}% of goal reached
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Export CSV
                    </Button>
                    <Button variant="outline" size="sm">
                      <Mail className="h-4 w-4 mr-2" />
                      Send Reminder
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  {event.rsvps.map((rsvp, i) => (
                    <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">{rsvp.name}</div>
                        <div className="text-sm text-muted-foreground">{rsvp.email}</div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Badge variant="outline">{rsvp.source}</Badge>
                        <Badge variant={rsvp.rsvpType === 'Yes' ? 'default' : 'secondary'}>
                          {rsvp.rsvpType}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              {/* Hype Content Tab */}
              <TabsContent value="hype" className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Hype Content Tracker</h3>
                  <div className="space-y-4">
                    {event.hypeContent.map((content, i) => (
                      <Card key={i}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className="flex flex-col">
                                <div className="font-medium">{content.type}</div>
                                <div className="text-sm text-muted-foreground">{content.date}</div>
                              </div>
                              {content.hasCTA && (
                                <Badge variant="outline" className="text-green-600 border-green-600">
                                  ✓ CTA Included
                                </Badge>
                              )}
                            </div>
                            
                            <div className="flex items-center space-x-6 text-sm">
                              <div className="text-center">
                                <div className="font-medium">{content.views.toLocaleString()}</div>
                                <div className="text-muted-foreground">Views</div>
                              </div>
                              <div className="text-center">
                                <div className="font-medium">{content.likes}</div>
                                <div className="text-muted-foreground">Likes</div>
                              </div>
                              <div className="text-center">
                                <div className="font-medium">{content.shares}</div>
                                <div className="text-muted-foreground">Shares</div>
                              </div>
                              <Button variant="ghost" size="sm" asChild>
                                <a href={content.link} target="_blank" rel="noopener noreferrer">
                                  <ExternalLink className="h-4 w-4" />
                                </a>
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </TabsContent>

              {/* Monetization Tab */}
              <TabsContent value="monetization" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Revenue Breakdown</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between">
                        <span>Ticket Sales</span>
                        <span className="font-medium">${event.monetization.ticketRevenue}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tips & Donations</span>
                        <span className="font-medium">${event.monetization.tipRevenue}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Merchandise</span>
                        <span className="font-medium">${event.monetization.merchRevenue}</span>
                      </div>
                      <div className="border-t pt-2 flex justify-between font-semibold">
                        <span>Total Revenue</span>
                        <span>${(event.monetization.ticketRevenue + event.monetization.tipRevenue + event.monetization.merchRevenue).toFixed(2)}</span>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Performance Metrics</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between">
                        <span>Click-through Rate</span>
                        <span className="font-medium">{event.monetization.clickThroughRate}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Conversion Rate</span>
                        <span className="font-medium">8.2%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Payout Status</span>
                        <Badge variant="secondary">{event.monetization.payoutStatus}</Badge>
                      </div>
                    </CardContent>
                  </Card>
                </div>
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
                    <span className="text-sm">Status</span>
                    <Badge variant={event.isLive ? "destructive" : "secondary"}>
                      {event.isLive ? "Live" : "Scheduled"}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Attendance Rate</span>
                    <span className="text-sm font-medium">78%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Platform</span>
                    <span className="text-sm font-medium">{event.platform}</span>
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