import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface User {
  id: string;
  name?: string;
  email: string;
  avatar?: string;
  passwordHash?: string;
  phone?: string;
  role?: "fan" | "influencer" | "admin";
  socialId?: string;
  createdAt: string;
  updatedAt: string;
}

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // ✅ Fetch all users
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);

    const { data, error } = await supabase
      .from("users")
      .select("*")
      .order("createdAt", { ascending: false });

    if (error) {
      console.error("Error fetching users:", error);
      setError(error.message);
    } else {
      setUsers(data ?? []);
    }

    setLoading(false);
  }, []);

  // ✅ Create new user (with duplicate email check)
  const createUser = useCallback(
    async (newUser: Omit<User, "createdAt" | "updatedAt">) => {
      setLoading(true);
      setError(null);

      try {
        // 1️⃣ Check if user already exists
        const { data: existingUser, error: checkError } = await supabase
          .from("users")
          .select("*")
          .eq("email", newUser.email)
          .maybeSingle();

        if (checkError) throw checkError;

        if (existingUser) {
          console.warn("User already exists:", existingUser);
          setLoading(false);
          return existingUser as User;
        }

        // 2️⃣ Create new user
        const now = new Date().toISOString();
        const userData = { ...newUser, createdAt: now, updatedAt: now };

        const { data, error } = await supabase
          .from("users")
          .insert([userData])
          .select()
          .single();

        if (error) throw error;

        setUsers((prev) => [data as User, ...prev]);
        setLoading(false);
        return data as User;
      } catch (err: any) {
        console.error("Error creating user:", err);
        setError(err.message);
        setLoading(false);
        return null;
      }
    },
    []
  );

  // ✅ Update existing user
  const updateUser = useCallback(async (id: string, updates: Partial<User>) => {
    setLoading(true);
    setError(null);

    const { data, error } = await supabase
      .from("users")
      .update({ ...updates, updatedAt: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating user:", error);
      setError(error.message);
      setLoading(false);
      return null;
    }

    setUsers((prev) => prev.map((u) => (u.id === id ? (data as User) : u)));

    setLoading(false);
    return data as User;
  }, []);

  // ✅ Delete user
  const deleteUser = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);

    const { error } = await supabase.from("users").delete().eq("id", id);

    if (error) {
      console.error("Error deleting user:", error);
      setError(error.message);
      setLoading(false);
      return false;
    }

    setUsers((prev) => prev.filter((u) => u.id !== id));
    setLoading(false);
    return true;
  }, []);

  // ✅ Fetch all users when mounted
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return {
    users,
    loading,
    error,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
  };
}
