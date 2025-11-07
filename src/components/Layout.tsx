import { ReactNode } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import livestatzLogo from "@/assets/livestatz-logo.svg";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const showBackButton = ['/events', '/calendar', '/analytics'].includes(location.pathname);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1">
          <header className="h-12 flex items-center justify-between border-b bg-gradient-primary text-white px-4">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="text-white hover:text-white/90" />
            </div>
            <div className="flex items-center gap-2">
              <img src={livestatzLogo} alt="LiveStatz" className="h-6 w-6" />
              <span className="font-semibold text-white">LiveStatz</span>
            </div>
            {showBackButton && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/dashboard")}
                className="text-white hover:bg-white/10 hover:text-white"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
            )}
            {!showBackButton && <div className="w-10"></div>}
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