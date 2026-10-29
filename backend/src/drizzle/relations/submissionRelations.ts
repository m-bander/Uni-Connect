import { relations } from "drizzle-orm";
import { submission, submissionsFiles } from "../schemas/submission";
import { UsersTable } from "../schemas/user";

export const submissionRelations = relations(submission, ({ many, one }) => ({
  files: many(submissionsFiles),
  submitter: one(UsersTable, {
    fields: [submission.student_id],
    references: [UsersTable.id],
  }),
}));
