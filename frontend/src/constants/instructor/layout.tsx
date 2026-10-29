import { Book, Calendar, type LucideProps } from "lucide-react";
import type { ForwardRefExoticComponent, RefAttributes } from "react";

export const INSTRUCTOR_SIDEBAR_ITEMS: {
  title: string;
  url: string;
  icon: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
}[] = [
  {
    icon: Book,
    url: "/instructor/courses",
    title: "My Courses",
  },
  {
    icon: Calendar,
    url: "/instructor/calendar",
    title: "Calendar",
  },
] as const;
if(import.meta.env.VITE_HOSTED==="1")INSTRUCTOR_SIDEBAR_ITEMS.push({icon:Book,title:"Course Catalogue",url:"/catalog"});
