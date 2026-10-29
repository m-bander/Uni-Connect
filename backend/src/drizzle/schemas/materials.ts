import { varchar } from "drizzle-orm/pg-core";
import { timestamp } from "drizzle-orm/pg-core";
import { uuid } from "drizzle-orm/pg-core";
import { pgTable } from "drizzle-orm/pg-core";
import { UsersTable } from "./user";
import { FileTable } from "./file";
import { CoursesTable } from "./course";
import { createInsertSchema } from "drizzle-zod";
import { materialCategories } from "../enums/material-categories";

export const MaterialTable = pgTable("material", {
  id: uuid().defaultRandom().primaryKey().notNull(),
  title: varchar({ length: 255 }).notNull(),
  category: materialCategories().notNull(),
  uploaded_at: timestamp({ withTimezone: true }).defaultNow().notNull(),
  uploader_id: uuid()
    .references(() => UsersTable.id)
    .notNull(),
  file_id: uuid()
    .references(() => FileTable.id)
    .notNull(),
  course_code: varchar({ length: 255 })
    .references(() => CoursesTable.code, {
      onDelete: "cascade",
      onUpdate: "cascade",
    })
    .notNull(),
});

export const materialCreateSchema = createInsertSchema(MaterialTable);
