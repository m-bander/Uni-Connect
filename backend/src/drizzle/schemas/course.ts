import { pgTable, primaryKey, text, uuid, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema, createUpdateSchema } from "drizzle-zod";
import z from "zod";
import { years } from "../enums/years";
import { group } from "./group";
import { UsersTable } from "./user";

export const CoursesTable = pgTable("courses", {
  code: varchar({ length: 255 }).primaryKey().notNull(),
  name: varchar({ length: 255 }).notNull(),
  year: years().notNull(),
  department: varchar({length:255}).notNull().default("General Studies"),
  description: text(),
  image_url: text(),
  group_id: uuid()
    .references(() => group.id)
    .notNull(),
});

export const courseCreateSchema = createInsertSchema(CoursesTable);
export const courseUpdateSchema = createUpdateSchema(CoursesTable);

export type ICourseCreateSchema = z.infer<typeof courseCreateSchema>;
export type ICourseUpdateSchema = z.infer<typeof courseUpdateSchema>;

export const Teaches = pgTable(
  "teaches",
  {
    courseCode: varchar({ length: 255 })
      .notNull()
      .references(() => CoursesTable.code, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    userId: uuid()
      .notNull()
      .references(() => UsersTable.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
  },
  (table) => [primaryKey({ columns: [table.courseCode, table.userId] })]
);

export const enrolledIn = pgTable(
  "enrolledIn",
  {
    courseCode: varchar({ length: 255 })
      .notNull()
      .references(() => CoursesTable.code, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    userId: uuid()
      .notNull()
      .references(() => UsersTable.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
  },
  (table) => [primaryKey({ columns: [table.courseCode, table.userId] })]
);
export const manages = pgTable(
  "manages",
  {
    courseCode: varchar({ length: 255 })
      .notNull()
      .references(() => CoursesTable.code, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    userId: uuid()
      .notNull()
      .references(() => UsersTable.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
  },
  (table) => [primaryKey({ columns: [table.courseCode, table.userId] })]
);

export const blacklist = pgTable(
  "blacklist",
  {
    courseCode: varchar({ length: 255 })
      .notNull()
      .references(() => CoursesTable.code, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    userId: uuid()
      .notNull()
      .references(() => UsersTable.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
  },
  (table) => [primaryKey({ columns: [table.courseCode, table.userId] })]
);
