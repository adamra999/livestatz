import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { useEvents } from "@/hooks/useEvents";
import type { EventData } from "../types";

// Mock event data - in a real app, this would come from your backend/Supabase
const mockEvents: Record<string, Partial<EventData>> = {
  abc123: {
    id: "abc123",
    title: "Team Building Workshop",
    description:
      "Join us for an interactive team building session with fun activities and networking opportunities.",
    dateTime: "2025-08-15T14:30:00",
    platform: "In-Person",
    location: "Conference Room A",
    isPaid: true,
    price: 25,
    organizer: "Sarah Johnson",
    organizerAvatar: "",
    maxAttendees: 50,
    currentAttendees: 23,
    tags: ["Team Building", "Networking", "Workshop"],
  },
  def456: {
    id: "def456",
    title: "Digital Marketing Masterclass",
    description:
      "Learn advanced digital marketing strategies from industry experts. Covers SEO, social media, and conversion optimization.",
    dateTime: "2025-09-20T18:00:00",
    platform: "Zoom",
    location: "Online",
    isPaid: true,
    price: 15,
    organizer: "Mike Chen",
    organizerAvatar: "",
    maxAttendees: 100,
    currentAttendees: 67,
    tags: ["Marketing", "Digital", "Education"],
  },
};

export const useEventData = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const { fetchEventById } = useEvents();
  const [event, setEvent] = useState<EventData | null>(null);
  const [loading, setLoading] = useState(true);

  const loadEvent = useCallback(async () => {
    if (!eventId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const eventData = await fetchEventById(eventId);
      if (eventData) {
        // Merge mock data for missing fields, but preserve creator info from DB
        setEvent({
          ...mockEvents[eventId as keyof typeof mockEvents],
          ...eventData,
          // Ensure creator info from DB is preserved
          creatorHandle: eventData.creatorHandle,
          creatorName: eventData.creatorName,
        } as EventData);
      }
    } catch (error) {
      console.error("Error loading event:", error);
    } finally {
      setLoading(false);
    }
  }, [eventId, fetchEventById]);

  useEffect(() => {
    loadEvent();
  }, [loadEvent]);

  return { event, loading, refetch: loadEvent };
};

