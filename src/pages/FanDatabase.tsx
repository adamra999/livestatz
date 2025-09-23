import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Plus, DollarSign, Calendar, MessageSquare, Mail, Phone, MapPin, Send, FileText, Download } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Fan {
  id: string;
  name: string;
  email: string;
  avatar_url?: string;
  phone?: string;
  location?: string;
  total_spent: number;
  events_attended: number;
  comments_count: number;
  segment: string;
  first_interaction_date: string;
  last_interaction_date: string;
}

interface FanEvent {
  id: string;
  event_name: string;
  ticket_price: number;
  attended_at: string;
}

interface FanTransaction {
  id: string;
  amount: number;
  transaction_type: string;
  description?: string;
  transaction_date: string;
}

interface FanComment {
  id: string;
  content: string;
  platform: string;
  sentiment: string;
  commented_at: string;
}

const FanDatabase = () => {
  const [fans, setFans] = useState<Fan[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFan, setSelectedFan] = useState<Fan | null>(null);
  const [fanEvents, setFanEvents] = useState<FanEvent[]>([]);
  const [fanTransactions, setFanTransactions] = useState<FanTransaction[]>([]);
  const [fanComments, setFanComments] = useState<FanComment[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchFans();
  }, []);

  const fetchFans = async () => {
    try {
      const { data, error } = await supabase
        .from('fans')
        .select('*')
        .order('last_interaction_date', { ascending: false });

      if (error) throw error;
      setFans(data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch fans",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchFanDetails = async (fanId: string) => {
    try {
      const [eventsRes, transactionsRes, commentsRes] = await Promise.all([
        supabase.from('fan_events').select('*').eq('fan_id', fanId).order('attended_at', { ascending: false }),
        supabase.from('fan_transactions').select('*').eq('fan_id', fanId).order('transaction_date', { ascending: false }),
        supabase.from('fan_comments').select('*').eq('fan_id', fanId).order('commented_at', { ascending: false })
      ]);

      if (eventsRes.error) throw eventsRes.error;
      if (transactionsRes.error) throw transactionsRes.error;
      if (commentsRes.error) throw commentsRes.error;

      setFanEvents(eventsRes.data || []);
      setFanTransactions(transactionsRes.data || []);
      setFanComments(commentsRes.data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch fan details",
        variant: "destructive",
      });
    }
  };

  const filteredFans = fans.filter(fan =>
    fan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    fan.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getSegmentColor = (segment: string) => {
    switch (segment) {
      case 'superfan': return 'bg-gradient-to-r from-purple-500 to-pink-500';
      case 'paying': return 'bg-gradient-to-r from-green-500 to-emerald-500';
      case 'casual': return 'bg-gradient-to-r from-blue-500 to-cyan-500';
      default: return 'bg-gradient-to-r from-gray-500 to-slate-500';
    }
  };

  const openFanDetails = (fan: Fan) => {
    setSelectedFan(fan);
    fetchFanDetails(fan.id);
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
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
          <h1 className="text-3xl font-bold">Fan Database</h1>
          <p className="text-muted-foreground">Manage your fan relationships and history</p>
        </div>
        <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
          <Plus className="w-4 h-4 mr-2" />
          Add Fan
        </Button>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search fans..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Badge variant="outline">Total: {fans.length}</Badge>
          <Badge variant="outline">Superfans: {fans.filter(f => f.segment === 'superfan').length}</Badge>
          <Badge variant="outline">Paying: {fans.filter(f => f.segment === 'paying').length}</Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredFans.map((fan) => (
          <Card key={fan.id} className="hover:shadow-lg transition-shadow cursor-pointer border-2" onClick={() => openFanDetails(fan)}>
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">🎟️</span>
                <div>
                  <CardTitle className="text-xl font-bold">Fan Profile: {fan.name}</CardTitle>
                </div>
              </div>
              
              {/* Core Info Section */}
              <div className="space-y-3">
                <h3 className="font-semibold text-lg">Core Info</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <span>📧</span>
                    <span className="font-medium">Email:</span>
                    <span className="text-muted-foreground">{fan.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>🏷️</span>
                    <span className="font-medium">Tags:</span>
                    <Badge className={`${getSegmentColor(fan.segment)} text-white border-0 text-xs`}>
                      {fan.segment.toUpperCase()}
                    </Badge>
                    {fan.total_spent > 0 && <Badge variant="outline" className="text-xs">PAID</Badge>}
                  </div>
                  <div className="flex items-start gap-2">
                    <span>📝</span>
                    <span className="font-medium">Notes:</span>
                    <span className="text-muted-foreground text-xs">
                      Joined {new Date(fan.first_interaction_date).toLocaleDateString()}
                      {fan.location && ` from ${fan.location}`}
                    </span>
                  </div>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Engagement Section */}
              <div className="space-y-3">
                <h3 className="font-semibold text-lg">Engagement</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <span>✅</span>
                    <span className="font-medium">Total RSVPs:</span>
                    <span>{fan.events_attended}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>👩‍🎨</span>
                    <span className="font-medium">Events Attended:</span>
                    <span>{fan.events_attended} (100% attendance rate)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>📅</span>
                    <span className="font-medium">Last Attended:</span>
                    <span className="text-muted-foreground text-xs">
                      {new Date(fan.last_interaction_date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>🎥</span>
                    <span className="font-medium">Comments Made:</span>
                    <span>{fan.comments_count}</span>
                  </div>
                </div>
              </div>

              {/* Value Section */}
              <div className="space-y-3">
                <h3 className="font-semibold text-lg">Value</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <span>💵</span>
                    <span className="font-medium">Paid Events:</span>
                    <span>{fan.events_attended}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>💰</span>
                    <span className="font-medium text-lg">Total Spend:</span>
                    <span className="font-bold text-lg text-green-600">${fan.total_spent}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={!!selectedFan} onOpenChange={() => setSelectedFan(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <Avatar className="w-12 h-12">
                <AvatarImage src={selectedFan?.avatar_url} />
                <AvatarFallback>{selectedFan?.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <div className="text-xl">{selectedFan?.name}</div>
                <div className="text-sm text-muted-foreground font-normal">{selectedFan?.email}</div>
              </div>
            </DialogTitle>
          </DialogHeader>
          
          {selectedFan && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <DollarSign className="w-8 h-8 mx-auto mb-2 text-green-500" />
                    <div className="text-2xl font-bold">${selectedFan.total_spent}</div>
                    <div className="text-xs text-muted-foreground">Total Spent</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <Calendar className="w-8 h-8 mx-auto mb-2 text-blue-500" />
                    <div className="text-2xl font-bold">{selectedFan.events_attended}</div>
                    <div className="text-xs text-muted-foreground">Events Attended</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <MessageSquare className="w-8 h-8 mx-auto mb-2 text-purple-500" />
                    <div className="text-2xl font-bold">{selectedFan.comments_count}</div>
                    <div className="text-xs text-muted-foreground">Comments Made</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <Badge className={`${getSegmentColor(selectedFan.segment)} text-white border-0 w-full justify-center`}>
                      {selectedFan.segment}
                    </Badge>
                    <div className="text-xs text-muted-foreground mt-2">Segment</div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                {selectedFan.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span>{selectedFan.phone}</span>
                  </div>
                )}
                {selectedFan.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span>{selectedFan.location}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span>{selectedFan.email}</span>
                </div>
              </div>

              <Tabs defaultValue="events" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="events">Events History</TabsTrigger>
                  <TabsTrigger value="transactions">Transactions</TabsTrigger>
                  <TabsTrigger value="comments">Comments</TabsTrigger>
                </TabsList>
                
                <TabsContent value="events">
                  <ScrollArea className="h-60">
                    <div className="space-y-2">
                      {fanEvents.map((event) => (
                        <Card key={event.id}>
                          <CardContent className="p-4">
                            <div className="flex justify-between items-center">
                              <div>
                                <div className="font-medium">{event.event_name}</div>
                                <div className="text-sm text-muted-foreground">
                                  {new Date(event.attended_at).toLocaleDateString()}
                                </div>
                              </div>
                              <Badge variant="outline">${event.ticket_price}</Badge>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </ScrollArea>
                </TabsContent>
                
                <TabsContent value="transactions">
                  <ScrollArea className="h-60">
                    <div className="space-y-2">
                      {fanTransactions.map((transaction) => (
                        <Card key={transaction.id}>
                          <CardContent className="p-4">
                            <div className="flex justify-between items-center">
                              <div>
                                <div className="font-medium">${transaction.amount}</div>
                                <div className="text-sm text-muted-foreground">
                                  {transaction.transaction_type} • {new Date(transaction.transaction_date).toLocaleDateString()}
                                </div>
                                {transaction.description && (
                                  <div className="text-xs text-muted-foreground mt-1">{transaction.description}</div>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </ScrollArea>
                </TabsContent>
                
                <TabsContent value="comments">
                  <ScrollArea className="h-60">
                    <div className="space-y-2">
                      {fanComments.map((comment) => (
                        <Card key={comment.id}>
                          <CardContent className="p-4">
                            <div className="space-y-2">
                              <div className="flex justify-between items-start">
                                <Badge variant="outline" className="text-xs">{comment.platform}</Badge>
                                <div className="text-xs text-muted-foreground">
                                  {new Date(comment.commented_at).toLocaleDateString()}
                                </div>
                              </div>
                              <div className="text-sm">{comment.content}</div>
                              <Badge 
                                variant="outline" 
                                className={`text-xs ${
                                  comment.sentiment === 'positive' ? 'border-green-500 text-green-500' :
                                  comment.sentiment === 'negative' ? 'border-red-500 text-red-500' :
                                  'border-gray-500 text-gray-500'
                                }`}
                              >
                                {comment.sentiment}
                              </Badge>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </ScrollArea>
                </TabsContent>
              </Tabs>

              {/* Actions Section */}
              <div className="border-t pt-4">
                <h3 className="font-semibold mb-3">Actions</h3>
                <div className="flex gap-3 justify-end">
                  <Button variant="outline" className="flex items-center gap-2">
                    <Send className="w-4 h-4" />
                    📩 Send Reminder
                  </Button>
                  <Button variant="outline" className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    🗒️ Add Note
                  </Button>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    📤 Export Contact
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FanDatabase;