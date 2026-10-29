import { relations } from "drizzle-orm";
import { message } from "../schemas/message";
import { UsersTable } from "../schemas/user";
import { group } from "../schemas/group";

export const messageRelations = relations(message, ({ one }) => ({
  sender: one(UsersTable, {
    fields: [message.sender_id],
    references: [UsersTable.id],
    relationName: "sender_messages",
  }),
  group: one(group, {
    fields: [message.group_id],
    references: [group.id],
    relationName: "messages",
  }),
}));
