import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Users, DollarSign, Clock, MapPin } from "lucide-react";
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, addMonths, subMonths, addWeeks, subWeeks, isSameMonth, isSameDay, parseISO } from "date-fns";

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
}

// Mock events data
const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Morning Workout Session',
    dateTime: '2024-01-15T09:00:00',
    platform: 'Instagram Live',
    rsvps: 156,
    revenue: 780,
    isPaid: true,
    price: 5,
    status: 'upcoming'
  },
  {
    id: '2',
    title: 'Gaming Stream Q&A',
    dateTime: '2024-01-16T19:00:00',
    platform: 'TikTok Live',
    rsvps: 89,
    revenue: 0,
    isPaid: false,
    status: 'upcoming'
  },
  {
    id: '3',
    title: 'Fashion Haul & Tips',
    dateTime: '2024-01-18T15:00:00',
    platform: 'YouTube Live',
    rsvps: 203,
    revenue: 1215,
    isPaid: true,
    price: 8,
    status: 'upcoming'
  },
  {
    id: '4',
    title: 'Cooking Masterclass',
    dateTime: '2024-01-20T14:00:00',
    platform: 'Instagram Live',
    rsvps: 124,
    revenue: 620,
    isPaid: true,
    price: 10,
    status: 'upcoming'
  }
];

export const CalendarView = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'month' | 'week'>('month');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

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
    return mockEvents.filter(event => 
      isSameDay(parseISO(event.dateTime), date)
    );
  };

  const getTotalStats = () => {
    return {
      totalRsvps: mockEvents.reduce((sum, event) => sum + event.rsvps, 0),
      totalRevenue: mockEvents.reduce((sum, event) => sum + event.revenue, 0),
      totalEvents: mockEvents.length
    };
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
          
          <div className={`grid grid-cols-7 gap-1 ${viewMode === 'week' ? 'min-h-[400px]' : 'min-h-[600px]'}`}>
            {calendarDays.map((day, index) => {
              const events = getEventsForDate(day);
              const isCurrentMonth = viewMode === 'week' || isSameMonth(day, currentDate);
              const isToday = isSameDay(day, new Date());
              
              return (
                <div
                  key={index}
                  className={`border rounded-lg p-2 ${
                    isCurrentMonth ? 'bg-background' : 'bg-muted/50'
                  } ${isToday ? 'ring-2 ring-primary' : ''} ${
                    viewMode === 'week' ? 'min-h-[350px]' : 'min-h-[120px]'
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
    </div>
  );
};