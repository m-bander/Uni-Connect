import { pgEnum } from "drizzle-orm/pg-core";

export const assignmentTypes = pgEnum("assignment_types", [
  "announcement",
  "poll",
]);
