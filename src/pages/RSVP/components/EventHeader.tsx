import { useState, useEffect, useCallback } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import livestatzLogo from "@/assets/livestatz-logo.svg";
import type { EventData } from "../types";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

interface EventHeaderProps {
  event: EventData;
}

export const EventHeader = ({ event }: EventHeaderProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);

  const loadProfileAvatar = useCallback(async () => {
    if (!user?.id) return;

    const { data } = await supabase
      .from("profiles")
      .select("avatar_url, username")
      .eq("id", user.id)
      .single();

    if (data) {
      setAvatarUrl(data.avatar_url || user.user_metadata?.avatar_url || null);
      setUsername(data.username || null);
    } else {
      setAvatarUrl(user.user_metadata?.avatar_url || null);
      setUsername(null);
    }
  }, [user?.id]);

  useEffect(() => {
    if (user?.id) {
      loadProfileAvatar();
    }
  }, [user?.id, loadProfileAvatar]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const getUserInitials = () => {
    if (!user) return "U";
    const name = user.user_metadata?.full_name || user.email || "";
    return name.charAt(0).toUpperCase();
  };

  const getUserDisplayName = () => {
    return username || user?.user_metadata?.full_name || user?.email?.split("@")[0] || "User";
  };

  return (
    <header className="bg-gradient-primary text-white shadow-md">
      <div className="container mx-auto px-4 py-4 max-w-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={livestatzLogo} alt="LiveStatz" className="h-8 w-8" />
            <div>
              <h1 className="font-semibold text-lg">LiveStatz</h1>
              <p className="text-white/80 text-sm">Event RSVP</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {event?.organizer && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-white/80 hidden sm:inline">
                  Hosted by
                </span>
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8 border-2 border-white/20">
                    <AvatarImage src={event.organizerAvatar} />
                    <AvatarFallback className="bg-white/20 text-white text-xs">
                      {event.organizer.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{event.organizer}</span>
                </div>
              </div>
            )}
            
            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2 text-white hover:bg-white/10 hover:text-white">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={avatarUrl || undefined} />
                      <AvatarFallback className="bg-white/20 text-white">
                        {getUserInitials()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden md:inline-block">{getUserDisplayName()}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-popover">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate("/profile", { state: { fromRSVP: true } })}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

