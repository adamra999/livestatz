import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export interface FanEvent {
  id: string;
  fan_id: string;
  event_id: string;
  event_name: string;
  ticket_price?: number;
  attendance_status?: string;
  attended_at?: string;
  created_at: string;
}

export const useFanEvents = () => {
  const { user } = useAuth();
  const [fanEvents, setFanEvents] = useState<FanEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFanEvents = async (fanId?: string) => {
    if (!user) {
      setError("User not authenticated");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from("fan_events")
        .select("*")
        .order("attended_at", { ascending: false });

      if (fanId) {
        query = query.eq("fan_id", fanId);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;

      setFanEvents(data || []);
    } catch (err: any) {
      setError(err.message);
      console.error("Error fetching fan events:", err);
    } finally {
      setLoading(false);
    }
  };

  const createFanEvent = async (fanEventData: {
    fan_id: string;
    event_id: string;
    event_name: string;
    ticket_price?: number;
    attendance_status?: string;
    attended_at?: string;
  }) => {
    if (!user) {
      return { data: null, error: "User not authenticated" };
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error: createError } = await supabase
        .from("fan_events")
        .insert([fanEventData])
        .select()
        .single();

      if (createError) throw createError;

      setFanEvents((prev) => [data, ...prev]);
      return { data, error: null };
    } catch (err: any) {
      const errorMessage = err.message;
      setError(errorMessage);
      console.error("Error creating fan event:", err);
      return { data: null, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const updateFanEvent = async (id: string, updates: Partial<FanEvent>) => {
    if (!user) {
      return { data: null, error: "User not authenticated" };
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error: updateError } = await supabase
        .from("fan_events")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (updateError) throw updateError;

      setFanEvents((prev) =>
        prev.map((event) => (event.id === id ? data : event))
      );
      return { data, error: null };
    } catch (err: any) {
      const errorMessage = err.message;
      setError(errorMessage);
      console.error("Error updating fan event:", err);
      return { data: null, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const deleteFanEvent = async (id: string) => {
    if (!user) {
      return { error: "User not authenticated" };
    }

    try {
      setLoading(true);
      setError(null);

      const { error: deleteError } = await supabase
        .from("fan_events")
        .delete()
        .eq("id", id);

      if (deleteError) throw deleteError;

      setFanEvents((prev) => prev.filter((event) => event.id !== id));
      return { error: null };
    } catch (err: any) {
      const errorMessage = err.message;
      setError(errorMessage);
      console.error("Error deleting fan event:", err);
      return { error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  return {
    fanEvents,
    loading,
    error,
    fetchFanEvents,
    createFanEvent,
    updateFanEvent,
    deleteFanEvent,
  };
};
