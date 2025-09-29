import { useState, useEffect } from "react";

const STORAGE_KEY = "userProfile";

export function useUserProfile() {
  const [profile, setProfile] = useState(null);
  // Load from sessionStorage on first render
  useEffect(() => {
    const storedProfile = sessionStorage.getItem(STORAGE_KEY);
    if (storedProfile) {
      setProfile(JSON.parse(storedProfile));
    }
  }, []);

  // Save profile to sessionStorage whenever it changes
  useEffect(() => {
    if (profile) {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    }
  }, [profile]);

  // Update profile (merge with existing)
  const updateProfile = (updates) => {
    setProfile((prev) => {
      const newProfile = { ...prev, ...updates };
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(newProfile));
      return newProfile;
    });
  };

  // Clear profile (logout, etc.)
  const clearProfile = () => {
    sessionStorage.removeItem(STORAGE_KEY);
    setProfile(null);
  };

  return { profile, setProfile, updateProfile, clearProfile };
}
