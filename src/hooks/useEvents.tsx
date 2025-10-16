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
  selectedFanGroups?: Json;
  inviteEmails?: Json;
  tags?: Json;
  createdAt: string;
  updatedAt: string;
  influencerId?: string;
  attendeeBenefits?: Json;
  includePerks?: boolean;
}

export function useEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [eventCount, setEventCount] = useState<number | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  // 🔹 Track user session
  useEffect(() => {
    const loadUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) setUserId(user.id);
    };
    loadUser();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUserId(session?.user?.id ?? null);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  // 🔹 Fetch events for current user
  const fetchEvents = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    setError(null);

    const { data, error } = await supabase
      .from("Events")
      .select("*")
      .eq("influencerId", userId)
      .order("createdAt", { ascending: false });

    if (error) setError(error.message);
    else setEvents((data ?? []) as Event[]);

    setLoading(false);
  }, [userId]);

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

  // 🔹 Fetch event count
  const fetchEventCountByUser = useCallback(async (uid: string) => {
    if (!uid) return 0;
    const { count, error } = await supabase
      .from("Events")
      .select("*", { count: "exact" })
      .eq("influencerId", uid);

    if (error) {
      setError(error.message);
      setEventCount(null);
    } else {
      setEventCount(count ?? 0);
    }

    return count ?? 0;
  }, []);

  // 🔹 Auto update event count when userId changes
  useEffect(() => {
    if (userId) fetchEventCountByUser(userId);
  }, [userId, fetchEventCountByUser]);

  // 🔹 Create new event
  const createEvent = useCallback(
    async (
      eventData: Omit<Event, "id" | "createdAt" | "updatedAt" | "url" | "link">
    ) => {
      if (!userId) {
        setError("User not authenticated");
        return null;
      }

      const eventId = crypto.randomUUID();
      const eventUrl = `https://livestatz.com/e/${eventId}`;
      const now = new Date().toISOString();

      const { data, error } = await supabase
        .from("Events")
        .insert([
          {
            ...eventData,
            id: eventId,
            createdAt: now,
            updatedAt: now,
            url: eventUrl,
            link: eventUrl,
            influencerId: userId,
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
    [userId]
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

  // 🔹 Auto-fetch events when userId is ready
  useEffect(() => {
    if (userId) fetchEvents();
  }, [userId, fetchEvents]);

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
