import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Users, DollarSign, TrendingUp, Eye, Heart, MessageCircle, Target, Activity, Clock } from "lucide-react";
import { useEvents } from "@/hooks/useEvents";
import { useRsvps } from "@/hooks/useRsvps";
import { startOfWeek, endOfWeek, format, parseISO } from "date-fns";

export const AnalyticsView = () => {
  const { events: dbEvents, loading } = useEvents();
  const { fetchRsvpCountByEvent } = useRsvps();
  
  const [rsvpCounts, setRsvpCounts] = useState<Record<string, number>>({});
  const [analyticsData, setAnalyticsData] = useState<any>(null);

  // Fetch RSVP counts for all events
  useEffect(() => {
    const loadRsvpCounts = async () => {
      if (!dbEvents || dbEvents.length === 0) return;
      
      const counts: Record<string, number> = {};
      await Promise.all(
        dbEvents.map(async (event) => {
          const result = await fetchRsvpCountByEvent(event.id);
          counts[event.id] = result.count;
        })
      );
      setRsvpCounts(counts);
    };

    loadRsvpCounts();
  }, [dbEvents, fetchRsvpCountByEvent]);

  // Calculate analytics from real data
  useEffect(() => {
    if (!dbEvents || Object.keys(rsvpCounts).length === 0) return;

    // Map events with RSVP counts and revenue
    const eventsWithStats = dbEvents.map((e) => {
      const rsvpCount = rsvpCounts[e.id] || 0;
      const price = e.ticketPrice ? parseFloat(e.ticketPrice) : 0;
      const revenue = e.isPaid ? rsvpCount * price : 0;
      
      return {
        ...e,
        rsvps: rsvpCount,
        revenue: revenue,
        price: price,
      };
    });

    // Group events by week
    const weeklyMap = new Map<string, { events: number; revenue: number; rsvps: number }>();
    eventsWithStats.forEach((e) => {
      const eventDate = parseISO(e.dateTime);
      const weekStart = startOfWeek(eventDate);
      const weekEnd = endOfWeek(eventDate);
      const weekKey = `${format(weekStart, 'MMM d')}-${format(weekEnd, 'd')}`;
      
      const existing = weeklyMap.get(weekKey) || { events: 0, revenue: 0, rsvps: 0 };
      weeklyMap.set(weekKey, {
        events: existing.events + 1,
        revenue: existing.revenue + e.revenue,
        rsvps: existing.rsvps + e.rsvps,
      });
    });

    const weeklyEvents = Array.from(weeklyMap.entries()).map(([week, data]) => ({
      week,
      ...data,
    }));

    // Group by platform
    const platformMap = new Map<string, { events: number; rsvps: number; revenue: number }>();
    eventsWithStats.forEach((e) => {
      const existing = platformMap.get(e.platform) || { events: 0, rsvps: 0, revenue: 0 };
      platformMap.set(e.platform, {
        events: existing.events + 1,
        rsvps: existing.rsvps + e.rsvps,
        revenue: existing.revenue + e.revenue,
      });
    });

    const platformColors: Record<string, string> = {
      'Instagram Live': '#E1306C',
      'YouTube Live': '#FF0000',
      'LinkedIn Live': '#0077B5',
      'TikTok Live': '#000000',
      'Twitch': '#9146FF',
    };

    const platformStats = Array.from(platformMap.entries()).map(([platform, data]) => ({
      platform,
      ...data,
      color: platformColors[platform] || '#666666',
    }));

    // Top events by revenue
    const topEvents = [...eventsWithStats]
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5)
      .map((e) => ({
        title: e.title,
        rsvps: e.rsvps,
        revenue: e.revenue,
        platform: e.platform,
        engagement: Math.floor(Math.random() * 15) + 80, // Mock engagement for now
      }));

    setAnalyticsData({
      weeklyEvents,
      platformStats,
      topEvents,
    });
  }, [dbEvents, rsvpCounts]);

  const totalStats = analyticsData
    ? {
        totalEvents: dbEvents?.length || 0,
        totalRSVPs: Object.values(rsvpCounts).reduce((sum, count) => sum + count, 0),
        totalRevenue: dbEvents?.reduce((sum, e) => {
          const rsvpCount = rsvpCounts[e.id] || 0;
          const price = e.ticketPrice ? parseFloat(e.ticketPrice) : 0;
          return sum + (e.isPaid ? rsvpCount * price : 0);
        }, 0) || 0,
        avgEngagement: 85.2, // Mock for now
        totalViews: 147856, // Mock for now
      }
    : {
        totalEvents: 0,
        totalRSVPs: 0,
        totalRevenue: 0,
        avgEngagement: 0,
        totalViews: 0,
      };

  if (loading || !analyticsData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="text-lg text-muted-foreground">Loading analytics...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Total Events</p>
                <p className="text-2xl font-bold">{totalStats.totalEvents}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Total RSVPs</p>
                <p className="text-2xl font-bold">{totalStats.totalRSVPs.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-4 w-4 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold">${totalStats.totalRevenue.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Eye className="h-4 w-4 text-purple-500" />
              <div>
                <p className="text-sm text-muted-foreground">Total Views</p>
                <p className="text-2xl font-bold">{totalStats.totalViews.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-orange-500" />
              <div>
                <p className="text-sm text-muted-foreground">Avg Engagement</p>
                <p className="text-2xl font-bold">{totalStats.avgEngagement}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="platforms">Platforms</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
          <TabsTrigger value="monetization">Monetization</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Weekly Events Chart - Temporarily using table */}
            <Card>
              <CardHeader>
                <CardTitle>Events Per Week</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {analyticsData.weeklyEvents.map((week, index) => (
                    <div key={index} className="flex justify-between p-2 border rounded">
                      <span className="text-sm">{week.week}</span>
                      <div className="text-right">
                        <div className="font-medium">{week.events} events</div>
                        <div className="text-xs text-muted-foreground">${week.revenue.toLocaleString()}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Platform Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Platform Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analyticsData.platformStats.map((platform, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: platform.color }}
                        />
                        <span className="font-medium">{platform.platform}</span>
                      </div>
                      <div className="text-right text-sm">
                        <div>{platform.events} events</div>
                        <div className="text-muted-foreground">{platform.rsvps} RSVPs</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Top Performing Events */}
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.topEvents.map((event, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium">{event.title}</h4>
                      <div className="flex items-center space-x-4 mt-1">
                        <Badge variant="outline">{event.platform}</Badge>
                        <span className="text-sm text-muted-foreground flex items-center">
                          <Users className="h-3 w-3 mr-1" />
                          {event.rsvps} RSVPs
                        </span>
                        <span className="text-sm text-muted-foreground flex items-center">
                          <Heart className="h-3 w-3 mr-1" />
                          {event.engagement}% engagement
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-green-600">${event.revenue.toLocaleString()}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Platforms Tab */}
        <TabsContent value="platforms" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Platform Performance Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.platformStats.map((platform, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div 
                        className="w-4 h-4 rounded-full" 
                        style={{ backgroundColor: platform.color }}
                      />
                      <div>
                        <h4 className="font-medium">{platform.platform}</h4>
                        <p className="text-sm text-muted-foreground">{platform.events} events</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{platform.rsvps.toLocaleString()} RSVPs</div>
                      <div className="text-sm text-green-600">${platform.revenue.toLocaleString()}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Engagement Tab */}
        <TabsContent value="engagement" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Engagement Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <Eye className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-blue-600">{totalStats.totalViews.toLocaleString()}</div>
                  <div className="text-sm text-blue-700">Total Views</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <Heart className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-green-600">{totalStats.avgEngagement}%</div>
                  <div className="text-sm text-green-700">Avg Engagement</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <MessageCircle className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-purple-600">8.4K</div>
                  <div className="text-sm text-purple-700">Total Comments</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Monetization Tab */}
        <TabsContent value="monetization" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <DollarSign className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-green-600">$98,088</div>
                  <div className="text-sm text-green-700">Total Revenue</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <Target className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-blue-600">$4,087</div>
                  <div className="text-sm text-blue-700">Avg Revenue/Event</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <TrendingUp className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-purple-600">73%</div>
                  <div className="text-sm text-purple-700">Paid Event Rate</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};