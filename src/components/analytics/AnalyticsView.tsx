import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Area, AreaChart } from 'recharts';
import { Calendar, Users, DollarSign, TrendingUp, Eye, Heart, MessageCircle, Target, Activity, Clock } from "lucide-react";
import { format, startOfWeek, endOfWeek, eachWeekOfInterval, eachMonthOfInterval, startOfMonth, endOfMonth } from "date-fns";

// Analytics data for July-August 2024
const analyticsData = {
  weeklyEvents: [
    { week: 'Jul 1-7', events: 3, revenue: 6246, rsvps: 1198 },
    { week: 'Jul 8-14', events: 3, revenue: 9988, rsvps: 1360 },
    { week: 'Jul 15-21', events: 2, revenue: 7743, rsvps: 623 },
    { week: 'Jul 22-28', events: 2, revenue: 13350, rsvps: 823 },
    { week: 'Jul 29-Aug 4', events: 3, revenue: 16779, rsvps: 1568 },
    { week: 'Aug 5-11', events: 2, revenue: 2736, rsvps: 1580 },
    { week: 'Aug 12-18', events: 3, revenue: 6182, rsvps: 1135 },
    { week: 'Aug 19-25', events: 2, revenue: 20840, rsvps: 1067 },
    { week: 'Aug 26-Sep 1', events: 2, revenue: 3204, rsvps: 1159 }
  ],
  monthlyEvents: [
    { month: 'July 2024', events: 11, revenue: 48327, rsvps: 4393, avgViews: 2845 },
    { month: 'August 2024', events: 13, revenue: 49761, rsvps: 5509, avgViews: 3125 }
  ],
  platformStats: [
    { platform: 'Instagram Live', events: 10, rsvps: 3574, revenue: 24940, color: '#E1306C' },
    { platform: 'YouTube Live', events: 6, rsvps: 2300, revenue: 41275, color: '#FF0000' },
    { platform: 'LinkedIn Live', events: 3, rsvps: 2089, revenue: 41245, color: '#0077B5' },
    { platform: 'TikTok Live', events: 3, rsvps: 1493, revenue: 0, color: '#000000' },
    { platform: 'Twitch', events: 2, rsvps: 2413, revenue: 0, color: '#9146FF' }
  ],
  topEvents: [
    { title: 'Investment Strategies 2024', rsvps: 692, revenue: 20760, platform: 'YouTube Live', engagement: 95 },
    { title: 'E-commerce Masterclass', rsvps: 678, revenue: 16950, platform: 'LinkedIn Live', engagement: 88 },
    { title: 'Business Strategy Session', rsvps: 534, revenue: 13350, platform: 'YouTube Live', engagement: 92 },
    { title: 'Tech Talk: AI Future', rsvps: 623, revenue: 12460, platform: 'LinkedIn Live', engagement: 87 },
    { title: 'Cooking with Gordon', rsvps: 892, revenue: 8920, platform: 'Instagram Live', engagement: 94 }
  ],
  engagementMetrics: [
    { date: 'Jul 1', views: 2340, engagement: 78, monetization: 156 },
    { date: 'Jul 8', views: 3120, engagement: 82, monetization: 234 },
    { date: 'Jul 15', views: 2890, engagement: 75, monetization: 189 },
    { date: 'Jul 22', views: 3456, engagement: 88, monetization: 287 },
    { date: 'Jul 29', views: 3780, engagement: 91, monetization: 312 },
    { date: 'Aug 5', views: 2960, engagement: 79, monetization: 198 },
    { date: 'Aug 12', views: 3240, engagement: 84, monetization: 245 },
    { date: 'Aug 19', views: 3890, engagement: 93, monetization: 356 },
    { date: 'Aug 26', views: 3120, engagement: 86, monetization: 267 }
  ]
};

export const AnalyticsView = () => {
  const totalStats = {
    totalEvents: 24,
    totalRSVPs: 9902,
    totalRevenue: 98088,
    avgEngagement: 85.2,
    totalViews: 147856
  };

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
            {/* Weekly Events Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Events Per Week</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analyticsData.weeklyEvents}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="events" fill="hsl(var(--primary))" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Monthly Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Monthly Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={analyticsData.monthlyEvents}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.3} />
                  </AreaChart>
                </ResponsiveContainer>
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Platform Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Events by Platform</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={analyticsData.platformStats}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="events"
                      label={({ platform, events }) => `${platform}: ${events}`}
                    >
                      {analyticsData.platformStats.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Platform Performance */}
            <Card>
              <CardHeader>
                <CardTitle>Platform Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analyticsData.platformStats} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="platform" type="category" width={100} />
                    <Tooltip />
                    <Bar dataKey="revenue" fill="hsl(var(--primary))" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Platform Details */}
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
              <CardTitle>Engagement Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={analyticsData.engagementMetrics}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="views" stroke="#8884d8" strokeWidth={2} name="Views" />
                  <Line type="monotone" dataKey="engagement" stroke="#82ca9d" strokeWidth={2} name="Engagement %" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Monetization Tab */}
        <TabsContent value="monetization" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Trends */}
            <Card>
              <CardHeader>
                <CardTitle>Revenue Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={analyticsData.weeklyEvents}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.3} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Monetization Rate */}
            <Card>
              <CardHeader>
                <CardTitle>Monetization Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={analyticsData.engagementMetrics}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="monetization" stroke="#ff7300" strokeWidth={2} name="Monetization Score" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Revenue Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Revenue by Event Type</CardTitle>
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