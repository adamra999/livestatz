import { useState, useEffect, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY!
);

export interface Event {
  id: string;
  url: string;
  title: string;
  description?: string;
  dateTime: string;
  link: string;
  platform: string;
  isPublic?: boolean;
  isPaid?: boolean;
  ticketPrice?: string;
  accessDescription?: string;
  offerWithSubscription?: boolean;
  includeReplay?: boolean;
  includeDownloadablePerk?: boolean;
  perkDescription?: string;
  selectedFanGroups?: any[];
  inviteEmails?: any[];
  tags?: any[];
  createdAt: string;
  updatedAt: string;
  influencerId?: string;
}

export function useEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // 🔹 Fetch all events
  const fetchEvents = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from("Events")
      .select("*")
      .order("createdAt", { ascending: false });

    if (error) {
      setError(error.message);
    } else {
      setEvents(data as Event[]);
    }
    setLoading(false);
  }, []);

  // 🔹 Fetch single event by ID
  const fetchEventById = useCallback(
    async (id: string): Promise<Event | null> => {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from("Events")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        setError(error.message);
        setLoading(false);
        return null;
      }

      setLoading(false);
      return data as Event;
    },
    []
  );

  // 🔹 Create new event
  const createEvent = async (
    eventData: Omit<Event, "id" | "createdAt" | "updatedAt" | "url" | "link">
  ) => {
    const eventId = crypto.randomUUID();
    const eventUrl = `https://livestatz.com/e/${eventId}`;
    const { data, error } = await supabase
      .from("Events")
      .insert([
        {
          ...eventData,
          id: eventId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          url: eventUrl,
          link: eventUrl,
        },
      ])
      .select()
      .single();

    if (error) {
      setError(error.message);
      return null;
    }
    setEvents((prev) => [data as Event, ...prev]);
    return data as Event;
  };

  // 🔹 Update event
  const updateEvent = async (id: string, updates: Partial<Event>) => {
    const { data, error } = await supabase
      .from("Events")
      .update({
        ...updates,
        updatedAt: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      setError(error.message);
      return null;
    }

    setEvents((prev) => prev.map((e) => (e.id === id ? (data as Event) : e)));
    return data as Event;
  };

  // 🔹 Delete event
  const deleteEvent = async (id: string) => {
    const { error } = await supabase.from("Events").delete().eq("id", id);

    if (error) {
      setError(error.message);
      return false;
    }

    setEvents((prev) => prev.filter((e) => e.id !== id));
    return true;
  };

  // Auto-fetch all events on mount
  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  return {
    events,
    loading,
    error,
    fetchEvents,
    fetchEventById, // 👈 added here
    createEvent,
    updateEvent,
    deleteEvent,
  };
}
