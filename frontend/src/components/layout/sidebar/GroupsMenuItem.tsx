import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import { SidebarMenuItem, SidebarMenuSub } from "@/components/ui/sidebar";
import useGroups from "@/hooks/student/use-groups";
import GroupItem from "./GroupItem";
import GroupsMenuTrigger from "./GroupsMenuTrigger";

const GroupsMenuItem = () => {
  const { groups } = useGroups();

  return (
    <Collapsible className="group/collapsible">
      <SidebarMenuItem>
        <GroupsMenuTrigger />
        <CollapsibleContent>
          <SidebarMenuSub>
            {groups?.map((group) => (
              <GroupItem key={group.id} group={group} />
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  );
};

export default GroupsMenuItem;
