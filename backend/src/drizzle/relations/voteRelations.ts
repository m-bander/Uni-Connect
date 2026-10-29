import { relations } from "drizzle-orm";
import { vote } from "../schemas/vote";
import { UsersTable } from "../schemas/user";
import { pollItem } from "../schemas/poll-item";

export const voteRelations = relations(vote, ({ one }) => ({
  voter: one(UsersTable, {
    references: [UsersTable.id],
    fields: [vote.voter_id],
  }),
  pollItem: one(pollItem, {
    references: [pollItem.id],
    fields: [vote.poll_item_id],
  }),
}));
