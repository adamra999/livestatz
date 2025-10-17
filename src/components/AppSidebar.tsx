import {
  Home,
  User,
  Video,
  BarChart3,
  Calendar,
  Tv,
  UserCircle,
  Users,
  Heart,
  MessageSquare,
  Gift,
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const mainItems = [
  { title: "Dashboard", url: "/", icon: Home },
  // { title: "Events", url: "/?view=events", icon: Tv },
  { title: "Events", url: "/events", icon: Tv },
  { title: "Analytics", url: "/analytics", icon: BarChart3 },
  { title: "Calendar", url: "/calendar", icon: Calendar },
  { title: "Bio Builder", url: "/bio-builder", icon: User },
  { title: "ClipGen", url: "/content-manager", icon: Video },
  { title: "Profile", url: "/profile", icon: UserCircle },
];

const fanCrmItems = [
  { title: "Fan Database", url: "/fan-database", icon: Users },
  { title: "Segmentation", url: "/interactions", icon: MessageSquare },
  { title: "Workflows", url: "/rewards", icon: Gift },
  { title: "Collabs", url: "/favorites", icon: Heart },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => {
    if (path === "/" && currentPath === "/" && !location.search) return true;
    if (
      path.includes("?view=") &&
      currentPath === "/" &&
      location.search.includes(path.split("?view=")[1])
    )
      return true;
    if (
      path !== "/" &&
      !path.includes("?view=") &&
      currentPath.startsWith(path)
    )
      return true;
    return false;
  };

  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive
      ? "bg-accent text-accent-foreground font-medium"
      : "hover:bg-accent/50";

  return (
    <Sidebar className={state === "collapsed" ? "w-14" : "w-60"}>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === "/"}
                      className={({ isActive: navIsActive }) =>
                        getNavCls({
                          isActive: navIsActive || isActive(item.url),
                        })
                      }
                    >
                      <item.icon className="h-4 w-4" />
                      {state !== "collapsed" && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Fan CRM</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {fanCrmItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className={({ isActive: navIsActive }) =>
                        getNavCls({
                          isActive: navIsActive || isActive(item.url),
                        })
                      }
                    >
                      <item.icon className="h-4 w-4" />
                      {state !== "collapsed" && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
