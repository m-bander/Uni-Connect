import { relations } from "drizzle-orm";
import { RefreshTokensTable, UsersTable } from "../schemas/user";
import { message } from "../schemas/message";
import { enrolledIn, manages, Teaches, blacklist } from "../schemas/course";
import { group } from "../schemas/group";
import { notification } from "../schemas/notification";
import { MaterialTable } from "../schemas/materials";
import { assignment } from "../schemas/assignment";
import { submission } from "../schemas/submission";
import { sessionsTable } from "../schemas/session";

export const usersRelations = relations(UsersTable, ({ many }) => ({
  refreshTokens: many(RefreshTokensTable),
  messages: many(message, { relationName: "sender_messages" }),
  teachingCourses: many(Teaches),
  enrolledIn: many(enrolledIn),
  groups: many(group),
  notifications: many(notification),
  managedCoures: many(manages),
  uploadedMaterials: many(MaterialTable),
  postedAssignments: many(assignment),
  submissions: many(submission),
  sessions: many(sessionsTable),
  blacklistedCourses: many(blacklist),
}));

export const refreshTokensTable = relations(RefreshTokensTable, ({ one }) => ({
  user: one(UsersTable, {
    fields: [RefreshTokensTable.userId],
    references: [UsersTable.id],
  }),
}));
