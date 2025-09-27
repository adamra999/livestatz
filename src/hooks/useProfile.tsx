import { useState, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";

// 👇 Setup Supabase client
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY!
);

export interface Profile {
  id: string;
  username: string;
  full_name: string;
  email: string;
}

export function useProfile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Insert profile
  const insertProfile = useCallback(
    async (newUserId: string, data: Omit<Profile, "id">) => {
      setLoading(true);
      setError(null);

      const { data: inserted, error } = await supabase
        .from("profiles")
        .insert([{ id: newUserId, ...data }])
        .select()
        .single();

      setLoading(false);

      if (error) {
        setError(error.message);
        console.error("Error inserting profile:", error);
        return null;
      } else {
        setProfile(inserted);
        return inserted;
      }
    },
    []
  );

  // Fetch profile by ID
  const fetchProfile = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", id)
      .single();

    setLoading(false);

    if (error) {
      setError(error.message);
      console.error("Error fetching profile:", error);
      return null;
    } else {
      setProfile(data);
      return data;
    }
  }, []);

  // Fetch profile by Email
  const fetchProfileByEmail = useCallback(async (email: string) => {
    setLoading(true);
    setError(null);

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("email", email)
      .single();

    setLoading(false);

    if (error) {
      setError(error.message);
      console.error("Error fetching profile by email:", error);
      return null;
    } else {
      setProfile(data);
      return data;
    }
  }, []);

  // Update profile
  const updateProfile = useCallback(
    async (id: string, updates: Partial<Profile>) => {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      setLoading(false);

      if (error) {
        setError(error.message);
        console.error("Error updating profile:", error);
        return null;
      } else {
        setProfile(data);
        return data;
      }
    },
    []
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
