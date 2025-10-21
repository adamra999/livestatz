import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface Fan {
  id: string;
  user_id: string;
  name: string;
  email: string;
  avatar_url?: string;
  phone?: string;
  location?: string;
  segment?: string;
  total_spent?: number;
  events_attended?: number;
  comments_count?: number;
  first_interaction_date?: string;
  last_interaction_date?: string;
  created_at: string;
  updated_at: string;
}

export function useFans() {
  const [fans, setFans] = useState<Fan[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  // Get current user
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUserId(user?.id || null);
    };
    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserId(session?.user?.id || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Fetch all fans for current user
  const fetchFans = useCallback(async () => {
    if (!userId) return;
    
    setLoading(true);
    setError(null);

    const { data, error } = await supabase
      .from("fans")
      .select("*")
      .eq("user_id", userId)
      .order("last_interaction_date", { ascending: false });

    if (error) {
      console.error("Error fetching fans:", error);
      setError(error.message);
    } else {
      setFans(data ?? []);
    }

    setLoading(false);
  }, [userId]);

  // Create new fan
  const createFan = useCallback(
    async (newFan: Omit<Fan, "id" | "created_at" | "updated_at" | "user_id">) => {
      if (!userId) {
        setError("User not authenticated");
        return null;
      }

      setLoading(true);
      setError(null);

      try {
        const { data, error } = await supabase
          .from("fans")
          .insert([{ ...newFan, user_id: userId }])
          .select()
          .single();

        if (error) throw error;

        setFans((prev) => [data as Fan, ...prev]);
        setLoading(false);
        return data as Fan;
      } catch (err: any) {
        console.error("Error creating fan:", err);
        setError(err.message);
        setLoading(false);
        return null;
      }
    },
    [userId]
  );

  // Update existing fan
  const updateFan = useCallback(async (id: string, updates: Partial<Fan>) => {
    setLoading(true);
    setError(null);

    const { data, error } = await supabase
      .from("fans")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating fan:", error);
      setError(error.message);
      setLoading(false);
      return null;
    }

    setFans((prev) => prev.map((f) => (f.id === id ? (data as Fan) : f)));

    setLoading(false);
    return data as Fan;
  }, []);

  // Delete fan
  const deleteFan = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);

    const { error } = await supabase.from("fans").delete().eq("id", id);

    if (error) {
      console.error("Error deleting fan:", error);
      setError(error.message);
      setLoading(false);
      return false;
    }

    setFans((prev) => prev.filter((f) => f.id !== id));
    setLoading(false);
    return true;
  }, []);

  // Fetch fans when userId is available
  useEffect(() => {
    if (userId) {
      fetchFans();
    }
  }, [userId, fetchFans]);

  return {
    fans,
    loading,
    error,
    userId,
    fetchFans,
    createFan,
    updateFan,
    deleteFan,
  };
}
