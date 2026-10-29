import { and, asc, count, desc, eq, or, SQL } from "drizzle-orm";
import { RequestHandler } from "express";
import z from "zod";
import {
  filesIdsSchema,
  FileTable,
  submission,
  submissionsFiles,
  updateSubmissionSchema,
  UsersTable,
} from "../drizzle";
import { db } from "../drizzle/db";
import { APIRequest } from "../types/api";
import { BadRequestError, InternalServerError } from "../utils/errors/errors";

export const createSubmission: RequestHandler = async (
  request: APIRequest<{
    file_ids: unknown;
  }>,
  response,
  next
) => {
  const assignmentId = request.params.assignment_id;
  const userId = request.user?.userId;

  try {
    if (!userId) throw new InternalServerError("User is not wired to request.");

    const studentAlreadySubmitted = await db.query.submission.findFirst({
      where: (submission, { eq, and }) =>
        and(
          eq(submission.assignment_id, assignmentId),
          eq(submission.student_id, userId)
        ),
    });

    if (studentAlreadySubmitted)
      throw new BadRequestError(
        "The student has already created a submission for this assignment, did you mean to update the submission?"
      );

    const submissionFilesUrls = filesIdsSchema.parse(request.body.file_ids);

    const submissionWithFiles = await db.transaction(async (tx) => {
      const [insertedSubmission] = await tx
        .insert(submission)
        .values({
          assignment_id: assignmentId,
          student_id: userId,
        })
        .returning();

      for (const fileUrl of submissionFilesUrls) {
        await tx.insert(submissionsFiles).values({
          file_id: fileUrl,
          submission_id: insertedSubmission.id,
        });
      }

      return {
        ...insertedSubmission,
        filesUrls: submissionFilesUrls,
      };
    });

    response.status(200).json({
      message: "Submission created.",
      data: submissionWithFiles,
    });
  } catch (error) {
    next(error);
  }
};

export const getSubmissions: RequestHandler = async (
  request,
  response,
  next
) => {
  try {
    const assignmentId = request.params.assignment_id;

    const extraFilters: SQL[] = [];

    if (request.query.userId) {
      extraFilters.push(
        eq(submission.student_id, request.query.userId.toString())
      );
    }

    if (request.query.turned_in === "true") {
      extraFilters.push(eq(submission.is_turned_in, true));
    }

    // TODO: Query validation can be done in a cleaner way using zod
    const parsedPageIndex = Number(request.query.pageIndex);

    if (
      request.query.pageIndex &&
      (isNaN(parsedPageIndex) ||
        !Number.isInteger(parsedPageIndex) ||
        parsedPageIndex < 0)
    ) {
      throw new BadRequestError("Page index should be an non-negative integer");
    }

    const parsedPageSize = Number(request.query.pageSize);

    if (
      request.query.pageSize &&
      (isNaN(parsedPageSize) ||
        !Number.isInteger(parsedPageSize) ||
        parsedPageSize < 1)
    ) {
      throw new BadRequestError("Page size should be an positive integer");
    }

    // TODO: For new sorting is only implemented for turned_in_at, extend it and allow more options
    const sortBy = request.query.sortBy;
    const sortOrder = request.query.sortOrder;

    let submissions = await db.query.submission.findMany({
      where: (submission, { eq, and }) =>
        and(eq(submission.assignment_id, assignmentId), ...extraFilters),
      with: {
        files: {
          with: {
            file: true,
          },
        },
        submitter: true,
      },
      limit: parsedPageSize,
      offset: parsedPageIndex * parsedPageSize,
      orderBy:
        sortOrder === "asc"
          ? asc(submission.turned_in_at)
          : desc(submission.turned_in_at),
    });

    // TODO: For new filtering is only implemented for student_code, extend it and allow more options
    // TODO: Filter for student code in the query itself not here
    const student_code = request.query.student_code?.toString();
    if (student_code) {
      submissions = submissions.filter(
        (submission) =>
          submission.submitter.code &&
          new RegExp(`${student_code}`).test(submission.submitter.code)
      );

      extraFilters.push(eq(UsersTable.code, student_code));
    }

    const [{ count: assignmentSubmissionsCount }] = await db
      .select({ count: count() })
      .from(submission)
      .innerJoin(UsersTable, eq(UsersTable.id, submission.student_id))
      .where(and(eq(submission.assignment_id, assignmentId), ...extraFilters));

    const cleanSubmissions = submissions.map((submission) => ({
      ...submission,
      attached_files: submission.files.map((element) => element.file),
    }));

    const finalData = request.query.userId
      ? cleanSubmissions[0]
      : cleanSubmissions;

    response.status(200).json({
      message: "Submissions found.",
      data: finalData ?? null,
      meta: {
        pageIndex: parsedPageIndex,
        pageSize: parsedPageSize,
        total: assignmentSubmissionsCount,
        totalPages: Math.ceil(assignmentSubmissionsCount / parsedPageSize),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteSubmission: RequestHandler = async (
  request,
  response,
  next
) => {
  try {
    const submissionId = request.params.submission_id;

    // TODO: Make sure file is deleted from upload thing and from the DB

    const deletedSubmission = await db
      .delete(submission)
      .where(eq(submission.id, submissionId));

    response.status(200).json({
      message: "Submission deleted",
      data: deletedSubmission,
    });
  } catch (error) {
    next(error);
  }
};

export const patchSubmission: RequestHandler = async (
  request: APIRequest,
  response,
  next
) => {
  try {
    const submissionId = request.params.submission_id;

    // TODO: Add a check to make sure that a student isn't trying to change their grade

    const requestSubmissionData = updateSubmissionSchema.parse(request.body);

    const extraFields = requestSubmissionData.is_turned_in
      ? { turned_in_at: new Date() }
      : {};

    const [patchedSubmission] = await db
      .update(submission)
      .set({
        feedback: requestSubmissionData.feedback,
        grade: requestSubmissionData.grade,
        is_turned_in: requestSubmissionData.is_turned_in,
        ...extraFields,
      })
      .where(eq(submission.id, submissionId))
      .returning();

    response.status(200).json({
      message: "Submission updated.",
      data: patchedSubmission,
    });
  } catch (error) {
    next(error);
  }
};

export const addSubmissionFiles: RequestHandler = async (
  request: APIRequest<{
    files_ids: unknown[];
  }>,
  response,
  next
) => {
  const submissionId = request.params.submission_id;
  try {
    const files_ids = filesIdsSchema.parse(request.body.files_ids);
    await db.insert(submissionsFiles).values(
      files_ids.map((id) => ({
        file_id: id,
        submission_id: submissionId,
      }))
    );

    response.status(201).json({
      message: "Files added to student submission successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const deleteSubmissionFile: RequestHandler = async (
  request,
  response,
  next
) => {
  const submissionId = request.params.submission_id;
  const fileId = request.params.file_id;

  // TODO: Add authorization to make sure students can only delete their submission files
  // TODO: Delete the file from the DB and from upload thing

  try {
    // TODO: I think a transaction should be used here
    await db
      .delete(submissionsFiles)
      .where(
        and(
          eq(submissionsFiles.file_id, fileId),
          eq(submissionsFiles.submission_id, submissionId)
        )
      );

    const submissionStillHasFiles = await db.query.submissionsFiles.findFirst({
      where: (submissionFile, { eq }) =>
        eq(submissionFile.submission_id, submissionId),
    });

    if (!submissionStillHasFiles) {
      await db.delete(submission).where(eq(submission.id, submissionId));
    }

    response.status(201).json({
      message: "File deleted from student submission successfully",
    });
  } catch (error) {
    next(error);
  }
};
