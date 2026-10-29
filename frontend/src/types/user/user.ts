import type { ROLES } from "@/constants/user/role";
import type { serverRolesType } from "../api/auth";
import type { YEARS } from "@/constants/student/student";

export type Role = (typeof ROLES)[number];

export type User = {
  image_url?: string;
  first_name: string;
  parent_name: string;
  grandparent_name?: string;
  family_name?: string;
  email: string;
  id: string;
  role: serverRolesType;
  // Since global user is deleted
  // It is needed for the stuff that used globalUser
  // optional shouldn't cause anything right?  :)
  code?: string;
  year?: (typeof YEARS)[number];
};

// serverRolesType : "student" | "professor/ta" | "system_admin" | "class_representative" | "course_head";
// YEARS: "1" | "2" | "3" | "4" | "5"