import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Outlet } from "react-router";
import NavBar from "./NavBar";
import GlobalSidebar from "./GlobalSidebar";

const GlobalLayout = () => {
  return (
    <SidebarProvider defaultOpen className="flex items-start">
      <GlobalSidebar />
      <SidebarInset className="flex flex-col self-stretch">
        <NavBar />
        <div className="p-3 grow flex flex-col">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default GlobalLayout;
