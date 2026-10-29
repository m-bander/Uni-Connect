import { YEARS } from "@/constants/student/student";
import type { User } from "../user/user";
import type { serverRolesType } from "../api/auth";

type Subset<T extends K, K> = T;

type StudentRole = Subset<
  "student" | "class_representative" | "course_head",
  serverRolesType
>;

type StudentUser = User & {
  code: string;
  year: (typeof YEARS)[number];
  role: StudentRole;
};

export { type StudentUser };
