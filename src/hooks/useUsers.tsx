import { useState, useEffect, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY!
);

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

export const useUsers = () => {
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
      setUsers(data as User[]);
    }
    setLoading(false);
  }, []);

  // ✅ Create new user (with duplicate email check)
  const createUser = useCallback(
    async (newUser: Omit<User, "createdAt" | "updatedAt">) => {
      try {
        // Step 1: Check if user already exists by email
        const { data: existingUser, error: checkError } = await supabase
          .from("users")
          .select("*")
          .eq("email", newUser.email)
          .maybeSingle();

        if (checkError) throw checkError;

        if (existingUser) {
          console.warn("User already exists:", existingUser);
          return existingUser as User; // Return existing user instead of creating new one
        }

        // Step 2: Create new user
        const now = new Date().toISOString();
        const userData = { ...newUser, createdAt: now, updatedAt: now };
        const { data, error } = await supabase
          .from("users")
          .insert([userData])
          .select()
          .single();

        if (error) throw error;

        setUsers((prev) => [data as User, ...prev]);
        return data as User;
      } catch (err: any) {
        console.error("Error creating user:", err);
        setError(err.message);
        return null;
      }
    },
    []
  );

  // ✅ Update existing user
  const updateUser = useCallback(async (id: string, updates: Partial<User>) => {
    const { data, error } = await supabase
      .from("users")
      .update({ ...updates, updatedAt: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating user:", error);
      setError(error.message);
      return null;
    }

    setUsers((prev) => prev.map((u) => (u.id === id ? (data as User) : u)));
    return data as User;
  }, []);

  // ✅ Delete user
  const deleteUser = useCallback(async (id: string) => {
    const { error } = await supabase.from("users").delete().eq("id", id);
    if (error) {
      console.error("Error deleting user:", error);
      setError(error.message);
      return false;
    }
    setUsers((prev) => prev.filter((u) => u.id !== id));
    return true;
  }, []);

  // Load all users initially
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
};
