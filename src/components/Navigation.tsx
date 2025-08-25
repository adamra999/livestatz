import { Link, useLocation } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

const Navigation = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <NavigationMenu className="max-w-none">
          <NavigationMenuList className="space-x-1">
            <NavigationMenuItem>
              <Link to="/">
                <NavigationMenuLink
                  className={cn(
                    navigationMenuTriggerStyle(),
                    isActive("/") && "bg-accent text-accent-foreground"
                  )}
                >
                  Home
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            
            <NavigationMenuItem>
              <Link to="/bio-builder">
                <NavigationMenuLink
                  className={cn(
                    navigationMenuTriggerStyle(),
                    isActive("/bio-builder") && "bg-accent text-accent-foreground"
                  )}
                >
                  Bio Builder
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            
            <NavigationMenuItem>
              <Link to="/content-manager">
                <NavigationMenuLink
                  className={cn(
                    navigationMenuTriggerStyle(),
                    isActive("/content-manager") && "bg-accent text-accent-foreground"
                  )}
                >
                  ClipGen
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </nav>
  );
};

export default Navigation;