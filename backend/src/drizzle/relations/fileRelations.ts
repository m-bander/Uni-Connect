import { relations } from "drizzle-orm";
import { assignmentsFiles, FileTable } from "../schemas/file";
import { MaterialTable } from "../schemas/materials";
import { assignment } from "../schemas/assignment";
import { submission, submissionsFiles } from "../schemas/submission";

export const fileRelations = relations(FileTable, ({ many, one }) => ({
  materials: many(MaterialTable),
  assignment: one(assignmentsFiles, {
    fields: [FileTable.id],
    references: [assignmentsFiles.file_id],
  }),
}));

export const assignmentFileRelations = relations(
  assignmentsFiles,
  ({ one }) => ({
    file: one(FileTable, {
      fields: [assignmentsFiles.file_id],
      references: [FileTable.id],
    }),
    assignment: one(assignment, {
      fields: [assignmentsFiles.assignment_id],
      references: [assignment.id],
    }),
  })
);

export const submissionFileRelations = relations(
  submissionsFiles,
  ({ one }) => ({
    file: one(FileTable, {
      fields: [submissionsFiles.file_id],
      references: [FileTable.id],
    }),
    submission: one(submission, {
      fields: [submissionsFiles.submission_id],
      references: [submission.id],
    }),
  })
);
