import { RequestHandler } from "express";
import {
  announcement,
  announcementInsertSchema,
  classesAnnouncements,
  pollItem,
  STUDENT_YEARS,
} from "../drizzle";
import { db } from "../drizzle/db";
import { APIRequest } from "../types/api";
import { BadRequestError, InternalServerError } from "../utils/errors/errors";
import z from "zod";
import { sendYearNotification } from "../utils/notifications";
import { eq } from "drizzle-orm";

const yearIsValidStudentYear = (
  year: string
): year is (typeof STUDENT_YEARS)[number] => {
  return STUDENT_YEARS.includes(year as (typeof STUDENT_YEARS)[number]);
};

export const getYearAnnouncements: RequestHandler = async (
  request: APIRequest,
  response,
  next
) => {
  const year = request.params.year;

  try {
    if (!yearIsValidStudentYear(year)) {
      console.error(`Year should be a digit between 1 and 5, received ${year}`);
      throw new BadRequestError(
        `Year should be a digit between 1 and 5, received ${year}`
      );
    }

    const announcements = await db.query.classesAnnouncements.findMany({
      where: eq(classesAnnouncements.class, year),
      with: {
        announcement: {
          with: {
            announcer: true,
            pollItems: { with: { votes: true } },
          },
        },
      },
    });

    // ! We can only remove this in the case that we do a vanilla select with joins.
    announcements.sort((a, b) =>
      a.announcement.created_at > b.announcement.created_at ? -1 : 1
    );

    const cleanAnnouncements = announcements.map((announcement) => ({
      ...announcement.announcement,
      pollItems: announcement.announcement.pollItems.map((pollItem) => ({
        ...pollItem,
        votersIds: pollItem.votes.map((vote) => vote.voter_id),
      })),
    }));

    response.status(200).json({
      message: "Class announcements found",
      data: cleanAnnouncements,
    });
  } catch (error) {
    next(error);
  }
};

export const getYearStudents: RequestHandler = async (
  request,
  response,
  next
) => {
  try {
    const year = request.params.year;

    if (!yearIsValidStudentYear(year)) {
      console.error(`Year should be a digit between 1 and 5, received ${year}`);
      throw new BadRequestError(
        `Year should be a digit between 1 and 5, received ${year}`
      );
    }

    const students = await db.query.UsersTable.findMany({
      where: (user, { eq, inArray, and }) =>
        and(
          inArray(user.role, [
            "class_representative",
            "course_head",
            "student",
          ]),
          eq(user.year, year)
        ),
    });

    response.status(200).json({
      message: "Class students found.",
      data: students,
    });
  } catch (error) {
    next(error);
  }
};

export const createYearAnnouncement: RequestHandler = async (
  request: APIRequest,
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

    // Create a new entry in the classesAnnouncements table since it's a class announcement

    const year = request.params.year;
    if (!yearIsValidStudentYear(year)) {
      console.error(`Year should be a digit between 1 and 5, received ${year}`);
      throw new BadRequestError(
        `Year should be a digit between 1 and 5, received ${year}`
      );
    }

    await db.insert(classesAnnouncements).values({
      announcement_id: insertedAnnouncement.id,
      class: year,
    });

    sendYearNotification(year, {
      content: insertedAnnouncement.content ?? "",
      title: insertedAnnouncement.title ?? "",
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
