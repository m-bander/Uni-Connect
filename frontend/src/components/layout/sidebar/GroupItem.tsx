import { SidebarMenuButton, SidebarMenuSubItem } from "@/components/ui/sidebar";
import type { Group } from "@/types/student/group";
import { SquareArrowOutUpRight } from "lucide-react";
import { useGetRoleUrl } from "@/hooks/use-role-url";
import { Link } from "react-router-dom";

type GroupItemProps = {
  group: Omit<Group, "messages">;
};

const GroupItem = ({ group }: GroupItemProps) => {
  const {getRoleUrl}=useGetRoleUrl();
  return (
    <SidebarMenuSubItem key={group.id}>
      <SidebarMenuButton asChild>
        <Link
          to={`/${getRoleUrl()}/groups/${group.id}`}
          className="flex items-center justify-between"
        >
          {group.name}
          <SquareArrowOutUpRight />
        </Link>
      </SidebarMenuButton>
    </SidebarMenuSubItem>
  );
};

export default GroupItem;
