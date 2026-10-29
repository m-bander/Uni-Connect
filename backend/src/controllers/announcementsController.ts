import { and, eq, notInArray, sql } from "drizzle-orm";
import { RequestHandler } from "express";
import { db } from "../drizzle/db";
import {
  announcement,
  announcementInsertSchema,
  announcementUpdateSchema,
  coursesAnnouncements,
  IAnnouncementInsert,
} from "../drizzle/schemas/announcement";
import { APIRequest } from "../types/api";
import { InternalServerError } from "../utils/errors/errors";
import z from "zod";
import {
  enrolledIn,
  notification,
  pollItem,
  pollItemsUpdateSchema,
  pollItemUpdateSchema,
  STUDENT_YEARS,
  UsersTable,
} from "../drizzle";
import { union } from "drizzle-orm/pg-core";
import { sendCourseNotification } from "../utils/notifications";

export const postCourseAnnouncement: RequestHandler = async (
  request: APIRequest<IAnnouncementInsert>,
  response,
  next
) => {
  const userId = request.user?.userId;

  try {
    if (!userId) throw new InternalServerError("User not wired to request.");

    // Validate data
    const incomingAnnouncementData = z
      .discriminatedUnion("type", [
        announcementInsertSchema.partial({ announcer_id: true }).extend({
          type: z.literal("announcement"),
        }),
        announcementInsertSchema.partial({ announcer_id: true }).extend({
          type: z.literal("poll"),
          pollItems: z
            .array(z.string().nonempty())
            .min(2, "Poll must have at least 2 items"),
        }),
      ])
      .parse(request.body);

    // Synthesize the raw announcement
    const newAnnouncement: typeof announcement.$inferInsert = {
      ...incomingAnnouncementData,
      announcer_id: userId,
    };

    const [insertedAnnouncement] = await db
      .insert(announcement)
      .values(newAnnouncement)
      .returning();

    // Add poll items to the DB if it's a poll
    if (incomingAnnouncementData.type === "poll") {
      await db.insert(pollItem).values(
        incomingAnnouncementData.pollItems.map((pollItem) => ({
          announcement_id: insertedAnnouncement.id,
          content: pollItem,
        }))
      );
    }

    // Create a new entry in the coursesAnnouncements table since it's a course announcement
    const courseCode = request.params.courseCode;

    await db.insert(coursesAnnouncements).values({
      announcement_id: insertedAnnouncement.id,
      course_id: courseCode,
    });

    await sendCourseNotification(courseCode, {
      title: insertedAnnouncement.title ?? "",
      content: insertedAnnouncement.content ?? "",
      source: "announcement",
    });

    response.status(200).json({
      message: "Announcement has been created successfully.",
      data: insertedAnnouncement,
    });
  } catch (error) {
    next(error);
  }
};

export const getCourseAnnouncements: RequestHandler = async (
  request: APIRequest,
  response,
  next
) => {
  // TODO: Add authorization

  // TODO: Allow API users to query a certain range of announcements
  const courseCode = request.params.courseCode;
  try {
    const announcements = await db.query.coursesAnnouncements.findMany({
      where: eq(coursesAnnouncements.course_id, courseCode),
      with: {
        announcement: {
          with: {
            announcer: true,

            pollItems: {
              with: {
                votes: true,
              },
            },
          },
        },
      },
    });

    // ! We can only remove this in the case that we do a vanilla select with joins.
    announcements.sort((a, b) =>
      a.announcement.created_at > b.announcement.created_at ? -1 : 1
    );

    response.status(200).json({
      message: "Course announcements have been found.",
      data: announcements.map((announcement) => ({
        ...announcement.announcement,
        pollItems: announcement.announcement.pollItems.map((pollItem) => ({
          ...pollItem,
          votersIds: pollItem.votes.map((vote) => vote.voter_id),
        })),
      })),
    });
  } catch (error) {
    next(error);
  }
};

export const deleteAnnouncement: RequestHandler = async (
  request: APIRequest,
  response,
  next
) => {
  const announcementId = request.params.announcementId;

  // TODO: Add authorization to make sure that no student can delete the announcement of a professor for instance

  try {
    const deletedAnnouncement = await db
      .delete(announcement)
      .where(eq(announcement.id, announcementId))
      .returning();

    response.status(200).json({
      message: "Announcement has been deleted successfully.",
      data: deletedAnnouncement,
    });
  } catch (error) {
    next(error);
  }
};

