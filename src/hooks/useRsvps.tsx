import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface RSVP {
  id: string;
  event_id: string;
  fan_id: string;
  status: string;
  added_to_calendar: boolean;
  reminder_sent_30: boolean;
  reminder_sent_10: boolean;
  created_at: string;
  updated_at: string;
}

export const useRsvps = () => {
  const [rsvps, setRsvps] = useState<RSVP[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError) throw userError;
        setUserId(user?.id || null);
      } catch (err) {
        console.error("Error fetching user:", err);
        setUserId(null);
      }
    };

    getUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserId(session?.user?.id || null);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const fetchRsvps = useCallback(async () => {
    if (!userId) {
      setRsvps([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from("rsvps")
        .select("*")
        .order("created_at", { ascending: false });

      if (fetchError) throw fetchError;
      setRsvps(data || []);
      setError(null);
    } catch (err) {
      console.error("Error fetching RSVPs:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch RSVPs");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const fetchRsvpsByEvent = useCallback(async (eventId: string) => {
    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from("rsvps")
        .select("*")
        .eq("event_id", eventId)
        .order("created_at", { ascending: false });

      if (fetchError) throw fetchError;
      return data || [];
    } catch (err) {
      console.error("Error fetching RSVPs for event:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch RSVPs");
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchRsvpByFanAndEvent = useCallback(async (fanId: string, eventId: string) => {
    try {
      const { data, error: fetchError } = await supabase
        .from("rsvps")
        .select("*")
        .eq("fan_id", fanId)
        .eq("event_id", eventId)
        .maybeSingle();

      if (fetchError) throw fetchError;
      return data;
    } catch (err) {
      console.error("Error fetching RSVP:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch RSVP");
      return null;
    }
  }, []);

  const createRsvp = useCallback(async (rsvpData: {
    event_id: string;
    fan_id: string;
    status?: string;
    added_to_calendar?: boolean;
  }) => {
    if (!userId) {
      setError("User not authenticated");
      return null;
    }

    try {
      const { data, error: insertError } = await supabase
        .from("rsvps")
        .insert({
          ...rsvpData,
          status: rsvpData.status || "confirmed",
          added_to_calendar: rsvpData.added_to_calendar || false,
        })
        .select()
        .single();

      if (insertError) throw insertError;
      
      await fetchRsvps();
      setError(null);
      return data;
    } catch (err) {
      console.error("Error creating RSVP:", err);
      setError(err instanceof Error ? err.message : "Failed to create RSVP");
      return null;
    }
  }, [userId, fetchRsvps]);

  const updateRsvp = useCallback(async (id: string, updates: Partial<RSVP>) => {
    try {
      const { data, error: updateError } = await supabase
        .from("rsvps")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (updateError) throw updateError;
      
      await fetchRsvps();
      setError(null);
      return data;
    } catch (err) {
      console.error("Error updating RSVP:", err);
      setError(err instanceof Error ? err.message : "Failed to update RSVP");
      return null;
    }
  }, [fetchRsvps]);

  const deleteRsvp = useCallback(async (id: string) => {
    try {
      const { error: deleteError } = await supabase
        .from("rsvps")
        .delete()
        .eq("id", id);

      if (deleteError) throw deleteError;
      
      await fetchRsvps();
      setError(null);
      return true;
    } catch (err) {
      console.error("Error deleting RSVP:", err);
      setError(err instanceof Error ? err.message : "Failed to delete RSVP");
      return false;
    }
  }, [fetchRsvps]);

  useEffect(() => {
    if (userId) {
      fetchRsvps();
    }
  }, [userId, fetchRsvps]);

  return {
    rsvps,
    loading,
    error,
    userId,
    fetchRsvps,
    fetchRsvpsByEvent,
    fetchRsvpByFanAndEvent,
    createRsvp,
    updateRsvp,
    deleteRsvp,
  };
};
