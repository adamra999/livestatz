import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { startOfWeek, endOfWeek } from "date-fns";

export interface WeeklyFanReport {
  newFansThisWeek: number;
  fansAttendedThisWeek: number;
  rsvpsGrowthThisWeek: number;
}

export const useWeeklyFanReports = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const userId = user?.id || null;

  const getNewFansThisWeek = useCallback(async () => {
    try {
      setLoading(true);
      if (!userId) return { count: 0, error: null };

      const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 }).toISOString();
      const weekEnd = endOfWeek(new Date(), { weekStartsOn: 1 }).toISOString();

      const { count, error: fetchError } = await supabase
        .from("fans")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId)
        .gte("created_at", weekStart)
        .lte("created_at", weekEnd);

      if (fetchError) throw fetchError;
      
      setError(null);
      return { count: count || 0, error: null };
    } catch (err) {
      console.error("Error fetching new fans this week:", err);
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch new fans";
      setError(errorMessage);
      return { count: 0, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const getFansAttendedThisWeek = useCallback(async () => {
    try {
      setLoading(true);
      if (!userId) return { count: 0, error: null };

      const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 }).toISOString();
      const weekEnd = endOfWeek(new Date(), { weekStartsOn: 1 }).toISOString();

      // Get distinct fans who attended events this week
      const { data, error: fetchError } = await supabase
        .from("fan_events")
        .select("fan_id, fans!inner(user_id)")
        .eq("fans.user_id", userId)
        .gte("attended_at", weekStart)
        .lte("attended_at", weekEnd);

      if (fetchError) throw fetchError;

      // Count unique fan_ids
      const uniqueFans = new Set(data?.map(item => item.fan_id) || []);
      
      setError(null);
      return { count: uniqueFans.size, error: null };
    } catch (err) {
      console.error("Error fetching fans attended this week:", err);
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch fans attended";
      setError(errorMessage);
      return { count: 0, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const getRsvpsGrowthThisWeek = useCallback(async () => {
    try {
      setLoading(true);
      if (!userId) return { count: 0, error: null };

      // Get current user's email
      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user?.email) return { count: 0, error: null };

      const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 }).toISOString();
      const weekEnd = endOfWeek(new Date(), { weekStartsOn: 1 }).toISOString();

      // Join rsvps with Events and Influencers to count RSVPs for current user's events this week
      const { count, error: fetchError } = await supabase
        .from("rsvps")
        .select("*, Events!inner(influencerId, Influencers!inner(email))", { count: "exact", head: true })
        .eq("Events.Influencers.email", userData.user.email)
        .gte("created_at", weekStart)
        .lte("created_at", weekEnd);

      if (fetchError) throw fetchError;
      
      setError(null);
      return { count: count || 0, error: null };
    } catch (err) {
      console.error("Error fetching RSVPs growth this week:", err);
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch RSVPs growth";
      setError(errorMessage);
      return { count: 0, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const getWeeklyReport = useCallback(async (): Promise<{ data: WeeklyFanReport | null; error: string | null }> => {
    try {
      setLoading(true);
      
      const [newFans, fansAttended, rsvpsGrowth] = await Promise.all([
        getNewFansThisWeek(),
        getFansAttendedThisWeek(),
        getRsvpsGrowthThisWeek(),
      ]);

      const report: WeeklyFanReport = {
        newFansThisWeek: newFans.count,
        fansAttendedThisWeek: fansAttended.count,
        rsvpsGrowthThisWeek: rsvpsGrowth.count,
      };

      setError(null);
      return { data: report, error: null };
    } catch (err) {
      console.error("Error fetching weekly report:", err);
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch weekly report";
      setError(errorMessage);
      return { data: null, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [getNewFansThisWeek, getFansAttendedThisWeek, getRsvpsGrowthThisWeek]);

  return {
    loading,
    error,
    userId,
    getNewFansThisWeek,
    getFansAttendedThisWeek,
    getRsvpsGrowthThisWeek,
    getWeeklyReport,
  };
};
