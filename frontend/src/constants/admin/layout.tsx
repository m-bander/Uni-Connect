import {
  BookAlert,
  LayoutDashboard,
  ShieldUser,
  Book,
  User,
  type LucideProps,
  ChartBar,
} from "lucide-react";
import type { ForwardRefExoticComponent, RefAttributes } from "react";

export const ADMIN_SIDEBAR_ITEMS: {
  title: string;
  url: string;
  icon: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
}[] = [
  {
    icon: LayoutDashboard,
    url: "/admin/dashboard",
    title: "Dashboard",
  },
  {
    icon: ChartBar,
    url: "/admin/Statistics",
    title: "Statistics",
  },
  {
    icon: Book,
    url: "/admin/courses",
    title: "Courses",
  },
  {
    icon: User,
    url: "/admin/users",
    title: "Users",
  },
  {
    icon: BookAlert,
    url: "/admin/pending-users",
    title: "Pending Requests",
  },
  {
    icon: ShieldUser,
    url: "/admin/create-admin",
    title: "Create Admin",
  },
] as const;