export const patchAnnouncement: RequestHandler = async (
  request: APIRequest<{ pollItems?: unknown[] }>,
  response,
  next
) => {
  // TODO: Add authorization to make sure that no student can edit the announcement of a professor for instance

  const announcementId = request.params.announcementId;

  try {
    const incomingAnnouncementData = announcementUpdateSchema.parse(
      request.body
    );
    const incomingPollItemsData = pollItemsUpdateSchema.parse(
      request.body.pollItems
    );

    // TODO: Make sure it's really the updated announcement
    const [updatedAnnouncement] = await db
      .update(announcement)
      .set({
        title: incomingAnnouncementData.title,
        content: incomingAnnouncementData.content,
      })
      .where(eq(announcement.id, announcementId))
      .returning();

    // Handle poll items
    if (
      incomingPollItemsData &&
      incomingPollItemsData.length > 0 &&
      updatedAnnouncement.type === "poll"
    ) {
      await db.transaction(async (tx) => {
        // Delete poll items that aren't listed in the request
        const pollItemsIdsToBePersisted = incomingPollItemsData
          .map((pollItem) => pollItem.id)
          .filter((pollItem): pollItem is string => !!pollItem);

        if (pollItemsIdsToBePersisted.length > 0) {
          await tx
            .delete(pollItem)
            .where(and(eq(pollItem.announcement_id,announcementId),notInArray(pollItem.id, pollItemsIdsToBePersisted)));
        }

        // Upsert poll items
        for (const incomingPollItem of incomingPollItemsData) {
          if (incomingPollItem.id) {
            await tx
              .update(pollItem)
              .set({ content: incomingPollItem.content })
              .where(and(eq(pollItem.id, incomingPollItem.id),eq(pollItem.announcement_id,announcementId)));
          } else {
            await tx.insert(pollItem).values({
              content: incomingPollItem.content,
              announcement_id: announcementId,
            });
          }
        }
      });
    }

    response.status(200).json({
      message: "Announcement has been updated successfully",
      data: updatedAnnouncement,
    });
  } catch (error) {
    next(error);
  }
};

export const getCurrentUserAnnouncements: RequestHandler = async (
  request: APIRequest,
  response,
  next
) => {
  try {
    if (!request.user)
      throw new InternalServerError("User is not wired to request.");

    const userId = request.user.userId;

    // Get courses announcements
    const enrolledStudentCoursesQuery = db
      .select({
        coursesCodes: enrolledIn.courseCode,
      })
      .from(enrolledIn)
      .where(eq(enrolledIn.userId, userId));

    // I'd have used union here but since I am using "query" not "select" I can't use union
    // And I chose to use query to prevent joining manually

    const coursesAnnouncements = await db.query.coursesAnnouncements.findMany({
      where: (row, { inArray }) =>
        inArray(row.course_id, enrolledStudentCoursesQuery),
      with: {
        announcement: true,
      },
    });

    const flattenedCoursesAnnouncements = coursesAnnouncements.map(
      (element) => ({
        ...element.announcement,
        course_id: element.course_id,
      })
    );

    // Get class announcements

    const studentYear = request.user.year;

    if (!studentYear)
      throw new InternalServerError(
        "Passed user doesn't have a year. Can't fetch class announcements."
      );

    const classAnnouncements = await db.query.classesAnnouncements.findMany({
      where: (row, { eq }) => eq(row.class, studentYear),
      with: {
        announcement: true,
      },
    });

    const flattenedClassAnnouncements = classAnnouncements.map((element) => ({
      ...element.announcement,
      class: element.class,
    }));

    // Sort the announcements

    type CourseAnnouncement = typeof announcement.$inferSelect & {
      course_id: string;
    };

    type ClassAnnouncement = typeof announcement.$inferSelect & {
      class: (typeof STUDENT_YEARS)[number];
    };

    const sortedAnnouncements: (ClassAnnouncement | CourseAnnouncement)[] = [
      ...flattenedClassAnnouncements,
      ...flattenedCoursesAnnouncements,
    ].sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    response.status(200).json({
      message: "Student announcements found.",
      data: sortedAnnouncements,
    });
  } catch (error) {
    next(error);
  }
};
