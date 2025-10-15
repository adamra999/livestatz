import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface Profile {
  id: string;
  username: string;
  full_name: string;
  email: string;
}

interface UseProfileResult {
  profile: Profile | null;
  loading: boolean;
  error: string | null;
  insertProfile: (
    newUserId: string,
    data: Omit<Profile, "id">
  ) => Promise<Profile | null>;
  fetchProfile: (id: string) => Promise<Profile | null>;
  fetchProfileByEmail: (email: string) => Promise<Profile | null>;
  updateProfile: (
    id: string,
    updates: Partial<Profile>
  ) => Promise<Profile | null>;
}

export function useProfile(): UseProfileResult {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 🔹 Generic async handler
  const runQuery = useCallback(
    async <T,>(
      queryFn: () => Promise<{ data: T | null; error: any }>
    ): Promise<T | null> => {
      setLoading(true);
      setError(null);
      try {
        const { data, error } = await queryFn();
        if (error) throw error;
        if (data) setProfile(data as Profile);
        return data;
      } catch (err: any) {
        console.error("Profile hook error:", err.message);
        setError(err.message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // 🔹 Insert profile
  const insertProfile = useCallback(
    (newUserId: string, data: Omit<Profile, "id">) =>
      runQuery(async () =>
        supabase
          .from("profiles")
          .insert([{ id: newUserId, ...data }])
          .select()
          .single()
      ),
    [runQuery]
  );

  // 🔹 Fetch by ID
  const fetchProfile = useCallback(
    (id: string) =>
      runQuery(async () =>
        supabase.from("profiles").select("*").eq("id", id).single()
      ),
    [runQuery]
  );

  // 🔹 Fetch by email
  const fetchProfileByEmail = useCallback(
    (email: string) =>
      runQuery(async () =>
        supabase.from("profiles").select("*").eq("email", email).single()
      ),
    [runQuery]
  );

  // 🔹 Update profile
  const updateProfile = useCallback(
    (id: string, updates: Partial<Profile>) =>
      runQuery(async () =>
        supabase.from("profiles").update(updates).eq("id", id).select().single()
      ),
    [runQuery]
  );

  return {
    profile,
    loading,
    error,
    insertProfile,
    fetchProfile,
    fetchProfileByEmail,
    updateProfile,
  };
}
