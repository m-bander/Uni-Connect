import { primaryKey, text } from "drizzle-orm/pg-core";
import { timestamp } from "drizzle-orm/pg-core";
import { varchar } from "drizzle-orm/pg-core";
import { uuid } from "drizzle-orm/pg-core";
import { pgTable } from "drizzle-orm/pg-core";
import { assignment } from "./assignment";
import z from "zod";

export const FileTable = pgTable("file", {
  id: uuid().defaultRandom().primaryKey().notNull(),
  name: text().notNull(),
  type: varchar({ length: 255 }).notNull(),
  key: text().notNull(),
  size: varchar({ length: 255 }).notNull(),
  url: text().notNull(),
  uploaded_at: timestamp({ withTimezone: true }).defaultNow().notNull(),
});

export const assignmentsFiles = pgTable(
  "assignments_files",
  {
    assignment_id: uuid()
      .references(() => assignment.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      })
      .notNull(),
    file_id: uuid()
      .references(() => FileTable.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      })
      .notNull(),
  },
  (table) => [primaryKey({ columns: [table.assignment_id, table.file_id] })]
);

export const filesIdsSchema = z.array(z.string().nonempty()).nonempty();
