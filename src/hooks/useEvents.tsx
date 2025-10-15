import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Json } from "@/integrations/supabase/types";

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
  selectedFanGroups?: Json; // ✅ fixed type
  inviteEmails?: Json; // ✅ fixed type
  tags?: Json; // ✅ fixed type
  createdAt: string;
  updatedAt: string;
  influencerId?: string;
  attendeeBenefits?: Json; // ✅ added in case table has this column
  includePerks?: boolean; // ✅ added if exists in your schema
}

export function useEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [eventCount, setEventCount] = useState<number | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  // 🔹 Load current user on mount
  useEffect(() => {
    const getCurrentUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) setUserId(user.id);
    };
    getCurrentUser();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUserId(session?.user?.id ?? null);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  // 🔹 Fetch all events
  const fetchEvents = useCallback(async () => {
    setLoading(true);
    setError(null);

    const { data, error } = await supabase
      .from("Events")
      .select("*")
      .order("createdAt", { ascending: false });

    if (error) setError(error.message);
    else setEvents((data ?? []) as Event[]); // ✅ explicitly cast

    setLoading(false);
  }, []);

  // 🔹 Fetch single event
  const fetchEventById = useCallback(
    async (id: string): Promise<Event | null> => {
      if (!id) return null;
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from("Events")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (error) setError(error.message);
      setLoading(false);
      return data as Event | null;
    },
    []
  );

  // 🔹 Fetch event count for user
  const fetchEventCountByUser = useCallback(async (userId: string) => {
    if (!userId) return 0;
    setLoading(true);
    setError(null);

    const { count, error } = await supabase
      .from("Events")
      .select("*", { count: "exact" })
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

  // 🔹 Automatically update event count
  useEffect(() => {
    if (userId) fetchEventCountByUser(userId);
  }, [userId, fetchEventCountByUser]);

  // 🔹 Create event
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

  // 🔹 Auto-fetch events on mount
  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  return {
    events,
    loading,
    error,
    eventCount,
    userId,
    fetchEvents,
    fetchEventById,
    fetchEventCountByUser,
    createEvent,
    updateEvent,
    deleteEvent,
  };
}
