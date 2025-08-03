import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Users, TrendingUp, Zap, DollarSign, BarChart3, Crown, Sparkles, Copy, Check, Share2, ExternalLink } from "lucide-react";
import { HeroSection } from "@/components/landing/HeroSection";
import { FeatureGrid } from "@/components/landing/FeatureGrid";
import { StatsSection } from "@/components/landing/StatsSection";
import { CalendarView } from "@/components/calendar/CalendarView";
import { AnalyticsView } from "@/components/analytics/AnalyticsView";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";

const Index = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  if (isLoggedIn) {
    return <Dashboard />;
  }

  return (
    <div className="min-h-screen bg-background">
      <HeroSection onGetStarted={() => setIsLoggedIn(true)} />
      <FeatureGrid />
      <StatsSection />
      
      {/* Simple CTA Section */}
      <section className="py-24 px-6">
        <div className="container mx-auto text-center">
          <div className="bg-primary/5 border border-primary/10 p-12 rounded-2xl max-w-2xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-foreground">Ready to organize your creator workflow?</h2>
            <p className="text-muted-foreground mb-8">Join thousands of creators who've streamlined their content planning</p>
            <Button 
              size="lg" 
              className="bg-primary text-primary-foreground hover:bg-primary/90 font-medium"
              onClick={() => setIsLoggedIn(true)}
            >
              Try LiveStatz - It's Free
            </Button>
            <p className="text-xs text-muted-foreground mt-4">No credit card required</p>
          </div>
        </div>
      </section>
      <Toaster />
    </div>
  );
};

