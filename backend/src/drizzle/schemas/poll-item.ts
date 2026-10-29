import { pgTable, text, uuid } from "drizzle-orm/pg-core";
import { announcement } from "./announcement";
import { createUpdateSchema } from "drizzle-zod";
import z from "zod";

export const pollItem = pgTable("poll-item", {
  id: uuid().defaultRandom().primaryKey(),
  announcement_id: uuid().references(() => announcement.id, {
    onDelete: "cascade",
    onUpdate: "cascade",
  }),
  content: text().notNull(),
});

export const pollItemUpdateSchema = createUpdateSchema(pollItem);
export const pollItemsUpdateSchema = z
  .array(pollItemUpdateSchema.required({ content: true }))
  .optional();
