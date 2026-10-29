import { relations } from "drizzle-orm";
import { UsersTable } from "../schemas/user";
import { sessionsTable } from "../schemas/session";

export const sessionRelations = relations(sessionsTable, ({ one }) => ({
  user: one(UsersTable, {
    fields: [sessionsTable.userId],
    references: [UsersTable.id],
  }),
}));
