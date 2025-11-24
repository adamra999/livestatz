import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useFans } from "@/hooks/useFans";

export const useFanModal = () => {
  const { user } = useAuth();
  const { fans, loading: fansLoading } = useFans();
  const [showAddFanModal, setShowAddFanModal] = useState(false);
  const [fanName, setFanName] = useState("");
  const [fanEmail, setFanEmail] = useState("");

  // Check if current user is in fans table
  useEffect(() => {
    if (user && fans && fans?.length >= 0) {
      const userInFans = fans.find((fan) => fan.user_id === user.id);
      if (!userInFans && !fansLoading) {
        // User is authenticated but not in fans table
        setFanName(user.user_metadata?.full_name || "");
        setFanEmail(user.email || "");
        setShowAddFanModal(true);
      } else {
        setShowAddFanModal(false);
      }
    }
  }, [user, fans, fansLoading]);

  return {
    showAddFanModal,
    setShowAddFanModal,
    fanName,
    setFanName,
    fanEmail,
    setFanEmail,
  };
};

