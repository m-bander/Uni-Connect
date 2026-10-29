import { RequestHandler } from "express";
import { APIRequest } from "../types/api";
import { db } from "../drizzle/db";
import { InternalServerError } from "../utils/errors/errors";
import { notification, receivedNotifications } from "../drizzle";
import { desc, eq } from "drizzle-orm";

export const getCurrentUserNotifications: RequestHandler = async (
  request: APIRequest,
  response,
  next
) => {
  const userId = request.user?.userId;

  try {
    if (!userId) {
      console.log("User not wired to request.");
      throw new InternalServerError();
    }

    const notifications = await db
      .select()
      .from(receivedNotifications)
      .where(eq(receivedNotifications.user_id, userId))
      .innerJoin(
        notification,
        eq(notification.id, receivedNotifications.notification_id)
      )
      .orderBy(desc(notification.created_at));

    const result = notifications.map((notification) => ({
      ...notification.notification,
      marked_as_read: notification.received_notifications.marked_as_read,
    }));

    response.status(200).json({
      message: "Current user notifications found.",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const markCurrentUserNotificationsAsRead: RequestHandler = async (
  request: APIRequest,
  response,
  next
) => {
  const userId = request.user?.userId;

  try {
    if (!userId) {
      console.log("User not wired to request.");
      throw new InternalServerError();
    }

    await db
      .update(receivedNotifications)
      .set({
        marked_as_read: true,
      })
      .where(eq(receivedNotifications.user_id, userId));

    response.status(200).json({
      message: "Notifications has been marked as read successfully.",
    });
  } catch (error) {
    next(error);
  }
};
