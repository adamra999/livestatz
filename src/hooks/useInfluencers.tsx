import { useState, useEffect, useCallback } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export interface Influencer {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

const STORAGE_KEY = "influencers_cache";

export function useInfluencers() {
  const [influencers, setInfluencers] = useState<Influencer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // ✅ Fetch current user
  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      // Silently handle missing session - this is expected when not logged in
      if (error && error.name !== "AuthSessionMissingError") {
        console.error("Error fetching user:", error);
      }
      setCurrentUser(user);
    };
    fetchUser();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setCurrentUser(session?.user ?? null);
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  // ✅ Load from cache
  useEffect(() => {
    const cached = sessionStorage.getItem(STORAGE_KEY);
    if (cached) {
      try {
        setInfluencers(JSON.parse(cached));
      } catch {
        sessionStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  // ✅ Save cache
  useEffect(() => {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(influencers));
  }, [influencers]);

  // ✅ Fetch all influencers
  const fetchInfluencers = useCallback(async () => {
    setLoading(true);
    setError(null);

    const { data, error } = await supabase
      .from("Influencers")
      .select("*")
      .order("createdAt", { ascending: false });

    if (error) setError(error.message);
    else setInfluencers(data ?? []);

    setLoading(false);
  }, []);

  // ✅ Fetch influencer by email
  const fetchInfluencerByEmail = useCallback(async (email: string) => {
    if (!email) return null;
    setLoading(true);
    setError(null);

    const { data, error } = await supabase
      .from("Influencers")
      .select("*")
      .eq("email", email)
      .maybeSingle(); // simpler than single() + error check

    if (error) setError(error.message);
    setLoading(false);
    return data;
  }, []);

  // ✅ Add influencer
  const addInfluencer = useCallback(
    async (id: string, name: string, email: string) => {
      setLoading(true);
      setError(null);

      if (!id) {
        setError("Id must be provided.");
        setLoading(false);
        return null;
      }

      const existing = await fetchInfluencerByEmail(email);
      if (existing) {
        setError("Influencer with this email already exists.");
        setLoading(false);
        return null;
      }

      const newInfluencer = {
        id,
        name,
        email,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from("Influencers")
        .insert([newInfluencer])
        .select()
        .single();

      if (error) setError(error.message);
      else setInfluencers((prev) => [data, ...prev]);

      setLoading(false);
      return data;
    },
    [fetchInfluencerByEmail]
  );

  // ✅ Update influencer
  const updateInfluencer = useCallback(
    async (id: string, updates: Partial<Influencer>) => {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from("Influencers")
        .update({ ...updates, updatedAt: new Date().toISOString() })
        .eq("id", id)
        .select()
        .single();

      if (error) setError(error.message);
      else
        setInfluencers((prev) =>
          prev.map((inf) => (inf.id === id ? data : inf))
        );

      setLoading(false);
      return data;
    },
    []
  );

  // ✅ Delete influencer
  const deleteInfluencer = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);

    const { error } = await supabase.from("Influencers").delete().eq("id", id);
    if (error) setError(error.message);
    else setInfluencers((prev) => prev.filter((i) => i.id !== id));

    setLoading(false);
  }, []);

  return {
    influencers,
    loading,
    error,
    currentUser,
    fetchInfluencers,
    fetchInfluencerByEmail,
    addInfluencer,
    updateInfluencer,
    deleteInfluencer,
  };
}
