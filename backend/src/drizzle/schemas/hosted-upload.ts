import { pgTable, uuid, text, integer, timestamp } from "drizzle-orm/pg-core";
import { FileTable } from "./file";
import { UsersTable } from "./user";
export const hostedUpload = pgTable("hosted_upload", {
  fileId: uuid("file_id").primaryKey().references(()=>FileTable.id,{onDelete:"cascade"}),
  ownerId: uuid("owner_id").notNull().references(()=>UsersTable.id,{onDelete:"cascade"}),
  token: uuid().notNull(),
  bytes: integer().notNull(),
  content: text().notNull(),
  createdAt: timestamp("created_at",{withTimezone:true}).notNull().defaultNow()
});
