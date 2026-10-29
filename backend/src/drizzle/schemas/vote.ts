import { pgTable, primaryKey, uuid } from "drizzle-orm/pg-core";
import { UsersTable } from "./user";
import { pollItem } from "./poll-item";
import { createInsertSchema } from "drizzle-zod";

export const vote = pgTable(
  "vote",
  {
    voter_id: uuid()
      .references(() => UsersTable.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      })
      .notNull(),
    poll_item_id: uuid()
      .references(() => pollItem.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      })
      .notNull(),
  },
  (table) => [primaryKey({ columns: [table.poll_item_id, table.voter_id] })]
);

export const voteInsertSchema = createInsertSchema(vote);
