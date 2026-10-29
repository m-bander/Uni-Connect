import { relations } from "drizzle-orm";
import { pollItem } from "../schemas/poll-item";
import { announcement } from "../schemas/announcement";
import { vote } from "../schemas/vote";

export const pollItemRelations = relations(pollItem, ({ one, many }) => ({
  announcement: one(announcement, {
    fields: [pollItem.announcement_id],
    references: [announcement.id],
  }),
  votes: many(vote),
}));
