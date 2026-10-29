import {
  boolean,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { notificaionSources } from "../enums/notification-sources";
import { UsersTable } from "./user";
import { createInsertSchema } from "drizzle-zod";
import z from "zod";

export const notification = pgTable("notification", {
  id: uuid().defaultRandom().primaryKey(),
  content: text().notNull(),
  created_at: timestamp({ withTimezone: true }).defaultNow().notNull(),
  source: notificaionSources().notNull(),
  title: text().notNull(),
});

export const insertNotificationSchema = createInsertSchema(notification).omit({
  id: true,
  created_at: true,
});
export type InsertNotificationSchema = z.infer<typeof insertNotificationSchema>;

export const receivedNotifications = pgTable(
  "received_notifications",
  {
    notification_id: uuid()
      .notNull()
      .references(() => notification.id, { onDelete: "cascade" }),
    user_id: uuid()
      .notNull()
      .references(() => UsersTable.id, { onDelete: "cascade" }),
    marked_as_read: boolean().default(false).notNull(),
  },
  (table) => [primaryKey({ columns: [table.notification_id, table.user_id] })]
);
