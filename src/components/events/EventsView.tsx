import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { EventCard } from "@/components/events/EventCard";
import { useEvents } from "@/hooks/useEvents";
import { useRsvps } from "@/hooks/useRsvps";
import { format } from "date-fns";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

function EventsView() {
  const [showEventForm, setShowEventForm] = useState(false);
  const {
    events,
    loading,
    error,
    createEvent,
    fetchEventCountByUser,
    eventCount,
    userId,
    deleteEvent,
  } = useEvents();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { fetchRsvpCountByEvent } = useRsvps();
  const [rsvpCounts, setRsvpCounts] = useState<Record<string, number>>({});
  const [deleteEventId, setDeleteEventId] = useState<string | null>(null);
  const mockEvents = [
    // {
    //   id: "1",
    //   title: "Team Building Workshop",
    //   description:
    //     "Join us for an interactive team building session with fun activities and networking opportunities.",
    //   platform: "Instagram Live",
    //   date: "8/15/2025",
    //   time: "2:30 PM",
    //   rsvpCount: 156,
    //   rsvpGoal: 200,
    //   isPaid: true,
    //   price: 29.99,
    //   isLive: false,
    //   coverImage: "/placeholder.svg",
    //   liveLink: "https://instagram.com/live/team-building",
    //   totalViews: 2847,
    //   revenue: 2940.5,
    //   organizer: "Sarah Chen",
    // },
    // {
    //   id: "2",
    //   title: "Morning Yoga Flow",
    //   description:
    //     "Start your day with a peaceful yoga session focusing on breathwork and mindful movement.",
    //   platform: "YouTube Live",
    //   date: "8/16/2025",
    //   time: "7:00 AM",
    //   rsvpCount: 89,
    //   rsvpGoal: 150,
    //   isPaid: false,
    //   isLive: true,
    //   liveLink: "https://youtube.com/live/yoga-flow",
    //   totalViews: 1234,
    //   organizer: "Maya Patel",
    // },
    // {
    //   id: "3",
    //   title: "Digital Marketing Masterclass",
    //   description:
    //     "Learn the latest strategies for growing your online presence and converting followers to customers.",
    //   platform: "Instagram Live",
    //   date: "8/17/2025",
    //   time: "3:00 PM",
    //   rsvpCount: 267,
    //   rsvpGoal: 300,
    //   isPaid: true,
    //   price: 49.99,
    //   isLive: false,
    //   liveLink: "https://instagram.com/live/marketing-class",
    //   totalViews: 4521,
    //   revenue: 8950.25,
    //   organizer: "Alex Rodriguez",
    // },
    // {
    //   id: "4",
    //   title: "Cooking with Local Ingredients",
    //   description:
    //     "Discover how to create delicious meals using seasonal, locally-sourced ingredients.",
    //   platform: "TikTok Live",
    //   date: "8/18/2025",
    //   time: "6:30 PM",
    //   rsvpCount: 143,
    //   rsvpGoal: 200,
    //   isPaid: true,
    //   price: 19.99,
    //   isLive: false,
    //   liveLink: "https://tiktok.com/live/cooking-local",
    //   totalViews: 3456,
    //   revenue: 1850.75,
    //   organizer: "Chef Maria",
    // },
    ...events.map((e) => {
      return {
        id: e.id,
        title: e.title,
        date: format(new Date(e.dateTime), "M/d/yyyy"),
        time: format(new Date(e.dateTime), "h:mm a"),
        rsvpCount: rsvpCounts[e.id] || 0,
        platform: e.platform,
        isPaid: e.isPaid,
        isLive: false,
        liveLink: e.link,
        description: e.description || "No description available",
        rsvpGoal: 200,
        price: parseFloat(e.ticketPrice || "0"),
        totalViews: 0,
        revenue: 0,
        organizer: e.Influencers?.name || "Unknown",
      };
    }),
  ];

  useEffect(() => {
    const loadRsvpCounts = async () => {
      if (events.length === 0) return;
      
      const counts: Record<string, number> = {};
      
      for (const event of events) {
        const { count } = await fetchRsvpCountByEvent(event.id);
        counts[event.id] = count;
      }
      
      setRsvpCounts(counts);
    };
    
    if (userId && events.length > 0) {
      loadRsvpCounts();
    }
  }, [userId, events, fetchRsvpCountByEvent]);

  const handleDeleteClick = (eventId: string) => {
    setDeleteEventId(eventId);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteEventId) return;
    
    try {
      await deleteEvent(deleteEventId);
      toast({
        title: "Event deleted",
        description: "The event has been successfully deleted",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete event",
        variant: "destructive",
      });
    } finally {
      setDeleteEventId(null);
    }
  };

  const handleEditClick = (eventId: string) => {
    navigate(`/events/edit/${eventId}`);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">All Events</h1>
          <p className="text-muted-foreground">
            Manage and track your live events
          </p>
        </div>
        <Button 
            onClick={() => navigate("/events/create-event")}
        >
          <Zap className="h-4 w-4 mr-2" />
          Create New Event
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {mockEvents.map((event) => (
          <EventCard 
            key={event.id} 
            event={event} 
            onDelete={handleDeleteClick}
            onEdit={handleEditClick}
          />
        ))}
      </div>

      <AlertDialog open={!!deleteEventId} onOpenChange={() => setDeleteEventId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this event and all associated RSVPs. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default EventsView;
