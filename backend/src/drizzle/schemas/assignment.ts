import {
  doublePrecision,
  pgTable,
  text,
  time,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { CoursesTable } from "./course";
import { UsersTable } from "./user";
import { createInsertSchema, createUpdateSchema } from "drizzle-zod";
import z from "zod";

export const assignment = pgTable("assignment", {
  id: uuid().defaultRandom().primaryKey(),
  course_id: varchar({ length: 255 })
    .notNull()
    .references(() => CoursesTable.code, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  title: varchar({ length: 256 }).notNull(),
  description: text(),
  deadline_at: timestamp({ withTimezone: true }).notNull(),
  created_at: timestamp({ withTimezone: true }).defaultNow().notNull(),
  assigner_id: uuid().references(() => UsersTable.id, {
    onDelete: "set null",
    onUpdate: "cascade",
  }),
  max_grade: doublePrecision().notNull(),
});

export const insertAssignmentSchema = createInsertSchema(assignment, {
  deadline_at: z.coerce.date(),
});
export const updateAssignmentSchema = createUpdateSchema(assignment, {
  deadline_at: z.coerce.date().optional(),
});
