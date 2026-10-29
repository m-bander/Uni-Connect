import { relations } from "drizzle-orm";
import { CoursesTable } from "../schemas/course";
import { event } from "../schemas/event";

export const eventRelations = relations(event, ({ one }) => ({
  course: one(CoursesTable, {
    fields: [event.course_id],
    references: [CoursesTable.code],
  }),
}));
