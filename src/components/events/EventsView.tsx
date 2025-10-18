import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { EventCard } from "@/components/events/EventCard";
import { useEvents } from "@/hooks/useEvents";
import { format } from "date-fns";

function EventsView() {
  const [showEventForm, setShowEventForm] = useState(false);
  const {
    events,
    loading,
    error,
    createEvent,
    fetchEventCountByUser,
    eventCount,
  } = useEvents();
  const mockEvents = [
    {
      id: "1",
      title: "Team Building Workshop",
      description:
        "Join us for an interactive team building session with fun activities and networking opportunities.",
      platform: "Instagram Live",
      date: "8/15/2025",
      time: "2:30 PM",
      rsvpCount: 156,
      rsvpGoal: 200,
      isPaid: true,
      price: 29.99,
      isLive: false,
      coverImage: "/placeholder.svg",
      liveLink: "https://instagram.com/live/team-building",
      totalViews: 2847,
      revenue: 2940.5,
      organizer: "Sarah Chen",
    },
    {
      id: "2",
      title: "Morning Yoga Flow",
      description:
        "Start your day with a peaceful yoga session focusing on breathwork and mindful movement.",
      platform: "YouTube Live",
      date: "8/16/2025",
      time: "7:00 AM",
      rsvpCount: 89,
      rsvpGoal: 150,
      isPaid: false,
      isLive: true,
      liveLink: "https://youtube.com/live/yoga-flow",
      totalViews: 1234,
      organizer: "Maya Patel",
    },
    {
      id: "3",
      title: "Digital Marketing Masterclass",
      description:
        "Learn the latest strategies for growing your online presence and converting followers to customers.",
      platform: "Instagram Live",
      date: "8/17/2025",
      time: "3:00 PM",
      rsvpCount: 267,
      rsvpGoal: 300,
      isPaid: true,
      price: 49.99,
      isLive: false,
      liveLink: "https://instagram.com/live/marketing-class",
      totalViews: 4521,
      revenue: 8950.25,
      organizer: "Alex Rodriguez",
    },
    {
      id: "4",
      title: "Cooking with Local Ingredients",
      description:
        "Discover how to create delicious meals using seasonal, locally-sourced ingredients.",
      platform: "TikTok Live",
      date: "8/18/2025",
      time: "6:30 PM",
      rsvpCount: 143,
      rsvpGoal: 200,
      isPaid: true,
      price: 19.99,
      isLive: false,
      liveLink: "https://tiktok.com/live/cooking-local",
      totalViews: 3456,
      revenue: 1850.75,
      organizer: "Chef Maria",
    },
    ...events.map((e) => {
      return {
        id: e.id,
        title: e.title,
        date: format(new Date(e.dateTime), "M/d/yyyy"),
        time: "9:00 AM",
        rsvpCount: 156,
        platform: e.platform,
        isPaid: e.isPaid,
        isLive: true,
        liveLink: e.link,

        description:
          "Discover how to create delicious meals using seasonal, locally-sourced ingredients.",
        // date: "8/18/2025",
        // time: "6:30 PM",
        rsvpGoal: 200,
        price: 19.99,
        totalViews: 3456,
        revenue: 1850.75,
        organizer: "Chef Maria",
      };
    }),
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">All Events</h1>
          <p className="text-muted-foreground">
            Manage and track your live events
          </p>
        </div>
        <Button onClick={() => setShowEventForm(true)}>
          <Zap className="h-4 w-4 mr-2" />
          Create New Event
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {mockEvents.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
}

export default EventsView;
