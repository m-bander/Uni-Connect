import { relations } from "drizzle-orm";
import { notification, receivedNotifications } from "../schemas/notification";
import { UsersTable } from "../schemas/user";

export const notificationRelations = relations(
  receivedNotifications,
  ({ one }) => ({
    receiver: one(UsersTable, {
      references: [UsersTable.id],
      fields: [receivedNotifications.user_id],
    }),
    notification: one(notification, {
      references: [notification.id],
      fields: [receivedNotifications.notification_id],
    }),
  })
);
