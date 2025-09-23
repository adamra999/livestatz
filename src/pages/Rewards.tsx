import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Gift, Plus, Star, Crown, Zap, Send, Users, Target } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Workflow {
  id: string;
  name: string;
  description: string;
  trigger_type: string;
  target_segment: string;
  is_active: boolean;
  created_at: string;
  actions: WorkflowAction[];
}

interface WorkflowAction {
  id: string;
  action_type: string;
  action_data: any;
  delay_hours: number;
  order_index: number;
}

interface Fan {
  id: string;
  name: string;
  email: string;
  avatar_url?: string;
  segment: string;
  total_spent: number;
  events_attended: number;
}

const Rewards = () => {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [fans, setFans] = useState<Fan[]>([]);
  const [selectedFans, setSelectedFans] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewWorkflow, setShowNewWorkflow] = useState(false);
  const [showSendReward, setShowSendReward] = useState(false);
  const [newWorkflow, setNewWorkflow] = useState({
    name: '',
    description: '',
    trigger_type: '',
    target_segment: '',
    action_type: '',
    action_data: {}
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [workflowsRes, fansRes] = await Promise.all([
        supabase.from('workflows').select(`
          *,
          workflow_actions (*)
        `).order('created_at', { ascending: false }),
        supabase.from('fans').select('*').order('total_spent', { ascending: false })
      ]);

      if (workflowsRes.error) throw workflowsRes.error;
      if (fansRes.error) throw fansRes.error;

      const formattedWorkflows = (workflowsRes.data || []).map(workflow => ({
        ...workflow,
        actions: workflow.workflow_actions || []
      }));

      setWorkflows(formattedWorkflows);
      setFans(fansRes.data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createWorkflow = async () => {
    try {
      const { data: workflowData, error: workflowError } = await supabase
        .from('workflows')
        .insert({
          name: newWorkflow.name,
          description: newWorkflow.description,
          trigger_type: newWorkflow.trigger_type,
          target_segment: newWorkflow.target_segment,
          user_id: 'current-user-id' // This should be the actual user ID from auth
        })
        .select()
        .single();

      if (workflowError) throw workflowError;

      const { error: actionError } = await supabase
        .from('workflow_actions')
        .insert({
          workflow_id: workflowData.id,
          action_type: newWorkflow.action_type,
          action_data: newWorkflow.action_data,
          delay_hours: 0,
          order_index: 1
        });

      if (actionError) throw actionError;

      toast({
        title: "Success",
        description: "Workflow created successfully",
      });

      setShowNewWorkflow(false);
      setNewWorkflow({ name: '', description: '', trigger_type: '', target_segment: '', action_type: '', action_data: {} });
      fetchData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create workflow",
        variant: "destructive",
      });
    }
  };

  const toggleWorkflow = async (id: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('workflows')
        .update({ is_active: !isActive })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Workflow ${!isActive ? 'activated' : 'deactivated'}`,
      });

      fetchData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update workflow",
        variant: "destructive",
      });
    }
  };

  const getSegmentIcon = (segment: string) => {
    switch (segment) {
      case 'superfan': return <Crown className="w-4 h-4 text-purple-500" />;
      case 'paying': return <Star className="w-4 h-4 text-yellow-500" />;
      case 'casual': return <Users className="w-4 h-4 text-blue-500" />;
      default: return <Users className="w-4 h-4 text-gray-500" />;
    }
  };

  const getTriggerIcon = (trigger: string) => {
    switch (trigger) {
      case 'event_attendance': return <Target className="w-4 h-4" />;
      case 'first_purchase': return <Star className="w-4 h-4" />;
      case 'milestone_reached': return <Crown className="w-4 h-4" />;
      default: return <Zap className="w-4 h-4" />;
    }
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
          <h1 className="text-3xl font-bold">Fan Rewards & Workflows</h1>
          <p className="text-muted-foreground">Automate rewards and engage your fanbase</p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={() => setShowSendReward(true)}
            variant="outline"
            className="border-orange-200 text-orange-600 hover:bg-orange-50"
          >
            <Send className="w-4 h-4 mr-2" />
            Send Reward
          </Button>
          <Button 
            onClick={() => setShowNewWorkflow(true)}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Workflow
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6 text-center">
            <Zap className="w-8 h-8 mx-auto mb-2 text-blue-500" />
            <div className="text-2xl font-bold">{workflows.filter(w => w.is_active).length}</div>
            <div className="text-sm text-muted-foreground">Active Workflows</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <Crown className="w-8 h-8 mx-auto mb-2 text-purple-500" />
            <div className="text-2xl font-bold">{fans.filter(f => f.segment === 'superfan').length}</div>
            <div className="text-sm text-muted-foreground">Superfans</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <Star className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
            <div className="text-2xl font-bold">{fans.filter(f => f.segment === 'paying').length}</div>
            <div className="text-sm text-muted-foreground">Paying Fans</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <Gift className="w-8 h-8 mx-auto mb-2 text-green-500" />
            <div className="text-2xl font-bold">127</div>
            <div className="text-sm text-muted-foreground">Rewards Sent</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="workflows" className="w-full">
        <TabsList>
          <TabsTrigger value="workflows">Auto Workflows</TabsTrigger>
          <TabsTrigger value="rewards">Reward Templates</TabsTrigger>
          <TabsTrigger value="history">Reward History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="workflows">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {workflows.map((workflow) => (
              <Card key={workflow.id} className={`${workflow.is_active ? 'border-green-200 bg-green-50/50' : 'border-gray-200'}`}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      {getTriggerIcon(workflow.trigger_type)}
                      {workflow.name}
                    </CardTitle>
                    <Badge variant={workflow.is_active ? "default" : "secondary"}>
                      {workflow.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">{workflow.description}</p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Badge variant="outline" className="text-xs">
                        Trigger: {workflow.trigger_type.replace('_', ' ')}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      {getSegmentIcon(workflow.target_segment)}
                      <span className="capitalize">{workflow.target_segment} fans</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant={workflow.is_active ? "destructive" : "default"}
                      onClick={() => toggleWorkflow(workflow.id, workflow.is_active)}
                      className="flex-1"
                    >
                      {workflow.is_active ? "Deactivate" : "Activate"}
                    </Button>
                    <Button size="sm" variant="outline">
                      Edit
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="rewards">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card className="border-dashed border-2 border-muted-foreground/25 hover:border-muted-foreground/50 transition-colors">
              <CardContent className="flex flex-col items-center justify-center h-48 text-center">
                <Gift className="w-12 h-12 text-muted-foreground mb-4" />
                <h3 className="font-semibold mb-2">Exclusive Content</h3>
                <p className="text-sm text-muted-foreground mb-4">Early access to videos, photos, and behind-the-scenes content</p>
                <Button size="sm">Use Template</Button>
              </CardContent>
            </Card>
            <Card className="border-dashed border-2 border-muted-foreground/25 hover:border-muted-foreground/50 transition-colors">
              <CardContent className="flex flex-col items-center justify-center h-48 text-center">
                <Star className="w-12 h-12 text-muted-foreground mb-4" />
                <h3 className="font-semibold mb-2">VIP Access</h3>
                <p className="text-sm text-muted-foreground mb-4">Front row seats, meet & greet opportunities</p>
                <Button size="sm">Use Template</Button>
              </CardContent>
            </Card>
            <Card className="border-dashed border-2 border-muted-foreground/25 hover:border-muted-foreground/50 transition-colors">
              <CardContent className="flex flex-col items-center justify-center h-48 text-center">
                <Crown className="w-12 h-12 text-muted-foreground mb-4" />
                <h3 className="font-semibold mb-2">Merchandise</h3>
                <p className="text-sm text-muted-foreground mb-4">Limited edition merch, discount codes</p>
                <Button size="sm">Use Template</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Recent Rewards Sent</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { fan: "Sarah Johnson", reward: "Exclusive Video Access", date: "2 hours ago", type: "content" },
                  { fan: "Mike Chen", reward: "10% Merch Discount", date: "1 day ago", type: "discount" },
                  { fan: "Emma Wilson", reward: "VIP Event Access", date: "2 days ago", type: "access" },
                  { fan: "Alex Rodriguez", reward: "Behind-the-Scenes Content", date: "3 days ago", type: "content" },
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback>{item.fan.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{item.fan}</div>
                        <div className="text-sm text-muted-foreground">{item.reward}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline" className="text-xs">
                        {item.type}
                      </Badge>
                      <div className="text-xs text-muted-foreground mt-1">{item.date}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* New Workflow Dialog */}
      <Dialog open={showNewWorkflow} onOpenChange={setShowNewWorkflow}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Workflow</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Workflow Name</label>
              <Input
                placeholder="e.g., New Fan Welcome"
                value={newWorkflow.name}
                onChange={(e) => setNewWorkflow({ ...newWorkflow, name: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Description</label>
              <Textarea
                placeholder="Describe what this workflow does..."
                value={newWorkflow.description}
                onChange={(e) => setNewWorkflow({ ...newWorkflow, description: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Trigger</label>
              <Select value={newWorkflow.trigger_type} onValueChange={(value) => setNewWorkflow({ ...newWorkflow, trigger_type: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select trigger" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="first_purchase">First Purchase</SelectItem>
                  <SelectItem value="event_attendance">Event Attendance</SelectItem>
                  <SelectItem value="milestone_reached">Milestone Reached</SelectItem>
                  <SelectItem value="birthday">Birthday</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Target Segment</label>
              <Select value={newWorkflow.target_segment} onValueChange={(value) => setNewWorkflow({ ...newWorkflow, target_segment: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select segment" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Fans</SelectItem>
                  <SelectItem value="superfan">Superfans</SelectItem>
                  <SelectItem value="paying">Paying Fans</SelectItem>
                  <SelectItem value="casual">Casual Fans</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Action</label>
              <Select value={newWorkflow.action_type} onValueChange={(value) => setNewWorkflow({ ...newWorkflow, action_type: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select action" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="send_email">Send Email</SelectItem>
                  <SelectItem value="send_content">Send Exclusive Content</SelectItem>
                  <SelectItem value="send_discount">Send Discount Code</SelectItem>
                  <SelectItem value="grant_access">Grant VIP Access</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              <Button onClick={createWorkflow} className="flex-1">
                Create Workflow
              </Button>
              <Button variant="outline" onClick={() => setShowNewWorkflow(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Send Reward Dialog */}
      <Dialog open={showSendReward} onOpenChange={setShowSendReward}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Send Instant Reward</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Select Fans</label>
              <ScrollArea className="h-32 border rounded-md p-2">
                {fans.slice(0, 10).map((fan) => (
                  <div key={fan.id} className="flex items-center space-x-2 py-1">
                    <input
                      type="checkbox"
                      id={fan.id}
                      checked={selectedFans.includes(fan.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedFans([...selectedFans, fan.id]);
                        } else {
                          setSelectedFans(selectedFans.filter(id => id !== fan.id));
                        }
                      }}
                    />
                    <label htmlFor={fan.id} className="flex items-center gap-2 cursor-pointer">
                      <Avatar className="w-6 h-6">
                        <AvatarImage src={fan.avatar_url} />
                        <AvatarFallback>{fan.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{fan.name}</span>
                      <Badge variant="outline" className="text-xs">{fan.segment}</Badge>
                    </label>
                  </div>
                ))}
              </ScrollArea>
            </div>
            <div>
              <label className="text-sm font-medium">Reward Type</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select reward type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="content">Exclusive Content</SelectItem>
                  <SelectItem value="discount">Discount Code</SelectItem>
                  <SelectItem value="access">VIP Access</SelectItem>
                  <SelectItem value="merch">Free Merchandise</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Message</label>
              <Textarea placeholder="Personal message to your fans..." />
            </div>
            <div className="flex gap-2">
              <Button className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600">
                <Send className="w-4 h-4 mr-2" />
                Send Reward ({selectedFans.length} fans)
              </Button>
              <Button variant="outline" onClick={() => setShowSendReward(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Rewards;