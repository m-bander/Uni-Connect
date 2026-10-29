import { RequestHandler } from "express";
import { APIRequest } from "../types/api";
import { db } from "../drizzle/db";
import {
  announcement,
  classesAnnouncements,
  coursesAnnouncements,
  CoursesTable,
  pollItem,
  vote as voteEntity,
  voteInsertSchema,
} from "../drizzle";
import { InternalServerError, NotFoundError } from "../utils/errors/errors";
import { and, eq } from "drizzle-orm";
import { getIO } from "../lib/socket";

export const vote: RequestHandler = async (
  request: APIRequest,
  response,
  next
) => {
  const userId = request.user?.userId;
  const pollItemId = request.params.poll_item_id;

  try {
    if (!userId) throw new InternalServerError("User is not wired to request");

    // TODO: Should we make separate routes handlers for class announcements and course announcements?

    // TODO: Change to 1 query only for performance :)

    // For some reason, what's returned shows that it has the type {code: string;}. But it might be undefined
    // if it's not a course announcement. Hopefully this will change in a future update, or maybe we did something wrong

    // Check if the poll item relates to a course
    const [courseAnnouncementJoinResult] = await db
      .select({
        code: coursesAnnouncements.course_id,
      })
      .from(pollItem)
      .where(eq(pollItem.id, pollItemId))
      .innerJoin(
        coursesAnnouncements,
        eq(coursesAnnouncements.announcement_id, pollItem.announcement_id)
      );

    let classAnnouncementJoinResult;

    if (!courseAnnouncementJoinResult) {
      // Check if it relates to a class
      [classAnnouncementJoinResult] = await db
        .select({
          year: classesAnnouncements.class,
        })
        .from(pollItem)
        .where(eq(pollItem.id, pollItemId))
        .innerJoin(
          classesAnnouncements,
          eq(classesAnnouncements.announcement_id, pollItem.announcement_id)
        );

      if (!classAnnouncementJoinResult)
        throw new NotFoundError(`Poll item with ID ${pollItemId} not found.`);
    }

    const [insertedVote] = await db
      .insert(voteEntity)
      .values({
        poll_item_id: pollItemId,
        voter_id: userId,
      })
      .returning();

    const courseCode = courseAnnouncementJoinResult?.code;
    if (courseCode) {
      getIO().emit(`courses-${courseCode}-polls`, {
        data: {
          poll_item_id: pollItemId,
          voter_id: userId,
        },
        action: "vote",
      });
    }

    const year = classAnnouncementJoinResult?.year;
    if (year) {
      getIO().emit(`years-${year}-polls`, {
        data: {
          poll_item_id: pollItemId,
          voter_id: userId,
        },
        action: "vote",
      });
    }

    response.status(200).json({
      message: "Vote added successfully.",
      data: insertedVote,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteVote: RequestHandler = async (
  request: APIRequest,
  response,
  next
) => {
  const pollItemId = request.params.poll_item_id;
  const userId = request.user?.userId;

  try {
    if (!userId) throw new InternalServerError("User not wired to request");

    const [courseAnnouncementJoinResult] = await db
      .select({
        code: coursesAnnouncements.course_id,
      })
      .from(pollItem)
      .where(eq(pollItem.id, pollItemId))
      .innerJoin(
        coursesAnnouncements,
        eq(coursesAnnouncements.announcement_id, pollItem.announcement_id)
      );

    let classAnnouncementJoinResult;

    if (!courseAnnouncementJoinResult) {
      // Check if it relates to a class
      [classAnnouncementJoinResult] = await db
        .select({
          year: classesAnnouncements.class,
        })
        .from(pollItem)
        .where(eq(pollItem.id, pollItemId))
        .innerJoin(
          classesAnnouncements,
          eq(classesAnnouncements.announcement_id, pollItem.announcement_id)
        );

      if (!classAnnouncementJoinResult)
        throw new NotFoundError(`Poll item with ID ${pollItemId} not found.`);
    }

    const deletedVote = await db
      .delete(voteEntity)
      .where(
        and(
          eq(voteEntity.voter_id, userId),
          eq(voteEntity.poll_item_id, pollItemId)
        )
      );

    const courseCode = courseAnnouncementJoinResult?.code;
    if (courseCode) {
      getIO().emit(`courses-${courseCode}-polls`, {
        data: {
          poll_item_id: pollItemId,
          voter_id: userId,
        },
        action: "un-vote",
      });
    }

    const year = classAnnouncementJoinResult?.year;
    if (year) {
      getIO().emit(`years-${year}-polls`, {
        data: {
          poll_item_id: pollItemId,
          voter_id: userId,
        },
        action: "un-vote",
      });
    }

    response.status(200).json({
      message: "Vote deleted successfully.",
      data: deletedVote,
    });
  } catch (error) {
    next(error);
  }
};
