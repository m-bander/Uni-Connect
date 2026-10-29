import Logo from "@/components/global/Logo";
import PopulatedSidebarContent from "@/components/layout/sidebar/PopulatedSidebarContent";
import {
  Sidebar,
  SidebarFooter,
  SidebarHeader,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";

const GlobalSidebar = () => {
  const { open } = useSidebar();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <Logo showText={open} asLink />
      </SidebarHeader>
      <PopulatedSidebarContent />
      <SidebarFooter>
        <SidebarTrigger />
      </SidebarFooter>
    </Sidebar>
  );
};

export default GlobalSidebar;
