import {
  pgTable,
  uuid,
  varchar,
  text,
  date,
  timestamp,
} from "drizzle-orm/pg-core";
import { eventSources } from "../enums/event-sources";
import { CoursesTable } from "./course";
import { createInsertSchema, createUpdateSchema } from "drizzle-zod";
import z from "zod";

export const event = pgTable("event", {
  id: uuid().defaultRandom().primaryKey(),
  title: varchar({ length: 256 }).notNull(),
  notes: text(),
  type: eventSources().notNull(),
  deadline_at: timestamp({ withTimezone: true }).notNull(),
  course_id: varchar({ length: 255 })
    .references(() => CoursesTable.code, {
      onDelete: "cascade",
      onUpdate: "cascade",
    })
    .notNull(),
});

export const eventInsertSchema = createInsertSchema(event, {
  deadline_at: z.coerce.date(),
});

export const eventUpdateSchema = createUpdateSchema(event, {
  deadline_at: z.coerce.date().optional(),
});
