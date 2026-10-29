import { sql } from "drizzle-orm";
import { db } from "../drizzle/db";
import {
  type InsertNotificationSchema,
  notification,
} from "../drizzle/schemas/notification";
import { getIO } from "../lib/socket";

export const sendCourseNotification = async (
  courseCode: string,
  notificationData: InsertNotificationSchema
) => {
  const [insertedNotification] = await db
    .insert(notification)
    .values(notificationData)
    .returning();

  await db.execute(
    sql`call send_notifications_course(${insertedNotification.id}, ${courseCode});`
  );

  getIO().emit(`notifications-course-${courseCode}`, insertedNotification);
};

export const sendYearNotification = async (
  year: string,
  notificationData: InsertNotificationSchema
) => {
  const [insertedNotification] = await db
    .insert(notification)
    .values(notificationData)
    .returning();

  await db.execute(
    sql`call send_notifications_year(${insertedNotification.id}, ${year});`
  );

  getIO().emit(`notifications-year-${year}`, insertedNotification);
};
