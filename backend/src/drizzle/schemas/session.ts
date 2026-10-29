import { uuid } from "drizzle-orm/pg-core";
import { pgTable } from "drizzle-orm/pg-core";
import { UsersTable } from "./user";
import { timestamp } from "drizzle-orm/pg-core";
import { integer } from "drizzle-orm/pg-core";
import { primaryKey } from "drizzle-orm/pg-core";
import { date } from "drizzle-orm/pg-core";

export const sessionsTable = pgTable(
  "sessions",
  {
    userId: uuid()
      .notNull()
      .references(() => UsersTable.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    sessionDate: date().notNull(),
    sessionDuration: integer().notNull(),
  },
  (table) => [primaryKey({ columns: [table.userId, table.sessionDate] })]
);
