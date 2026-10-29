import { relations } from "drizzle-orm";
import { message } from "../schemas/message";
import { group } from "../schemas/group";
import { CoursesTable } from "../schemas/course";

export const groupRelations = relations(group, ({ many, one }) => ({
  messages: many(message, { relationName: "messages" }),
  course: one(CoursesTable),
}));
