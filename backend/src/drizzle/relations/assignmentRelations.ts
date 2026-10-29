import { relations } from "drizzle-orm";
import { assignment } from "../schemas/assignment";
import { CoursesTable } from "../schemas/course";
import { submissionsFiles } from "../schemas/submission";
import { UsersTable } from "../schemas/user";
import { assignmentsFiles } from "../schemas/file";

export const assignmentRelations = relations(assignment, ({ one, many }) => ({
  submissions: many(submissionsFiles),
  course: one(CoursesTable, {
    fields: [assignment.course_id],
    references: [CoursesTable.code],
  }),
  assigner: one(UsersTable, {
    fields: [assignment.assigner_id],
    references: [UsersTable.id],
  }),
  files: many(assignmentsFiles),
}));
