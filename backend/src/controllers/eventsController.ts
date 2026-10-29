import { eq, gte, inArray, sql, SQL } from "drizzle-orm";
import { RequestHandler } from "express";
import { assignment, EVENT_SOURCES, message } from "../drizzle";
import { db } from "../drizzle/db";
import {
  event,
  eventInsertSchema,
  eventUpdateSchema,
} from "../drizzle/schemas/event";
import { APIRequest } from "../types/api";
import {
  BadRequestError,
  InternalServerError,
  NotFoundError,
} from "../utils/errors/errors";

export const getCurrentUserEvents: RequestHandler = async (
  request: APIRequest,
  response,
  next
) => {
  const userId = request.user?.userId;

  try {
    if (!userId) {
      throw new InternalServerError("User not wired to request.");
    }

    const filteringEventsConditions: SQL[] = [];
    const filteringAssignmentsConditions: SQL[] = [];

    const futureEventsOnly = request.query.future === "true";
    if (futureEventsOnly) {
      filteringEventsConditions.push(gte(event.deadline_at, new Date()));
      filteringAssignmentsConditions.push(
        gte(assignment.deadline_at, new Date())
      );
    }

    const userRequestedSpecificEventsTypes = request.query.eventsTypes;
    if (userRequestedSpecificEventsTypes) {
      if (typeof request.query.eventsTypes !== "string")
        throw new InternalServerError();

      const eventsTypes = request.query.eventsTypes.split(",");

      // Runtime type guard to make sure passed events types are similar to what we expect
      const filteredTypes = eventsTypes.filter(
        (t): t is (typeof EVENT_SOURCES)[number] =>
          EVENT_SOURCES.includes(t as (typeof EVENT_SOURCES)[number])
      );

      if (eventsTypes.length > filteredTypes.length) {
        throw new BadRequestError("Passed events types are incorrect.");
      }

      filteringEventsConditions.push(inArray(event.type, filteredTypes));

      if (!eventsTypes.includes("assignment")) {
        // If the specified events types don't include the assignment add false to the filtering conditions
        // so that the "where" result is false in the assignments "where"
        // TODO: See if there is a better way to do this
        filteringAssignmentsConditions.push(sql`FALSE`);
      }
    }

    const data = await db.query.UsersTable.findFirst({
      where: (user, { eq }) => eq(user.id, userId),
      with: {
        enrolledIn: {
          with: {
            course: {
              with: {
                events: {
                  where: (_, { and }) => and(...filteringEventsConditions),
                },
                assignments: {
                  where: (_, { and }) => and(...filteringAssignmentsConditions),
                  with: {
                    course: {
                      with: {
                        courseHeads: true,
                      },
                    },
                  },
                },
                courseHeads: true,
              },
            },
          },
        },
        teachingCourses: {
          with: {
            course: {
              with: {
                events: {
                  where: (_, { and }) => and(...filteringEventsConditions),
                },
                assignments: {
                  where: (_, { and }) => and(...filteringAssignmentsConditions),
                  with: {
                    course: {
                      with: {
                        courseHeads: true,
                      },
                    },
                  },
                },
                courseHeads: true,
              },
            },
          },
        },
      },
    });

    if (!data) throw new NotFoundError("User with passed ID doesn't exist.");

    // Convert assignments to events
    const events = data.enrolledIn
      .flatMap((enrolledCourse) =>
        enrolledCourse.course.events.concat(
          enrolledCourse.course.assignments.map((assignment) => ({
            ...assignment,
            notes: "",
            type: "assignment",
            course: enrolledCourse.course,
          }))
        )
      )
      .concat(
        data.teachingCourses.flatMap((teachingCourse) =>
          teachingCourse.course.events.concat(
            teachingCourse.course.assignments.map((assignment) => ({
              ...assignment,
              notes: "",
              type: "assignment",
              course: teachingCourse.course,
            }))
          )
        )
      );

    const sortedEvents = events.sort(
      (a, b) =>
        new Date(a.deadline_at).getTime() - new Date(b.deadline_at).getTime()
    );

    response.status(200).json({
      message: "Current user events found successfully.",
      data: sortedEvents,
    });
  } catch (error) {
    next(error);
  }
};

export const createCourseEvent: RequestHandler = async (
  request,
  response,
  next
) => {
  try {
    const courseCode = request.params.courseCode;
    const requestEventData = eventInsertSchema
      .omit({ course_id: true })
      .parse(request.body);

    const insertedEvent = await db
      .insert(event)
      .values({
        course_id: courseCode,
        deadline_at: requestEventData.deadline_at,
        title: requestEventData.title,
        type: requestEventData.type,
        notes: requestEventData.notes,
      })
      .returning();

    response.status(200).json({
      message: "Course created successfully.",
      data: insertedEvent,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteEvent: RequestHandler = async (request, response, next) => {
  try {
    const eventId = request.params.event_id;

    const deletedEvent = await db.delete(event).where(eq(event.id, eventId));

    response.status(200).json({
      message: "Event deleted successfully",
      data: deletedEvent,
    });
  } catch (error) {
    next(error);
  }
};

export const editEvent: RequestHandler = async (request, response, next) => {
  try {
    const eventId = request.params.event_id;
    const requestEventData = eventUpdateSchema.parse(request.body);

    const editedEvent = await db
      .update(event)
      .set({
        deadline_at: requestEventData.deadline_at,
        course_id: requestEventData.course_id,
        notes: requestEventData.notes,
        title: requestEventData.title,
        type: requestEventData.type,
      })
      .where(eq(event.id, eventId))
      .returning();

    response.status(200).json({
      message: "Event edited successfully",
      data: editedEvent,
    });
  } catch (error) {
    next(error);
  }
};
