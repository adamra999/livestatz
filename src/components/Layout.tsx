import { ReactNode } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import livestatzLogo from "@/assets/livestatz-logo.svg";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1">
          <header className="h-12 flex items-center justify-start border-b bg-gradient-primary text-white px-4">
            <SidebarTrigger className="text-white hover:text-white/90" />
            <div className="flex items-center gap-2">
              <img src={livestatzLogo} alt="LiveStatz" className="h-6 w-6" />
              <span className="font-semibold text-white">LiveStatz</span>
            </div>
            <div className="w-7"></div>
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