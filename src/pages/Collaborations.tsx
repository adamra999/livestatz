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
import { Progress } from "@/components/ui/progress";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { 
  Handshake, 
  Plus, 
  Users, 
  DollarSign, 
  TrendingUp, 
  Calendar as CalendarIcon,
  Mail,
  Phone,
  ExternalLink,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface Collaboration {
  id: string;
  partner_name: string;
  partner_email?: string;
  partnership_type: string;
  status: string;
  deal_value?: number;
  description?: string;
  start_date?: string;
  end_date?: string;
  created_at: string;
  updated_at: string;
}

const Collaborations = () => {
  const [collaborations, setCollaborations] = useState<Collaboration[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewCollaboration, setShowNewCollaboration] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [newCollaboration, setNewCollaboration] = useState({
    partner_name: '',
    partner_email: '',
    partnership_type: '',
    status: 'pending',
    deal_value: '',
    description: '',
    start_date: '',
    end_date: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchCollaborations();
  }, []);

  const fetchCollaborations = async () => {
    try {
      const { data, error } = await supabase
        .from('collaborations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCollaborations(data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch collaborations",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createCollaboration = async () => {
    try {
      const { error } = await supabase
        .from('collaborations')
        .insert({
          partner_name: newCollaboration.partner_name,
          partner_email: newCollaboration.partner_email || null,
          partnership_type: newCollaboration.partnership_type,
          status: newCollaboration.status,
          deal_value: newCollaboration.deal_value ? parseFloat(newCollaboration.deal_value) : null,
          description: newCollaboration.description || null,
          start_date: startDate?.toISOString() || null,
          end_date: endDate?.toISOString() || null,
          user_id: 'current-user-id' // This should be the actual user ID from auth
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Collaboration created successfully",
      });

      setShowNewCollaboration(false);
      resetForm();
      fetchCollaborations();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create collaboration",
        variant: "destructive",
      });
    }
  };

  const updateCollaborationStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from('collaborations')
        .update({ status })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Collaboration ${status}`,
      });

      fetchCollaborations();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update collaboration",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setNewCollaboration({
      partner_name: '',
      partner_email: '',
      partnership_type: '',
      status: 'pending',
      deal_value: '',
      description: '',
      start_date: '',
      end_date: ''
    });
    setStartDate(undefined);
    setEndDate(undefined);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'pending': return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'completed': return <CheckCircle className="w-4 h-4 text-blue-500" />;
      case 'cancelled': return <XCircle className="w-4 h-4 text-red-500" />;
      default: return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'completed': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'brand_partnership': return <Handshake className="w-4 h-4" />;
      case 'influencer_collab': return <Users className="w-4 h-4" />;
      case 'event_partnership': return <CalendarIcon className="w-4 h-4" />;
      case 'content_collab': return <TrendingUp className="w-4 h-4" />;
      default: return <Handshake className="w-4 h-4" />;
    }
  };

  const filteredCollaborations = collaborations.filter(collab => {
    const matchesSearch = collab.partner_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (collab.partner_email && collab.partner_email.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === "all" || collab.status === statusFilter;
    const matchesType = typeFilter === "all" || collab.partnership_type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const stats = {
    total: collaborations.length,
    active: collaborations.filter(c => c.status === 'active').length,
    pending: collaborations.filter(c => c.status === 'pending').length,
    totalValue: collaborations.reduce((sum, c) => sum + (c.deal_value || 0), 0)
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
          <h1 className="text-3xl font-bold">Collaborations</h1>
          <p className="text-muted-foreground">Manage influencer partnerships and brand deals</p>
        </div>
        <Button 
          onClick={() => setShowNewCollaboration(true)}
          className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Partnership
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6 text-center">
            <Handshake className="w-8 h-8 mx-auto mb-2 text-blue-500" />
            <div className="text-2xl font-bold">{stats.total}</div>
            <div className="text-sm text-muted-foreground">Total Partnerships</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-500" />
            <div className="text-2xl font-bold">{stats.active}</div>
            <div className="text-sm text-muted-foreground">Active</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <Clock className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
            <div className="text-2xl font-bold">{stats.pending}</div>
            <div className="text-sm text-muted-foreground">Pending</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <DollarSign className="w-8 h-8 mx-auto mb-2 text-green-500" />
            <div className="text-2xl font-bold">${stats.totalValue.toLocaleString()}</div>
            <div className="text-sm text-muted-foreground">Total Value</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-center">
        <Input
          placeholder="Search partnerships..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Partnership Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="brand_partnership">Brand Partnership</SelectItem>
            <SelectItem value="influencer_collab">Influencer Collab</SelectItem>
            <SelectItem value="event_partnership">Event Partnership</SelectItem>
            <SelectItem value="content_collab">Content Collab</SelectItem>
          </SelectContent>
        </Select>
        <Badge variant="outline">{filteredCollaborations.length} results</Badge>
      </div>

      <Tabs defaultValue="grid" className="w-full">
        <TabsList>
          <TabsTrigger value="grid">Grid View</TabsTrigger>
          <TabsTrigger value="pipeline">Pipeline View</TabsTrigger>
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
        </TabsList>
        
        <TabsContent value="grid">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCollaborations.map((collab) => (
              <Card key={collab.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      {getTypeIcon(collab.partnership_type)}
                      {collab.partner_name}
                    </CardTitle>
                    <Badge className={getStatusColor(collab.status)}>
                      {getStatusIcon(collab.status)}
                      <span className="ml-1 capitalize">{collab.status}</span>
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-sm text-muted-foreground">
                    {collab.partnership_type.replace('_', ' ').split(' ').map(word => 
                      word.charAt(0).toUpperCase() + word.slice(1)
                    ).join(' ')}
                  </div>
                  
                  {collab.deal_value && (
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-green-500" />
                      <span className="font-semibold">${collab.deal_value.toLocaleString()}</span>
                    </div>
                  )}
                  
                  {collab.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">{collab.description}</p>
                  )}
                  
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    {collab.start_date && (
                      <div className="flex items-center gap-1">
                        <CalendarIcon className="w-3 h-3" />
                        {format(new Date(collab.start_date), 'MMM dd')}
                      </div>
                    )}
                    {collab.partner_email && (
                      <div className="flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        Contact
                      </div>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    {collab.status === 'pending' && (
                      <>
                        <Button 
                          size="sm" 
                          className="flex-1"
                          onClick={() => updateCollaborationStatus(collab.id, 'active')}
                        >
                          Accept
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => updateCollaborationStatus(collab.id, 'cancelled')}
                        >
                          Decline
                        </Button>
                      </>
                    )}
                    {collab.status === 'active' && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="w-full"
                        onClick={() => updateCollaborationStatus(collab.id, 'completed')}
                      >
                        Mark Complete
                      </Button>
                    )}
                    {(collab.status === 'completed' || collab.status === 'cancelled') && (
                      <Button size="sm" variant="outline" className="w-full">
                        View Details
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="pipeline">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {['pending', 'active', 'completed', 'cancelled'].map((status) => (
              <div key={status} className="space-y-4">
                <h3 className="font-semibold capitalize flex items-center gap-2">
                  {getStatusIcon(status)}
                  {status} ({collaborations.filter(c => c.status === status).length})
                </h3>
                <div className="space-y-2">
                  {collaborations.filter(c => c.status === status).map((collab) => (
                    <Card key={collab.id} className="p-4">
                      <div className="space-y-2">
                        <div className="font-medium">{collab.partner_name}</div>
                        <div className="text-sm text-muted-foreground">
                          {collab.partnership_type.replace('_', ' ')}
                        </div>
                        {collab.deal_value && (
                          <div className="text-sm font-semibold text-green-600">
                            ${collab.deal_value.toLocaleString()}
                          </div>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="calendar">
          <Card>
            <CardContent className="p-6">
              <div className="text-center text-muted-foreground">
                <CalendarIcon className="w-12 h-12 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Calendar View</h3>
                <p>Partnership timeline and milestone tracking coming soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* New Collaboration Dialog */}
      <Dialog open={showNewCollaboration} onOpenChange={setShowNewCollaboration}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Partnership</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Partner Name *</label>
                <Input
                  placeholder="e.g., Sarah's Beauty Channel"
                  value={newCollaboration.partner_name}
                  onChange={(e) => setNewCollaboration({ ...newCollaboration, partner_name: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Email</label>
                <Input
                  type="email"
                  placeholder="partner@example.com"
                  value={newCollaboration.partner_email}
                  onChange={(e) => setNewCollaboration({ ...newCollaboration, partner_email: e.target.value })}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Partnership Type *</label>
                <Select 
                  value={newCollaboration.partnership_type} 
                  onValueChange={(value) => setNewCollaboration({ ...newCollaboration, partnership_type: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="brand_partnership">Brand Partnership</SelectItem>
                    <SelectItem value="influencer_collab">Influencer Collaboration</SelectItem>
                    <SelectItem value="event_partnership">Event Partnership</SelectItem>
                    <SelectItem value="content_collab">Content Collaboration</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Deal Value</label>
                <Input
                  type="number"
                  placeholder="0"
                  value={newCollaboration.deal_value}
                  onChange={(e) => setNewCollaboration({ ...newCollaboration, deal_value: e.target.value })}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Start Date</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={setStartDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <label className="text-sm font-medium">End Date</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {endDate ? format(endDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={setEndDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium">Description</label>
              <Textarea
                placeholder="Describe the partnership details, deliverables, and expectations..."
                value={newCollaboration.description}
                onChange={(e) => setNewCollaboration({ ...newCollaboration, description: e.target.value })}
                rows={3}
              />
            </div>
            
            <div className="flex gap-2">
              <Button onClick={createCollaboration} className="flex-1">
                Create Partnership
              </Button>
              <Button variant="outline" onClick={() => {
                setShowNewCollaboration(false);
                resetForm();
              }}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Collaborations;