import {
  Book,
  Calendar,
  LayoutDashboard,
  Megaphone,
  Users,
  type LucideProps,
} from "lucide-react";
import type { ForwardRefExoticComponent, RefAttributes } from "react";

export const STUDENT_SIDEBAR_ITEMS: {
  title: string;
  url: string;
  icon: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
}[] = [
  {
    icon: LayoutDashboard,
    title: "Dashboard",
    url: "/student/dashboard",
  },
  {
    icon: Calendar,
    url: "/student/calendar",
    title: "Deadlines Calendar",
  },
  {
    icon: Book,
    url: "/student/courses",
    title: "My Courses",
  },
  {
    icon: Megaphone,
    url: "/student/class-announcements",
    title: "Class Announcements",
  },
  {
    icon: Users,
    url: "/student/class-members",
    title: "Class Members",
  },
] as const;
if(import.meta.env.VITE_HOSTED==="1")STUDENT_SIDEBAR_ITEMS.splice(3,0,{icon:Book,title:"Course Catalogue",url:"/catalog"});
