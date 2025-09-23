import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageSquare, Heart, Share, Eye, Filter, TrendingUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Interaction {
  id: string;
  fan_name: string;
  fan_email: string;
  fan_avatar?: string;
  content: string;
  platform: string;
  sentiment: string;
  commented_at: string;
}

interface InteractionStats {
  total: number;
  positive: number;
  negative: number;
  neutral: number;
  platforms: { [key: string]: number };
}

const Interactions = () => {
  const [interactions, setInteractions] = useState<Interaction[]>([]);
  const [filteredInteractions, setFilteredInteractions] = useState<Interaction[]>([]);
  const [stats, setStats] = useState<InteractionStats>({
    total: 0,
    positive: 0,
    negative: 0,
    neutral: 0,
    platforms: {}
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [platformFilter, setPlatformFilter] = useState("all");
  const [sentimentFilter, setSentimentFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchInteractions();
  }, []);

  useEffect(() => {
    filterInteractions();
  }, [interactions, searchTerm, platformFilter, sentimentFilter]);

  const fetchInteractions = async () => {
    try {
      const { data, error } = await supabase
        .from('fan_comments')
        .select(`
          *,
          fans:fan_id (
            name,
            email,
            avatar_url
          )
        `)
        .order('commented_at', { ascending: false });

      if (error) throw error;

      const formattedInteractions = (data || []).map(comment => ({
        id: comment.id,
        fan_name: comment.fans?.name || 'Unknown Fan',
        fan_email: comment.fans?.email || '',
        fan_avatar: comment.fans?.avatar_url,
        content: comment.content,
        platform: comment.platform,
        sentiment: comment.sentiment,
        commented_at: comment.commented_at
      }));

      setInteractions(formattedInteractions);
      calculateStats(formattedInteractions);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch interactions",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (interactions: Interaction[]) => {
    const stats: InteractionStats = {
      total: interactions.length,
      positive: interactions.filter(i => i.sentiment === 'positive').length,
      negative: interactions.filter(i => i.sentiment === 'negative').length,
      neutral: interactions.filter(i => i.sentiment === 'neutral').length,
      platforms: {}
    };

    interactions.forEach(interaction => {
      stats.platforms[interaction.platform] = (stats.platforms[interaction.platform] || 0) + 1;
    });

    setStats(stats);
  };

  const filterInteractions = () => {
    let filtered = interactions;

    if (searchTerm) {
      filtered = filtered.filter(interaction =>
        interaction.fan_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        interaction.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (platformFilter !== "all") {
      filtered = filtered.filter(interaction => interaction.platform === platformFilter);
    }

    if (sentimentFilter !== "all") {
      filtered = filtered.filter(interaction => interaction.sentiment === sentimentFilter);
    }

    setFilteredInteractions(filtered);
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'text-green-600 bg-green-50 border-green-200';
      case 'negative': return 'text-red-600 bg-red-50 border-red-200';
      case 'neutral': return 'text-gray-600 bg-gray-50 border-gray-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return <Heart className="w-4 h-4" />;
      case 'negative': return <MessageSquare className="w-4 h-4" />;
      default: return <MessageSquare className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Fan Interactions</h1>
          <p className="text-muted-foreground">Monitor and analyze fan engagement across platforms</p>
        </div>
        <Button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
          <TrendingUp className="w-4 h-4 mr-2" />
          View Analytics
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6 text-center">
            <MessageSquare className="w-8 h-8 mx-auto mb-2 text-blue-500" />
            <div className="text-2xl font-bold">{stats.total}</div>
            <div className="text-sm text-muted-foreground">Total Interactions</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <Heart className="w-8 h-8 mx-auto mb-2 text-green-500" />
            <div className="text-2xl font-bold">{stats.positive}</div>
            <div className="text-sm text-muted-foreground">Positive</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <MessageSquare className="w-8 h-8 mx-auto mb-2 text-gray-500" />
            <div className="text-2xl font-bold">{stats.neutral}</div>
            <div className="text-sm text-muted-foreground">Neutral</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <MessageSquare className="w-8 h-8 mx-auto mb-2 text-red-500" />
            <div className="text-2xl font-bold">{stats.negative}</div>
            <div className="text-sm text-muted-foreground">Negative</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex-1 min-w-[200px]">
          <Input
            placeholder="Search interactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>
        <Select value={platformFilter} onValueChange={setPlatformFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Platform" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Platforms</SelectItem>
            <SelectItem value="live_stream">Live Stream</SelectItem>
            <SelectItem value="instagram">Instagram</SelectItem>
            <SelectItem value="twitter">Twitter</SelectItem>
            <SelectItem value="youtube">YouTube</SelectItem>
          </SelectContent>
        </Select>
        <Select value={sentimentFilter} onValueChange={setSentimentFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Sentiment" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Sentiments</SelectItem>
            <SelectItem value="positive">Positive</SelectItem>
            <SelectItem value="neutral">Neutral</SelectItem>
            <SelectItem value="negative">Negative</SelectItem>
          </SelectContent>
        </Select>
        <Badge variant="outline">{filteredInteractions.length} results</Badge>
      </div>

      <Tabs defaultValue="recent" className="w-full">
        <TabsList>
          <TabsTrigger value="recent">Recent Interactions</TabsTrigger>
          <TabsTrigger value="positive">Positive Feedback</TabsTrigger>
          <TabsTrigger value="needs-attention">Needs Attention</TabsTrigger>
        </TabsList>
        
        <TabsContent value="recent">
          <ScrollArea className="h-[600px]">
            <div className="space-y-4">
              {filteredInteractions.map((interaction) => (
                <Card key={interaction.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={interaction.fan_avatar} />
                        <AvatarFallback>{interaction.fan_name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{interaction.fan_name}</span>
                          <Badge variant="outline" className="text-xs">{interaction.platform}</Badge>
                          <Badge className={`text-xs ${getSentimentColor(interaction.sentiment)}`}>
                            {getSentimentIcon(interaction.sentiment)}
                            <span className="ml-1">{interaction.sentiment}</span>
                          </Badge>
                          <span className="text-xs text-muted-foreground ml-auto">
                            {new Date(interaction.commented_at).toLocaleDateString()} at{" "}
                            {new Date(interaction.commented_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-sm leading-relaxed">{interaction.content}</p>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm">
                            <Heart className="w-4 h-4 mr-1" />
                            Like
                          </Button>
                          <Button variant="ghost" size="sm">
                            <MessageSquare className="w-4 h-4 mr-1" />
                            Reply
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Share className="w-4 h-4 mr-1" />
                            Share
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>
        
        <TabsContent value="positive">
          <ScrollArea className="h-[600px]">
            <div className="space-y-4">
              {filteredInteractions.filter(i => i.sentiment === 'positive').map((interaction) => (
                <Card key={interaction.id} className="hover:shadow-md transition-shadow border-green-200">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={interaction.fan_avatar} />
                        <AvatarFallback>{interaction.fan_name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{interaction.fan_name}</span>
                          <Badge variant="outline" className="text-xs">{interaction.platform}</Badge>
                          <span className="text-xs text-muted-foreground ml-auto">
                            {new Date(interaction.commented_at).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm leading-relaxed">{interaction.content}</p>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm" className="text-green-600">
                            <Heart className="w-4 h-4 mr-1" />
                            Appreciate
                          </Button>
                          <Button variant="ghost" size="sm">
                            <MessageSquare className="w-4 h-4 mr-1" />
                            Thank
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>
        
        <TabsContent value="needs-attention">
          <ScrollArea className="h-[600px]">
            <div className="space-y-4">
              {filteredInteractions.filter(i => i.sentiment === 'negative').map((interaction) => (
                <Card key={interaction.id} className="hover:shadow-md transition-shadow border-red-200">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={interaction.fan_avatar} />
                        <AvatarFallback>{interaction.fan_name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{interaction.fan_name}</span>
                          <Badge variant="outline" className="text-xs">{interaction.platform}</Badge>
                          <Badge className="text-xs bg-red-100 text-red-700 border-red-200">
                            Needs Response
                          </Badge>
                          <span className="text-xs text-muted-foreground ml-auto">
                            {new Date(interaction.commented_at).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm leading-relaxed">{interaction.content}</p>
                        <div className="flex gap-2">
                          <Button size="sm" className="bg-red-500 hover:bg-red-600">
                            <MessageSquare className="w-4 h-4 mr-1" />
                            Respond Now
                          </Button>
                          <Button variant="outline" size="sm">
                            Mark Resolved
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Interactions;