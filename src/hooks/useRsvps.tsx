import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface Rsvp {
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
  const [rsvps, setRsvps] = useState<Rsvp[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setUserId(user?.id || null);
      } catch (err) {
        if (err instanceof Error && err.message !== "Auth session missing!") {
          console.error("Error fetching user:", err);
          setError(err.message);
        }
      }
    };

    fetchUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserId(session?.user?.id || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchRsvps = useCallback(async (eventId?: string) => {
    try {
      setLoading(true);
      let query = supabase.from("rsvps").select("*");
      
      if (eventId) {
        query = query.eq("event_id", eventId);
      }

      const { data, error: fetchError } = await query.order("created_at", { ascending: false });

      if (fetchError) throw fetchError;
      setRsvps(data || []);
      setError(null);
    } catch (err) {
      console.error("Error fetching RSVPs:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch RSVPs");
    } finally {
      setLoading(false);
    }
  }, []);

  const createRsvp = useCallback(async (rsvpData: {
    event_id: string;
    fan_id: string;
    status?: string;
  }) => {
    try {
      const { data, error: insertError } = await supabase
        .from("rsvps")
        .insert([rsvpData])
        .select()
        .single();

      if (insertError) throw insertError;

      setRsvps((prev) => [data, ...prev]);
      return { data, error: null };
    } catch (err) {
      console.error("Error creating RSVP:", err);
      const errorMessage = err instanceof Error ? err.message : "Failed to create RSVP";
      setError(errorMessage);
      return { data: null, error: errorMessage };
    }
  }, []);

  const updateRsvp = useCallback(async (id: string, updates: Partial<Rsvp>) => {
    try {
      const { data, error: updateError } = await supabase
        .from("rsvps")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (updateError) throw updateError;

      setRsvps((prev) =>
        prev.map((rsvp) => (rsvp.id === id ? data : rsvp))
      );
      return { data, error: null };
    } catch (err) {
      console.error("Error updating RSVP:", err);
      const errorMessage = err instanceof Error ? err.message : "Failed to update RSVP";
      setError(errorMessage);
      return { data: null, error: errorMessage };
    }
  }, []);

  const deleteRsvp = useCallback(async (id: string) => {
    try {
      const { error: deleteError } = await supabase
        .from("rsvps")
        .delete()
        .eq("id", id);

      if (deleteError) throw deleteError;

      setRsvps((prev) => prev.filter((rsvp) => rsvp.id !== id));
      return { error: null };
    } catch (err) {
      console.error("Error deleting RSVP:", err);
      const errorMessage = err instanceof Error ? err.message : "Failed to delete RSVP";
      setError(errorMessage);
      return { error: errorMessage };
    }
  }, []);

  const getRsvpByEventAndFan = useCallback(async (eventId: string, fanId: string) => {
    try {
      const { data, error: fetchError } = await supabase
        .from("rsvps")
        .select("*")
        .eq("event_id", eventId)
        .eq("fan_id", fanId)
        .maybeSingle();

      if (fetchError) throw fetchError;
      return { data, error: null };
    } catch (err) {
      console.error("Error fetching RSVP:", err);
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch RSVP";
      return { data: null, error: errorMessage };
    }
  }, []);

  return {
    rsvps,
    loading,
    error,
    userId,
    fetchRsvps,
    createRsvp,
    updateRsvp,
    deleteRsvp,
    getRsvpByEventAndFan,
  };
};
