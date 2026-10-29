import { RequestHandler } from "express";
import { db } from "../drizzle/db";
import { InternalServerError, NotFoundError } from "../utils/errors/errors";
import { APIRequest } from "../types/api";
import {
  assignment,
  assignmentsFiles,
  filesIdsSchema,
  insertAssignmentSchema,
  updateAssignmentSchema,
} from "../drizzle";
import { and, eq, inArray } from "drizzle-orm";
import z from "zod";

export const getCourseAssignments: RequestHandler = async (
  request,
  response,
  next
) => {
  try {
    const courseCode = request.params.courseCode;

    const assignments = await db.query.assignment.findMany({
      where: (assignment, { eq }) => eq(assignment.course_id, courseCode),
      with: {
        files: {
          with: {
            file: true,
          },
        },
      },
      orderBy: (assignment, { asc }) => asc(assignment.deadline_at),
    });

    const cleanAssignments = assignments.map((assignment) => ({
      ...assignment,
      attached_files: assignment.files.map((element) => element.file),
    }));

    response.status(200).json({
      message: "Course assignments found successfully",
      data: cleanAssignments,
    });
  } catch (error) {
    next(error);
  }
};

export const getAssignment: RequestHandler = async (
  request,
  response,
  next
) => {
  try {
    // TODO: Should we add authorization? Any student can join any course, and any human being can sign up and be a student
    const assignmentId = request.params.assignment_id;

    const assignment = await db.query.assignment.findFirst({
      where: (assignment, { eq }) => eq(assignment.id, assignmentId),
      with: {
        assigner: true,
        files: {
          with: { file: true },
        },
      },
    });

    if (!assignment)
      throw new NotFoundError(`Assignment with ID ${assignmentId} not found.`);

    const cleanAssignment = {
      ...assignment,
      attached_files: assignment.files.map((element) => element.file),
    };

    response.status(200).json({
      message: "Assignment found.",
      data: cleanAssignment,
    });
  } catch (error) {
    next(error);
  }
};

export const createAssignment: RequestHandler = async (
  request: APIRequest,
  response,
  next
) => {
  try {
    const requestAssignmentData = insertAssignmentSchema
      .partial({ course_id: true })
      .parse(request.body);

    const courseCode = request.params.courseCode;
    const userId = request.user?.userId;

    if (!userId) throw new InternalServerError("userId is undefined.");

    // TODO: This should trigger a notification and a calendar event
    const createdAssignment = await db
      .insert(assignment)
      .values({
        deadline_at: requestAssignmentData.deadline_at,
        max_grade: requestAssignmentData.max_grade,
        title: requestAssignmentData.title,
        description: requestAssignmentData.description,
        course_id: courseCode,
        assigner_id: userId,
      })
      .returning();

    const createdAssignmentRecord = createdAssignment[0];

    // Attach files (if any) to the newly created assignment
    const rawAttachedFilesIds = (request.body as unknown as { attached_files_ids?: unknown })
      .attached_files_ids;

    if (Array.isArray(rawAttachedFilesIds) && rawAttachedFilesIds.length > 0) {
      const attachedFilesIds = filesIdsSchema.parse(rawAttachedFilesIds);

      await db.insert(assignmentsFiles).values(
        attachedFilesIds.map((fileId) => ({
          assignment_id: createdAssignmentRecord.id,
          file_id: fileId,
        }))
      );
    }

    response.status(200).json({
      message: "Assignment created successfully",
      data: createdAssignment,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteAssignment: RequestHandler = async (
  request,
  response,
  next
) => {
  try {
    const assignmentId = request.params.assignment_id;
    const deletedAssignment = await db
      .delete(assignment)
      .where(eq(assignment.id, assignmentId));

    response.status(200).json({
      message: "Assignment deleted successfully",
      data: deletedAssignment,
    });
  } catch (error) {
    next(error);
  }
};

export const editAssignment: RequestHandler = async (
  request: APIRequest<{ attached_files_ids: unknown }>,
  response,
  next
) => {
  try {
    const assignmentId = request.params.assignment_id;
    const requestAssignmentData = updateAssignmentSchema.parse(request.body);
    const rawAttachedFilesIds = request.body.attached_files_ids;

    let attachedFilesIds: string[] = [];
    if (Array.isArray(rawAttachedFilesIds) && rawAttachedFilesIds.length > 0) {
      attachedFilesIds = filesIdsSchema.parse(rawAttachedFilesIds);
    }

    // TODO: is this really the updated assignment?
    // TODO: Should we use a transaction here?
    // TODO: Fix delete, update and insert logic between assignments and submission and try to make it consistent if it isn't
    const editedAssignment = await db
      .update(assignment)
      .set({
        deadline_at: requestAssignmentData.deadline_at,
        description: requestAssignmentData.description,
        max_grade: requestAssignmentData.max_grade,
        title: requestAssignmentData.title,
      })
      .where(eq(assignment.id, assignmentId))
      .returning();

    const previousAssignmentFiles = await db
      .select({ file_id: assignmentsFiles.file_id })
      .from(assignmentsFiles)
      .where(eq(assignmentsFiles.assignment_id, assignmentId));

    const previousIds = previousAssignmentFiles.map((file) => file.file_id);

    // Files to remove: present before, not present now
    const idsToRemove = previousIds.filter(
      (fileId) => !attachedFilesIds.includes(fileId)
    );

    if (idsToRemove.length > 0) {
      await db
        .delete(assignmentsFiles)
        .where(
          and(
            eq(assignmentsFiles.assignment_id, assignmentId),
            inArray(assignmentsFiles.file_id, idsToRemove)
          )
        );
    }

    // Files to add: present now, not present before
    const idsToAdd = attachedFilesIds.filter(
      (fileId) => !previousIds.includes(fileId)
    );

    if (idsToAdd.length > 0) {
      await db.insert(assignmentsFiles).values(
        idsToAdd.map((fileId) => ({
          assignment_id: assignmentId,
          file_id: fileId,
        }))
      );
    }

    response.status(200).json({
      message: "Assignment updated successfully",
      data: editedAssignment,
    });
  } catch (error) {
    next(error);
  }
};
