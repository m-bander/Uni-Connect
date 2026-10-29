import {
  boolean,
  doublePrecision,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { assignment } from "./assignment";
import { FileTable } from "./file";
import { UsersTable } from "./user";
import { createUpdateSchema } from "drizzle-zod";

export const submission = pgTable("submission", {
  id: uuid().defaultRandom().primaryKey(),
  grade: doublePrecision(),
  submitted_at: timestamp({ withTimezone: true }).defaultNow().notNull(),
  assignment_id: uuid()
    .notNull()
    .references(() => assignment.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  student_id: uuid()
    .notNull()
    .references(() => UsersTable.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  is_turned_in: boolean().default(false).notNull(),
  feedback: text(),
  turned_in_at: timestamp({ withTimezone: true }),
});

export const updateSubmissionSchema = createUpdateSchema(submission);

export const submissionsFiles = pgTable(
  "submissions_files",
  {
    file_id: uuid()
      .references(() => FileTable.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      })
      .notNull(),
    submission_id: uuid()
      .references(() => submission.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      })
      .notNull(),
  },
  (table) => [primaryKey({ columns: [table.submission_id, table.file_id] })]
);
