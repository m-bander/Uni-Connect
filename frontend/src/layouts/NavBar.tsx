import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import Notifications from "@/components/layout/notifications/Notifications";
import Profile from "@/components/layout/profile/profile";
import { useHasRole } from "@/hooks/use-has-role";

const NavBar = () => {
  const { hasRole } = useHasRole();
  return (
    <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear">
      <NavigationMenu className="p-3 border-b flex justify-end shadow-sm max-w-none">
        <NavigationMenuList>
          <NavigationMenuItem>
            {hasRole("course_head", "student", "class_representative") && (
              <Notifications />
            )}
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Profile />
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </header>
  );
};

export default NavBar;
