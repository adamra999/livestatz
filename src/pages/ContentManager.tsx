import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Calendar, FileText, Video, Image, Trash2, Edit, Eye } from "lucide-react";

const ContentManager = () => {
  const [contentItems, setContentItems] = useState([
    {
      id: "1",
      title: "Morning Workout Routine",
      type: "video",
      status: "published",
      platform: "Instagram",
      scheduledDate: "2024-01-15",
      views: 1200,
      engagement: "5.4%"
    },
    {
      id: "2", 
      title: "Healthy Breakfast Ideas",
      type: "post",
      status: "draft",
      platform: "TikTok",
      scheduledDate: "2024-01-16",
      views: 0,
      engagement: "0%"
    },
    {
      id: "3",
      title: "Weekly Motivation Quote",
      type: "image",
      status: "scheduled",
      platform: "Instagram",
      scheduledDate: "2024-01-17",
      views: 0,
      engagement: "0%"
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published": return "bg-green-500/10 text-green-600 border-green-500/20";
      case "scheduled": return "bg-blue-500/10 text-blue-600 border-blue-500/20";
      case "draft": return "bg-yellow-500/10 text-yellow-600 border-yellow-500/20";
      default: return "bg-gray-500/10 text-gray-600 border-gray-500/20";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "video": return <Video className="h-4 w-4" />;
      case "image": return <Image className="h-4 w-4" />;
      case "post": return <FileText className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Content Manager</h1>
            <p className="text-muted-foreground">Plan, schedule, and track your content across platforms</p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Content
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Content</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24</div>
              <p className="text-xs text-muted-foreground">+3 this week</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Scheduled</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-muted-foreground">Next 7 days</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Avg. Engagement</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">6.2%</div>
              <p className="text-xs text-muted-foreground">+0.8% vs last month</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">45.2K</div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>
        </div>

        {/* Content List */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Content</CardTitle>
            <CardDescription>Manage your content pipeline and track performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {contentItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-lg">
                      {getTypeIcon(item.type)}
                    </div>
                    <div>
                      <h3 className="font-medium">{item.title}</h3>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <span>{item.platform}</span>
                        <span>•</span>
                        <Calendar className="h-3 w-3" />
                        <span>{item.scheduledDate}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <Badge className={getStatusColor(item.status)}>
                      {item.status}
                    </Badge>
                    
                    <div className="text-right text-sm">
                      <div className="font-medium">{item.views.toLocaleString()} views</div>
                      <div className="text-muted-foreground">{item.engagement} engagement</div>
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ContentManager;