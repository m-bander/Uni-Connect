import {
  date,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { CoursesTable } from "./course";
import { years } from "../enums/years";
import { UsersTable } from "./user";
import { createInsertSchema, createUpdateSchema } from "drizzle-zod";
import z from "zod";
import { assignmentTypes } from "../enums/assignment-types";

export const announcement = pgTable("announcement", {
  id: uuid().defaultRandom().primaryKey(),
  // Title could be null in a regular announcement
  title: text(),
  // Content could be null in a poll
  content: text(),
  created_at: timestamp({ withTimezone: true }).defaultNow().notNull(),
  announcer_id: uuid()
    .references(() => UsersTable.id, {
      onUpdate: "cascade",
      // I think the best thing to do for onDelete
      // is set null but keep it for now for tight-time sake
      // TODO: Change to set null and modify whatever needed in the front end or back end
      onDelete: "cascade",
    })
    .notNull(),
  type: assignmentTypes().notNull(),
});

// We have announcements for a certain course or for a certain class.
// As a best practice we split the announcements into two tables for each category in
// order to prevent the too many null cells issue.

export const classesAnnouncements = pgTable("classes_announcements", {
  announcement_id: uuid()
    .references(() => announcement.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    })
    .notNull(),
  class: years().notNull(),
});

export const coursesAnnouncements = pgTable("courses_announcements", {
  announcement_id: uuid()
    .references(() => announcement.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    })
    .notNull(),
  course_id: varchar({ length: 255 })
    .references(() => CoursesTable.code, {
      onDelete: "cascade",
      onUpdate: "cascade",
    })
    .notNull(),
});

export const announcementInsertSchema = createInsertSchema(announcement);
export type IAnnouncementInsert = z.infer<typeof announcementInsertSchema>;

export const announcementUpdateSchema = createUpdateSchema(announcement);
export type IAnnouncementUpdate = z.infer<typeof announcementUpdateSchema>;
