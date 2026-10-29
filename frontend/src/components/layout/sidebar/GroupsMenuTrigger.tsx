import { CollapsibleTrigger } from "@/components/ui/collapsible";
import { SidebarMenuButton, useSidebar } from "@/components/ui/sidebar";
import { ChevronRight, MessageCircle } from "lucide-react";

const GroupsMenuTrigger = () => {
  const { open, setOpen } = useSidebar();

  return (
    <CollapsibleTrigger asChild>
      <SidebarMenuButton
        onClick={() => {
          if (!open) setOpen(true);
        }}
      >
        <div className="flex items-center gap-2">
          <MessageCircle className="size-4" />
          {open && <span>Scientific Discussion Groups</span>}
        </div>
        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
      </SidebarMenuButton>
    </CollapsibleTrigger>
  );
};

export default GroupsMenuTrigger;
