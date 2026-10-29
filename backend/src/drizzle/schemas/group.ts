import { pgTable, text, uuid, varchar } from "drizzle-orm/pg-core";

export const group = pgTable("group", {
  id: uuid().defaultRandom().primaryKey(),
  image_url: text(),
  name: varchar({ length: 256 }).notNull(),
});
