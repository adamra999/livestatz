import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Users, DollarSign, Clock, MapPin, Plus } from "lucide-react";
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, addMonths, subMonths, addWeeks, subWeeks, isSameMonth, isSameDay, parseISO, isBefore, isAfter } from "date-fns";
import { useEvents } from "@/hooks/useEvents";
import { useRsvps } from "@/hooks/useRsvps";

interface Event {
  id: string;
  title: string;
  dateTime: string;
  platform: string;
  rsvps: number;
  revenue: number;
  isPaid: boolean;
  price?: number;
  status: 'upcoming' | 'live' | 'completed';
  views?: number;
  engagement?: number;
  posts?: number;
}


export const CalendarView = () => {
  const { events: dbEvents, loading } = useEvents();
  const { fetchRsvpCountByEvent } = useRsvps();
  
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'month' | 'week'>('month');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [rsvpCounts, setRsvpCounts] = useState<Record<string, number>>({});
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [newEvent, setNewEvent] = useState({
    title: '',
    dateTime: '',
    platform: '',
    isPaid: false,
    price: 0
  });

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

  // Map database events to calendar format
  useEffect(() => {
    if (!dbEvents) return;

    const mappedEvents: Event[] = dbEvents.map((e) => {
      const rsvpCount = rsvpCounts[e.id] || 0;
      const price = e.ticketPrice ? parseFloat(e.ticketPrice) : 0;
      const revenue = e.isPaid ? rsvpCount * price : 0;
      
      // Determine event status based on dateTime
      const eventDate = new Date(e.dateTime);
      const now = new Date();
      const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
      const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);
      
      let status: 'upcoming' | 'live' | 'completed' = 'upcoming';
      if (isBefore(eventDate, oneHourAgo)) {
        status = 'completed';
      } else if (isAfter(eventDate, oneHourAgo) && isBefore(eventDate, oneHourLater)) {
        status = 'live';
      }

      return {
        id: e.id,
        title: e.title,
        dateTime: e.dateTime,
        platform: e.platform,
        rsvps: rsvpCount,
        revenue: revenue,
        isPaid: e.isPaid || false,
        price: price,
        status: status,
      };
    });

    setEvents(mappedEvents);
  }, [dbEvents, rsvpCounts]);

  const navigateDate = (direction: 'prev' | 'next') => {
    if (viewMode === 'month') {
      setCurrentDate(direction === 'next' ? addMonths(currentDate, 1) : subMonths(currentDate, 1));
    } else {
      setCurrentDate(direction === 'next' ? addWeeks(currentDate, 1) : subWeeks(currentDate, 1));
    }
  };

  const getCalendarDays = () => {
    if (viewMode === 'month') {
      const monthStart = startOfMonth(currentDate);
      const monthEnd = endOfMonth(monthStart);
      const startDate = startOfWeek(monthStart);
      const endDate = endOfWeek(monthEnd);

      const days = [];
      let day = startDate;
      while (day <= endDate) {
        days.push(day);
        day = addDays(day, 1);
      }
      return days;
    } else {
      const weekStart = startOfWeek(currentDate);
      const days = [];
      for (let i = 0; i < 7; i++) {
        days.push(addDays(weekStart, i));
      }
      return days;
    }
  };

  const getEventsForDate = (date: Date) => {
    return events.filter(event => 
      isSameDay(parseISO(event.dateTime), date)
    );
  };

  const getTotalStats = () => {
    return {
      totalRsvps: events.reduce((sum, event) => sum + event.rsvps, 0),
      totalRevenue: events.reduce((sum, event) => sum + event.revenue, 0),
      totalEvents: events.length
    };
  };

  const handleCellClick = (date: Date) => {
    if (viewMode === 'week') {
      setSelectedDate(date);
      setNewEvent({
        ...newEvent,
        dateTime: format(date, "yyyy-MM-dd'T'HH:mm")
      });
      setShowCreateModal(true);
    }
  };

  const handleCreateEvent = () => {
    const eventData: Event = {
      id: `new-${Date.now()}`,
      title: newEvent.title,
      dateTime: newEvent.dateTime,
      platform: newEvent.platform,
      rsvps: 0,
      revenue: 0,
      isPaid: newEvent.isPaid,
      price: newEvent.price,
      status: 'upcoming'
    };

    setEvents([...events, eventData]);
    setShowCreateModal(false);
    setNewEvent({
      title: '',
      dateTime: '',
      platform: '',
      isPaid: false,
      price: 0
    });
  };

  const stats = getTotalStats();
  const calendarDays = getCalendarDays();

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CalendarIcon className="h-4 w-4 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Total Events</p>
                <p className="text-2xl font-bold">{stats.totalEvents}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Total RSVPs</p>
                <p className="text-2xl font-bold">{stats.totalRsvps.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-4 w-4 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold">${stats.totalRevenue.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="h-4 w-4 bg-primary rounded-full" />
              <div>
                <p className="text-sm text-muted-foreground">Avg Revenue/Event</p>
                <p className="text-2xl font-bold">${Math.round(stats.totalRevenue / stats.totalEvents)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Calendar Controls */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateDate('prev')}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              <h2 className="text-xl font-semibold">
                {viewMode === 'month' 
                  ? format(currentDate, 'MMMM yyyy')
                  : `Week of ${format(startOfWeek(currentDate), 'MMM d, yyyy')}`
                }
              </h2>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateDate('next')}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === 'month' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('month')}
              >
                Month
              </Button>
              <Button
                variant={viewMode === 'week' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('week')}
              >
                Week
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1 mb-4">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
                {day}
              </div>
            ))}
          </div>
          
          {/* Calendar Grid with Time Axis */}
          <div className="flex">
            {/* Time axis on the left for week view */}
            {viewMode === 'week' && (
              <div className="flex flex-col mr-2">
                <div className="h-8 mb-4"></div> {/* Spacer for day headers */}
                {Array.from({ length: 24 }, (_, hour) => (
                  <div key={hour} className="text-xs text-muted-foreground h-6 flex items-start">
                    {hour === 0 ? '12 AM' : hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour - 12} PM`}
                  </div>
                ))}
              </div>
            )}
            
            <div className={`grid grid-cols-7 gap-1 flex-1 ${viewMode === 'week' ? 'min-h-[600px]' : 'min-h-[600px]'}`}>
              {calendarDays.map((day, index) => {
                const events = getEventsForDate(day);
                const isCurrentMonth = viewMode === 'week' || isSameMonth(day, currentDate);
                const isToday = isSameDay(day, new Date());
                
                return (
                  <div
                    key={index}
                    onClick={() => handleCellClick(day)}
                    className={`border rounded-lg p-2 transition-colors ${
                      isCurrentMonth ? 'bg-background' : 'bg-muted/50'
                    } ${isToday ? 'ring-2 ring-primary' : ''} ${
                      viewMode === 'week' ? 'min-h-[576px] cursor-pointer hover:bg-muted/20' : 'min-h-[120px]'
                    }`}
                  >
                    <div className={`text-sm font-medium mb-2 ${
                      isCurrentMonth ? 'text-foreground' : 'text-muted-foreground'
                    }`}>
                      {format(day, 'd')}
                    </div>
                    
                    <div className="space-y-1">
                      {events.map((event) => (
                        <div
                          key={event.id}
                          onClick={() => setSelectedEvent(event)}
                          className={`p-2 rounded text-xs cursor-pointer transition-colors ${
                            event.isPaid 
                              ? 'bg-yellow-100 hover:bg-yellow-200 text-yellow-800 border border-yellow-200' 
                              : 'bg-primary/10 hover:bg-primary/20 text-primary'
                          }`}
                        >
                          <div className="font-medium truncate">{event.title}</div>
                          <div className="text-xs opacity-75">{format(parseISO(event.dateTime), 'HH:mm')}</div>
                          <div className="flex items-center justify-between mt-1">
                            <div className="flex items-center space-x-1">
                              <Users className="h-3 w-3" />
                              <span>{event.rsvps}</span>
                            </div>
                            {event.isPaid && (
                              <div className="flex items-center space-x-1">
                                <DollarSign className="h-3 w-3" />
                                <span>${event.revenue}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Event Details Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="max-w-md w-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{selectedEvent.title}</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedEvent(null)}
                >
                  ×
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>{format(parseISO(selectedEvent.dateTime), 'PPP p')}</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{selectedEvent.platform}</span>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-primary/10 rounded-lg">
                  <Users className="h-5 w-5 text-primary mx-auto mb-1" />
                  <div className="text-lg font-bold">{selectedEvent.rsvps}</div>
                  <div className="text-xs text-muted-foreground">RSVPs</div>
                </div>
                
                <div className="text-center p-3 bg-secondary/10 rounded-lg">
                  <DollarSign className="h-5 w-5 text-secondary-foreground mx-auto mb-1" />
                  <div className="text-lg font-bold">${selectedEvent.revenue}</div>
                  <div className="text-xs text-muted-foreground">Revenue</div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <Badge variant={selectedEvent.isPaid ? "default" : "secondary"}>
                  {selectedEvent.isPaid ? `$${selectedEvent.price} Ticket` : 'Free Event'}
                </Badge>
                <Badge variant="outline" className="capitalize">
                  {selectedEvent.status}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Create Event Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="max-w-md w-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <Plus className="h-5 w-5" />
                  <span>Create New Event</span>
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowCreateModal(false)}
                >
                  ×
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Event Title</Label>
                <Input
                  id="title"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  placeholder="Enter event title"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="datetime">Date & Time</Label>
                <Input
                  id="datetime"
                  type="datetime-local"
                  value={newEvent.dateTime}
                  onChange={(e) => setNewEvent({ ...newEvent, dateTime: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="platform">Platform</Label>
                <Select value={newEvent.platform} onValueChange={(value) => setNewEvent({ ...newEvent, platform: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select platform" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Instagram Live">Instagram Live</SelectItem>
                    <SelectItem value="YouTube Live">YouTube Live</SelectItem>
                    <SelectItem value="TikTok Live">TikTok Live</SelectItem>
                    <SelectItem value="Twitch">Twitch</SelectItem>
                    <SelectItem value="LinkedIn Live">LinkedIn Live</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isPaid"
                  checked={newEvent.isPaid}
                  onChange={(e) => setNewEvent({ ...newEvent, isPaid: e.target.checked })}
                  className="rounded"
                />
                <Label htmlFor="isPaid">Paid Event</Label>
              </div>

              {newEvent.isPaid && (
                <div className="space-y-2">
                  <Label htmlFor="price">Ticket Price ($)</Label>
                  <Input
                    id="price"
                    type="number"
                    value={newEvent.price}
                    onChange={(e) => setNewEvent({ ...newEvent, price: Number(e.target.value) })}
                    placeholder="0"
                  />
                </div>
              )}

              <div className="flex space-x-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateEvent}
                  className="flex-1"
                  disabled={!newEvent.title || !newEvent.dateTime || !newEvent.platform}
                >
                  Create Event
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};