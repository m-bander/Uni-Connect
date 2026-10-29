import { pgEnum } from "drizzle-orm/pg-core";

export const USER_ROLES = [
  "student",
  "professor/ta",
  "system_admin",
  "class_representative",
  "course_head",
] as const;

export const roles = pgEnum("roles", USER_ROLES);
