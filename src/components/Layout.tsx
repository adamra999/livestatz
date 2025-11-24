import { ReactNode, useState, useEffect } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import livestatzLogo from "@/assets/livestatz-logo.svg";
import { Button } from "@/components/ui/button";
import { ArrowLeft, LogOut, User } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  
  const showBackButton = ['/events', '/calendar', '/analytics'].includes(location.pathname);
  const isEventRSVPPage = location.pathname.startsWith('/e/');

  useEffect(() => {
    if (user) {
      loadProfileAvatar();
    }
  }, [user]);

  const loadProfileAvatar = async () => {
    if (!user) return;

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
  };

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

  // If user is not authenticated, show simplified layout without navigation
  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        {children}
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1">
          <header className="h-12 flex items-center justify-between border-b bg-gradient-primary text-white px-4">
            <div className="flex items-center gap-2">
              {!isEventRSVPPage && <SidebarTrigger className="text-white hover:text-white/90" />}
            </div>
            <div className="flex items-center gap-2">
              <img src={livestatzLogo} alt="LiveStatz" className="h-6 w-6" />
              <span className="font-semibold text-white">LiveStatz</span>
            </div>
            <div className="flex items-center gap-2">
              {showBackButton && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => navigate("/dashboard")}
                        className="text-white hover:bg-white/10 hover:text-white"
                      >
                        <ArrowLeft className="h-5 w-5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Back to Dashboard</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
              
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
                  <DropdownMenuItem onClick={() => navigate("/profile")}>
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
            </div>
          </header>
          <div className="p-4">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Layout;