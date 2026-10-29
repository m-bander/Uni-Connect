import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { UsersTable } from "./user";
import { group } from "./group";
import { createInsertSchema } from "drizzle-zod";

export const message = pgTable("message", {
  id: uuid().defaultRandom().primaryKey(),
  content: text().notNull(),
  created_at: timestamp({ withTimezone: true }).defaultNow().notNull(),
  sender_id: uuid()
    .references(() => UsersTable.id, { onDelete: "cascade" })
    .notNull(),
  group_id: uuid()
    .references(() => group.id, { onDelete: "cascade" })
    .notNull(),
});

export const messageInsertSchema = createInsertSchema(message);