// Mock Dashboard Component
const Dashboard = () => {
  const [showEventForm, setShowEventForm] = useState(false);
  const [showSuccessPage, setShowSuccessPage] = useState(false);
  const [createdEvent, setCreatedEvent] = useState<any>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [currentView, setCurrentView] = useState<'dashboard' | 'calendar' | 'analytics'>('dashboard');
  const { toast } = useToast();
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Crown className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              LiveStatz
            </span>
          </div>
          
          <div className="flex items-center space-x-6">
            <Button 
              variant={currentView === 'dashboard' ? 'default' : 'ghost'} 
              size="sm"
              onClick={() => setCurrentView('dashboard')}
            >
              Dashboard
            </Button>
            <Button variant="ghost" size="sm">Events</Button>
            <Button 
              variant={currentView === 'analytics' ? 'default' : 'ghost'} 
              size="sm"
              onClick={() => setCurrentView('analytics')}
            >
              Analytics
            </Button>
            <Button 
              variant={currentView === 'calendar' ? 'default' : 'ghost'} 
              size="sm"
              onClick={() => setCurrentView('calendar')}
            >
              Calendar
            </Button>
            <Button variant="outline" size="sm">Profile</Button>
          </div>
        </div>
      </nav>

      {/* Dashboard Content */}
      <div className="container mx-auto px-4 py-8">
        {currentView === 'calendar' ? (
          <CalendarView />
        ) : currentView === 'analytics' ? (
          <>
            {console.log('Rendering Analytics View')}
            <AnalyticsView />
          </>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
            {/* Welcome Section */}
            <Card className="bg-gradient-card border-0 shadow-creator">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl">Welcome back, Creator! 🚀</CardTitle>
                    <CardDescription>Here's what's happening with your content</CardDescription>
                  </div>
                  <Badge variant="outline" className="bg-primary text-primary-foreground">Pro Plan</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-primary/10 rounded-lg">
                    <Users className="h-8 w-8 text-primary mx-auto mb-2" />
                    <div className="text-2xl font-bold">2.4K</div>
                    <div className="text-sm text-muted-foreground">Total RSVPs</div>
                  </div>
                  <div className="text-center p-4 bg-primary/10 rounded-lg">
                    <Calendar className="h-8 w-8 text-primary mx-auto mb-2" />
                    <div className="text-2xl font-bold">12</div>
                    <div className="text-sm text-muted-foreground">Live Events</div>
                  </div>
                  <div className="text-center p-4 bg-secondary/10 rounded-lg">
                    <TrendingUp className="h-8 w-8 text-secondary-foreground mx-auto mb-2" />
                    <div className="text-2xl font-bold">78%</div>
                    <div className="text-sm text-muted-foreground">Show Rate</div>
                  </div>
                  <div className="text-center p-4 bg-accent/10 rounded-lg">
                    <DollarSign className="h-8 w-8 text-accent-foreground mx-auto mb-2" />
                    <div className="text-2xl font-bold">$1.2K</div>
                    <div className="text-sm text-muted-foreground">Revenue</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Events */}
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Live Events</CardTitle>
                <CardDescription>Your scheduled sessions and RSVPs</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { title: "Morning Workout Session", time: "Today, 9:00 AM", rsvps: 156, platform: "Instagram" },
                    { title: "Gaming Stream Q&A", time: "Tomorrow, 7:00 PM", rsvps: 89, platform: "TikTok" },
                    { title: "Fashion Haul & Tips", time: "Friday, 3:00 PM", rsvps: 203, platform: "YouTube" }
                  ].map((event, i) => (
                    <div key={i} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div>
                        <h4 className="font-semibold">{event.title}</h4>
                        <p className="text-sm text-muted-foreground">{event.time} • {event.platform}</p>
                      </div>
                      <div className="text-right">
                        <Badge variant="secondary">{event.rsvps} RSVPs</Badge>
                      </div>
                    </div>
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
                  onClick={() => setShowEventForm(true)}
                >
                  <Zap className="mr-2 h-4 w-4" />
                  Create Live Event
                </Button>
                <Button className="w-full" variant="outline">
                  <Calendar className="mr-2 h-4 w-4" />
                  Schedule Content
                </Button>
                <Button className="w-full" variant="outline">
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
                      <div className="bg-primary h-2 rounded-full" style={{ width: '78%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Engagement Rate</span>
                      <span>92%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-secondary h-2 rounded-full" style={{ width: '92%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Revenue Growth</span>
                      <span>156%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-accent h-2 rounded-full" style={{ width: '100%' }}></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        )}
      </div>

      {/* Enhanced Create Event Modal */}
      {showEventForm && <CreateEventModal />}

      {/* Success Page */}
      {showSuccessPage && createdEvent && <EventSuccessPage />}
    </div>
  );

  function CreateEventModal() {
    const [formData, setFormData] = useState({
      title: '',
      platform: 'Instagram Live',
      dateTime: '',
      description: '',
      isPaid: false,
      price: '',
      accessDescription: '',
      includeReplay: false,
      includePerks: false,
      perkDescription: '',
      offerWithSubscription: false
    });

    const handleCreateEvent = async () => {
      if (!formData.title || !formData.dateTime) {
        toast({
          title: "Error",
          description: "Please fill in all required fields",
          variant: "destructive",
        });
        return;
      }

      setIsCreating(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const eventId = Math.random().toString(36).substring(2, 8);
      const eventUrl = `https://livestatz.com/e/${eventId}`;
      
      const event = {
        id: eventId,
        url: eventUrl,
        ...formData,
        createdAt: new Date().toISOString()
      };
      
      setCreatedEvent(event);
      setIsCreating(false);
      setShowEventForm(false);
      setShowSuccessPage(true);
      
      toast({
        title: "Event Created!",
        description: "Your live event has been successfully created",
      });
    };

    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
        <div className="bg-card rounded-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
          <h3 className="text-2xl font-bold mb-6">Create Live Event</h3>
          
          <div className="space-y-6">
            {/* Basic Event Info */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Event Title *</label>
                <input 
                  type="text" 
                  className="w-full p-3 border rounded-lg bg-background"
                  placeholder="e.g., Morning Workout Session"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Platform</label>
                <select 
                  className="w-full p-3 border rounded-lg bg-background"
                  value={formData.platform}
                  onChange={(e) => setFormData({...formData, platform: e.target.value})}
                >
                  <option>Instagram Live</option>
                  <option>TikTok Live</option>
                  <option>YouTube Live</option>
                  <option>Twitter Spaces</option>
                  <option>Twitch</option>
                  <option>Discord</option>
                  <option>Facebook Live</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Date & Time *</label>
                <input 
                  type="datetime-local" 
                  className="w-full p-3 border rounded-lg bg-background"
                  value={formData.dateTime}
                  onChange={(e) => setFormData({...formData, dateTime: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Event Description</label>
                <textarea 
                  className="w-full p-3 border rounded-lg bg-background h-24"
                  placeholder="What will you be sharing with your audience?"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
              </div>
            </div>

            {/* Payment Section */}
            <div className="border-t pt-6">
              <div className="flex items-center justify-between mb-4">
                <label className="text-sm font-medium">Event Type</label>
                <div className="flex items-center space-x-3">
                  <span className={!formData.isPaid ? 'text-primary font-medium' : 'text-muted-foreground'}>
                    🆓 Free
                  </span>
                  <button
                    type="button"
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      formData.isPaid ? 'bg-yellow-500' : 'bg-muted'
                    }`}
                    onClick={() => setFormData({...formData, isPaid: !formData.isPaid, price: '', accessDescription: ''})}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      formData.isPaid ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                  <span className={formData.isPaid ? 'text-yellow-600 font-medium' : 'text-muted-foreground'}>
                    💰 Paid
                  </span>
                </div>
              </div>

              {formData.isPaid && (
                <div className="space-y-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div>
                    <label className="block text-sm font-medium mb-2">Ticket Price (USD)</label>
                    <div className="relative">
                      <span className="absolute left-3 top-3 text-muted-foreground">$</span>
                      <input 
                        type="number" 
                        step="0.01"
                        className="w-full pl-8 p-3 border rounded-lg bg-background"
                        placeholder="9.99"
                        value={formData.price}
                        onChange={(e) => setFormData({...formData, price: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">What will attendees get?</label>
                    <textarea 
                      className="w-full p-3 border rounded-lg bg-background h-20"
                      placeholder="Live Q&A, exclusive tips, downloadable resources..."
                      value={formData.accessDescription}
                      onChange={(e) => setFormData({...formData, accessDescription: e.target.value})}
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="flex items-center space-x-2">
                      <input 
                        type="checkbox" 
                        checked={formData.includeReplay}
                        onChange={(e) => setFormData({...formData, includeReplay: e.target.checked})}
                      />
                      <span className="text-sm">Include 48hr replay access</span>
                    </label>
                    
                    <label className="flex items-center space-x-2">
                      <input 
                        type="checkbox"
                        checked={formData.includePerks}
                        onChange={(e) => setFormData({...formData, includePerks: e.target.checked, perkDescription: ''})}
                      />
                      <span className="text-sm">Include downloadable perks</span>
                    </label>
                    
                    {formData.includePerks && (
                      <input 
                        type="text" 
                        className="w-full ml-6 p-2 border rounded bg-background text-sm"
                        placeholder="PDF guide, audio replay, exclusive content..."
                        value={formData.perkDescription}
                        onChange={(e) => setFormData({...formData, perkDescription: e.target.value})}
                      />
                    )}
                    
                    <label className="flex items-center space-x-2">
                      <input 
                        type="checkbox"
                        checked={formData.offerWithSubscription}
                        onChange={(e) => setFormData({...formData, offerWithSubscription: e.target.checked})}
                      />
                      <span className="text-sm">Offer free with subscription</span>
                    </label>
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-4">
              <Button 
                onClick={() => setShowEventForm(false)}
                variant="outline"
                className="flex-1"
                disabled={isCreating}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleCreateEvent}
                className="flex-1"
                disabled={isCreating}
              >
                {isCreating ? "Creating..." : "Create Event"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
        twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}`,
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(createdEvent.url)}`,
        linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(createdEvent.url)}`,
        discord: createdEvent.url, // Copy for Discord
        instagram: createdEvent.url, // Copy for Instagram  
        x: `https://x.com/intent/tweet?text=${encodeURIComponent(message)}`,
        twitch: createdEvent.url // Copy for Twitch
      };

      if (platform === 'discord' || platform === 'instagram' || platform === 'twitch') {
        copyToClipboard(message);
      } else {
        window.open(urls[platform as keyof typeof urls], '_blank');
      }
    };

    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
        <div className="bg-card rounded-xl max-w-4xl w-full p-8 max-h-[90vh] overflow-y-auto">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold mb-2">Event Created Successfully!</h2>
            <p className="text-muted-foreground">Your live event is ready to share with your audience</p>
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
                {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          {/* Event Details Preview */}
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="font-semibold mb-4">Event Details</h3>
              <div className="space-y-3 text-sm">
                <div><strong>Title:</strong> {createdEvent.title}</div>
                <div><strong>Platform:</strong> {createdEvent.platform}</div>
                <div><strong>Date:</strong> {new Date(createdEvent.dateTime).toLocaleDateString()}</div>
                <div><strong>Time:</strong> {new Date(createdEvent.dateTime).toLocaleTimeString()}</div>
                {createdEvent.isPaid && (
                  <>
                    <div className="flex items-center gap-2">
                      <strong>Price:</strong> 
                      <Badge className="bg-yellow-100 text-yellow-800">${createdEvent.price}</Badge>
                    </div>
                    {createdEvent.includeReplay && <Badge variant="outline">48hr Replay</Badge>}
                    {createdEvent.includePerks && <Badge variant="outline">Downloadable Perks</Badge>}
                    {createdEvent.offerWithSubscription && <Badge variant="outline">Free with Subscription</Badge>}
                  </>
                )}
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Share on Social Media</h3>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { name: 'Twitter', key: 'twitter', icon: '🐦' },
                  { name: 'Facebook', key: 'facebook', icon: '📘' },
                  { name: 'LinkedIn', key: 'linkedin', icon: '💼' },
                  { name: 'Instagram', key: 'instagram', icon: '📸' },
                  { name: 'Discord', key: 'discord', icon: '🎮' },
                  { name: 'X', key: 'x', icon: '✖️' },
                  { name: 'Twitch', key: 'twitch', icon: '🎯' }
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
                Instagram, Discord & Twitch will copy the message to your clipboard
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

export default Index;