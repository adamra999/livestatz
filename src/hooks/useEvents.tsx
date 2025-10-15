import { useState, useEffect, useCallback } from "react";
import { supabase } from "../lib/supabaseClient"; // ✅ use shared instance

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
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [eventCount, setEventCount] = useState<number | null>(null);

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
      setEvents(data ?? []);
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
        .maybeSingle(); // ✅ avoids throwing if not found

      if (error) setError(error.message);

      setLoading(false);
      return data as Event | null;
    },
    []
  );

  // 🔹 Fetch total event count by user
  const fetchEventCountByUser = useCallback(async (userId: string) => {
    if (!userId) return 0;

    setLoading(true);
    setError(null);

    const { count, error } = await supabase
      .from("Events")
      .select("*", { count: "exact", head: true })
      .eq("influencerId", userId);

    if (error) {
      setError(error.message);
      setEventCount(null);
    } else {
      setEventCount(count ?? 0);
    }

    setLoading(false);
    return count ?? 0;
  }, []);

  // 🔹 Create new event
  const createEvent = useCallback(
    async (
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
    },
    []
  );

  // 🔹 Update event
  const updateEvent = useCallback(
    async (id: string, updates: Partial<Event>) => {
      const { data, error } = await supabase
        .from("Events")
        .update({ ...updates, updatedAt: new Date().toISOString() })
        .eq("id", id)
        .select()
        .single();

      if (error) {
        setError(error.message);
        return null;
      }

      setEvents((prev) => prev.map((e) => (e.id === id ? (data as Event) : e)));

      return data as Event;
    },
    []
  );

  // 🔹 Delete event
  const deleteEvent = useCallback(async (id: string) => {
    const { error } = await supabase.from("Events").delete().eq("id", id);

    if (error) {
      setError(error.message);
      return false;
    }

    setEvents((prev) => prev.filter((e) => e.id !== id));
    return true;
  }, []);

  // 🔹 Auto-fetch on mount
  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  return {
    events,
    loading,
    error,
    eventCount,
    fetchEvents,
    fetchEventById,
    fetchEventCountByUser,
    createEvent,
    updateEvent,
    deleteEvent,
  };
}
