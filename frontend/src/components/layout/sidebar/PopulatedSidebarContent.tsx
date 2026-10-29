import GroupsMenuItem from "@/components/layout/sidebar/GroupsMenuItem";
import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { ADMIN_SIDEBAR_ITEMS } from "@/constants/admin/layout";
import { INSTRUCTOR_SIDEBAR_ITEMS } from "@/constants/instructor/layout";
import { STUDENT_SIDEBAR_ITEMS } from "@/constants/student/layout";
import { useHasRole } from "@/hooks/use-has-role";
import { Link } from "react-router-dom";

const PopulatedSidebarContent = () => {
  const { hasRole } = useHasRole();

  const getSidebarItems = () => {
    // TODO: Filter some its by role
    if (hasRole("student", "class_representative", "course_head"))
      return STUDENT_SIDEBAR_ITEMS;
    else if (hasRole("professor/ta")) return INSTRUCTOR_SIDEBAR_ITEMS;
    else if (hasRole("system_admin")) return ADMIN_SIDEBAR_ITEMS;

    return [];
  };

  // TODO: Highlight the selected sidebar item to deliver a better UX
  return (
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupContent>
          <SidebarMenu>
            {getSidebarItems().map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild>
                  <p>
                    <item.icon />

                    <Link to={item.url}>
                      <span>{item.title}</span>
                    </Link>
                  </p>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
            {hasRole("class_representative", "course_head", "student", "professor/ta") && (
              <GroupsMenuItem />
            )}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  );
};

export default PopulatedSidebarContent;
