import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Users, TrendingUp, Zap, DollarSign, BarChart3, Crown, Sparkles } from "lucide-react";
import { HeroSection } from "@/components/landing/HeroSection";
import { FeatureGrid } from "@/components/landing/FeatureGrid";
import { StatsSection } from "@/components/landing/StatsSection";

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
      
      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="bg-gradient-hero p-12 rounded-2xl text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-black/20 rounded-2xl"></div>
            <div className="relative z-10">
              <h2 className="text-4xl font-bold mb-4">Ready to Level Up Your Creator Game?</h2>
              <p className="text-xl mb-8 opacity-90">Join thousands of creators who've transformed their content strategy</p>
              <Button 
                size="lg" 
                variant="secondary"
                className="bg-white text-primary hover:bg-white/90"
                onClick={() => setIsLoggedIn(true)}
              >
                Start Your Journey <Sparkles className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

// Mock Dashboard Component
const Dashboard = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Crown className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              CreatorFlow
            </span>
          </div>
          
          <div className="flex items-center space-x-6">
            <Button variant="ghost" size="sm">Dashboard</Button>
            <Button variant="ghost" size="sm">Events</Button>
            <Button variant="ghost" size="sm">Analytics</Button>
            <Button variant="ghost" size="sm">Calendar</Button>
            <Button variant="outline" size="sm">Profile</Button>
          </div>
        </div>
      </nav>

      {/* Dashboard Content */}
      <div className="container mx-auto px-4 py-8">
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
                  <div className="text-center p-4 bg-creator-purple/10 rounded-lg">
                    <Users className="h-8 w-8 text-creator-purple mx-auto mb-2" />
                    <div className="text-2xl font-bold">2.4K</div>
                    <div className="text-sm text-muted-foreground">Total RSVPs</div>
                  </div>
                  <div className="text-center p-4 bg-creator-blue/10 rounded-lg">
                    <Calendar className="h-8 w-8 text-creator-blue mx-auto mb-2" />
                    <div className="text-2xl font-bold">12</div>
                    <div className="text-sm text-muted-foreground">Live Events</div>
                  </div>
                  <div className="text-center p-4 bg-creator-pink/10 rounded-lg">
                    <TrendingUp className="h-8 w-8 text-creator-pink mx-auto mb-2" />
                    <div className="text-2xl font-bold">78%</div>
                    <div className="text-sm text-muted-foreground">Show Rate</div>
                  </div>
                  <div className="text-center p-4 bg-creator-yellow/10 rounded-lg">
                    <DollarSign className="h-8 w-8 text-creator-yellow mx-auto mb-2" />
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
                <Button className="w-full" variant="default">
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
      </div>
    </div>
  );
};

export default Index;