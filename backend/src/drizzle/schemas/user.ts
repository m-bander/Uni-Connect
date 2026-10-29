import { pgTable, uuid, varchar, boolean } from "drizzle-orm/pg-core";
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "drizzle-zod";
import z from "zod";

import { roles } from "../enums/roles";
import { years } from "../enums/years";

export const UsersTable = pgTable("users", {
  id: uuid().primaryKey().defaultRandom().notNull(),
  first_name: varchar({ length: 255 }).notNull(),
  parent_name: varchar({ length: 255 }).notNull(),
  grandparent_name: varchar({ length: 255 }),
  family_name: varchar({ length: 255 }),
  image_url: varchar({ length: 255 }),
  email: varchar({ length: 255 }).notNull(),
  password: varchar({ length: 255 }).notNull(),
  isApproved: boolean().notNull().default(true),
  role: roles().notNull(),
  code: varchar({ length: 255 }),
  year: years(),
});

export const usersInsertSchema = createInsertSchema(UsersTable);
export const usersUpdateSchema = createUpdateSchema(UsersTable);
export const usersSelectSchema = createSelectSchema(UsersTable).partial();

export type IUsersInsert = z.infer<typeof usersInsertSchema>;
export type IUsersSelect = z.infer<typeof usersSelectSchema>;
export type IUsersUpdate = z.infer<typeof usersUpdateSchema>;

export const RefreshTokensTable = pgTable("refreshTokens", {
  userId: uuid()
    .references(() => UsersTable.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    })
    .notNull(),
  token: varchar().notNull().primaryKey(),
});

export const SORTABLE_USER_COLUMNS = [
  "first_name",
  "parent_name",
  "assignments_submitted_in_course",
  "polls_voted_in_course",
  "messages_in_course_group",
  "average_grade_in_course",
] as const;
