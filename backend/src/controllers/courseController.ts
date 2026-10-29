import {
  and,
  asc,
  desc,
  count,
  countDistinct,
  eq,
  exists,
  getTableColumns,
  notInArray,
  sql,
  SQL,
  ilike,
  avg,
  is,
  inArray,
  or,
  not
} from "drizzle-orm";
import { RequestHandler } from "express";
import { ZodError } from "zod";
import { uploadThingApi, imageStorageKey } from "../config/uploadthing";
import {
  announcement,
  assignment,
  coursesAnnouncements,
  group,
  message,
  pollItem,
  SORTABLE_USER_COLUMNS,
  submission,
  UsersTable,
  vote,
} from "../drizzle";
import { db } from "../drizzle/db";
import {
  courseCreateSchema,
  CoursesTable,
  courseUpdateSchema,
  enrolledIn,
  ICourseCreateSchema,
  ICourseUpdateSchema,
  manages,
  Teaches,
  blacklist,
} from "../drizzle/schemas/course";
import { APIRequest, userRolesType } from "../types/api";
import { InternalServerError } from "../utils/errors/errors";
import {
  assignCourseHeadSchema,
  IAssignCourseHeadSchema,
} from "../validations/course";
import { createPsfSchema, psfSchema } from "../types/psf";
import { alias } from "drizzle-orm/pg-core";
import createSortBySchema from "../utils/create-sort-by-schema";

// cSpell:ignore ilike
import { NotFoundError } from "../utils/errors/errors";
import { event } from "../drizzle/schemas/event";
import { MaterialTable } from "../drizzle/schemas/materials";

export const getCourse: RequestHandler = async (req, res) => {
  try {
    const courseCode = req.params.courseCode;

    // TODO: Change this ****** after migration to Drizzle V1.0
    const courseTeachers = await db.query.Teaches.findMany({
      where: (row, { eq }) => eq(row.courseCode, courseCode),
      with: {
        teacher: true,
      },
    });

    const [course] = await db
      .select({
        ...getTableColumns(CoursesTable),
        students_number: db.$count(
          enrolledIn,
          eq(enrolledIn.courseCode, CoursesTable.code)
        ),
        representatives_ids: sql<string[]>`json_agg(${manages.userId})`,
      })
      .from(CoursesTable)
      .leftJoin(manages, eq(manages.courseCode, CoursesTable.code))
      .where(eq(CoursesTable.code, courseCode))
      .groupBy(CoursesTable.code);

    res.status(200).json({
      data: {
        ...course,
        teachers: courseTeachers.map((teacher) => teacher.teacher),
      },
      message: "Course has been found.",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Unexpected server error" });
  }
};

export const createCourse: RequestHandler = async (
  req: APIRequest<ICourseCreateSchema>,
  res
) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    const courseData = courseCreateSchema
      .omit({ group_id: true })
      .parse(req.body);

    const courseExists = await db.query.CoursesTable.findFirst({
      where: eq(CoursesTable.code, courseData.code),
    });

    if (courseExists)
      return res.status(400).json({
        message: "A course already exists with the provided course code",
      });

    // ? For now it will be like this:
    const groupData = await db
      .insert(group)
      .values({
        image_url: courseData.image_url,
        name: `${courseData.code}: ${courseData.name}`,
      })
      .returning();

    if (groupData.length === 0)
      return res.status(500).json({ message: "Error creating course group." });

    await db.insert(CoursesTable).values({
      ...courseData,
      group_id: groupData[0].id,
    });

    if(req.user.role === "professor/ta")
      await db.insert(Teaches).values({
        courseCode: courseData.code,
        userId: req.user.userId,
      });

    res.sendStatus(201);
  } catch (err) {
    if (err instanceof ZodError) {
      return res.status(400).json({ message: "Course data is invalid." });
    }

    res.status(500).json({ message: "Unexpected server error" });
  }
};

export const updateCourse: RequestHandler = async (
  req: APIRequest<ICourseUpdateSchema>,
  res
) => {
  try {
    const courseCode = req.params.courseCode;
    const courseUpdateData = courseUpdateSchema
      .omit({ code: true })
      .parse(req.body);

    const oldCourseData = await db.query.CoursesTable.findFirst({
      where: eq(CoursesTable.code, courseCode),
    });

    if (!oldCourseData)
      return res
        .status(400)
        .json({ message: "No course exists with the provided course code." });

    if (
      oldCourseData.image_url &&
      oldCourseData.image_url !== courseUpdateData.image_url
    ) {
      // delete image first if they exist
      const key = imageStorageKey(oldCourseData.image_url);
      await uploadThingApi.deleteFiles([key]);
    }

    await db
      .update(CoursesTable)
      .set(courseUpdateData)
      .where(eq(CoursesTable.code, courseCode));

    res.sendStatus(200);
  } catch (err) {
    if (err instanceof ZodError)
      return res
        .status(400)
        .json({ message: "Course update data is invalid." });

    res.status(500).json({ message: "Unexpected server error" });
  }
};

const ALLOWED_TO_COURSE_HEAD: userRolesType[] = ["course_head", "student"];

export const assignCourseHead: RequestHandler = async (
  req: APIRequest<IAssignCourseHeadSchema>,
  res
) => {
  try {
    if (!req.user || !req.user.year)
      return res.status(401).json({ message: "Unauthorized" });

    const { userId, courseCode } = assignCourseHeadSchema.parse(req.body);

    const student = await db.query.UsersTable.findFirst({
      where: eq(UsersTable.id, userId),
    });

    if (!student)
      return res
        .status(400)
        .json({ message: "No existing students have the provided id" });

    if (student.year !== req.user.year)
      return res.status(400).json({
        message: "Cannot assign a course head for someone not in your year",
      });

    if (!ALLOWED_TO_COURSE_HEAD.includes(student.role))
      return res
        .status(400)
        .json({ message: "You can only make a student a course head" });

    const courseExists = await db.query.CoursesTable.findFirst({
      where: eq(CoursesTable.code, courseCode),
    });

    if (!courseExists)
      return res
        .status(400)
        .json({ message: "The provided course doesn't exist." });

    const manageExists = await db.query.manages.findFirst({
      where: and(
        eq(manages.userId, userId),
        eq(manages.courseCode, courseCode)
      ),
    });

    if (manageExists)
      return res.status(400).json({
        message: `The user already is a course head for ${courseCode}`,
      });

    await db
      .update(UsersTable)
      .set({ role: "course_head" })
      .where(eq(UsersTable.id, userId));

    await db.insert(manages).values({ userId, courseCode });

    res.status(200).json({ message: "Successfully assigned course head." });
  } catch (err) {
    if (err instanceof ZodError) {
      return res.status(400).json({ message: "Invalid data." });
    }
    console.log(err);
    res.status(500).json({ message: "Unexpected server error" });
  }
};

export const removeCourseHead: RequestHandler = async (
  req: APIRequest,
  res
) => {
  try {
    if (!req.user || !req.user.year)
      return res.status(401).json({ message: "Unauthorized" });

    const { userId, courseCode } = assignCourseHeadSchema.parse(req.body);

    const student = await db.query.UsersTable.findFirst({
      where: eq(UsersTable.id, userId),
    });

    if (!student)
      return res
        .status(400)
        .json({ message: "No existing students have the provided id" });

    if (student.year !== req.user.year)
      return res.status(400).json({
        message: "Cannot assign a course head for someone not in your year",
      });

    await db
      .delete(manages)
      .where(
        and(eq(manages.userId, userId), eq(manages.courseCode, courseCode))
      );

    res.status(200).json({ message: "Successfully removed course head." });
  } catch (err) {
    if (err instanceof ZodError) {
      return res.status(400).json({ message: "Invalid data." });
    }

    res.status(500).json({ message: "Unexpected server error" });
  }
};

export const getManagedCourses: RequestHandler = async (
  req: APIRequest,
  res
) => {
  try {
    if (!req.user || !req.user.year)
      return res.status(401).json({ message: "Unauthorized" });

    const userId = req.params.id;

    const user = await db.query.UsersTable.findFirst({
      with: {
        managedCoures: {
          with: {
            course: true,
          },
        },
      },
      where: eq(UsersTable.id, userId),
    });

    if (!user)
      return res.status(400).json({ message: "No user with this id exists." });

    if (user.year != req.user.year)
      return res.status(401).json({
        message: "Can only get managed courses for users in your year.",
      });

    res
      .status(200)
      .json(user.managedCoures.map((managedCourse) => managedCourse.course));
  } catch (err) {
    res.status(500).json({ message: "Unexpected server error" });
  }
};

export const getManageableCourses: RequestHandler = async (
  req: APIRequest,
  res
) => {
  try {
    if (!req.user || !req.user.year)
      return res.status(401).json({ message: "Unauthorized" });

    const userId = req.params.id;

    const managedCourseCodes = db
      .select({
        code: manages.courseCode,
      })
      .from(manages)
      .where(eq(manages.userId, userId));

    const manageableCourses = await db
      .select()
      .from(CoursesTable)
      .where(notInArray(CoursesTable.code, managedCourseCodes));

    res.status(200).json(manageableCourses);
  } catch (err) {
    res.status(500).json({ message: "Unexpected server error" });
  }
};

export const getCurrentUserEnrolledCourses: RequestHandler = async (
  request: APIRequest,
  response,
  next
) => {
  const userId = request.user?.userId;

  try {
    if (!userId) throw new InternalServerError("User not wired to request.");

    const data = await db.query.enrolledIn.findMany({
      where: (row, { eq }) => eq(row.userId, userId),
      with: {
        course: {
          with: {
            teachers: {
              with: {
                teacher: true,
              },
            },
            courseHeads: true,
          },
        },
      },
    });

    const courses = data.map((element) => ({
      ...element.course,
      teachers: element.course.teachers.map((teacher) => teacher.teacher),
      representatives_ids: element.course.courseHeads.map(
        (head) => head.userId
      ),
    }));

    response.status(200).json({
      message: "Current user enrolled courses have been found successfully.",
      data: courses,
    });
  } catch (error) {
    next(error);
  }
};

export const getCourseMembers: RequestHandler = async (
  request,
  response,
  next
) => {
  const courseCode = request.params.courseCode;
  try {
    const psfOptions = createPsfSchema({
      sortBySchema: createSortBySchema(SORTABLE_USER_COLUMNS),
    }).parse(request.query);

    // TODO: Massely 3al sql injection
    const totalMessagesQuery = sql<number>`(
      SELECT COUNT(*)::integer
      FROM ${message}
      INNER JOIN ${group} ON ${message.group_id} = ${group.id}
      INNER JOIN ${CoursesTable} ON ${CoursesTable.group_id} = ${group.id}
      WHERE ${CoursesTable.code} = ${courseCode} 
      AND ${message.sender_id} = ${UsersTable.id}
    )`.as("total_messages");

    const assignmentsSubmittedQuery = sql<number>`(
      SELECT COUNT(*)::integer
      FROM ${submission}
      WHERE ${submission.student_id} = ${UsersTable.id}
      AND ${submission.is_turned_in} = TRUE
    )`.as("assignments_submitted");

    const pollsVotedQuery = sql<number>`(
      SELECT COUNT(DISTINCT ${coursesAnnouncements.announcement_id})::integer
      FROM ${vote}
      INNER JOIN ${pollItem} ON ${vote.poll_item_id} = ${pollItem.id}
      INNER JOIN ${coursesAnnouncements} ON ${coursesAnnouncements.announcement_id} = ${pollItem.announcement_id}
      WHERE ${coursesAnnouncements.course_id} = ${courseCode} AND ${vote.voter_id} = ${UsersTable.id}
    )`.as("polls_voted");

    const averageGradsQuery = sql<number>`AVG(${submission.grade})::double precision`;

    const sortByToOrderingElement = {
      first_name: UsersTable.first_name,
      parent_name: UsersTable.parent_name,
      messages_in_course_group: totalMessagesQuery,
      average_grade_in_course: averageGradsQuery,
      assignments_submitted_in_course: assignmentsSubmittedQuery,
      polls_voted_in_course: pollsVotedQuery,
    };

    const orderBy: SQL[] = [];

    psfOptions.sortBy?.forEach((attribute, index) => {
      const order =
        !psfOptions.sortOrder || psfOptions.sortOrder[index] === "asc"
          ? asc
          : desc;
      orderBy.push(order(sortByToOrderingElement[attribute]));
    });

    const where: SQL[] = [];

    if (request.query.student_code) {
      where.push(
        ilike(UsersTable.code, `%${request.query.student_code.toString()}%`)
      );
    }

    const courseStudents = await db
      .select({
        ...getTableColumns(UsersTable),
        total_messages: totalMessagesQuery,
        average_grade: averageGradsQuery,
        assignments_submitted: assignmentsSubmittedQuery,
        polls_voted: pollsVotedQuery,
      })
      .from(UsersTable)
      .fullJoin(enrolledIn, eq(enrolledIn.userId, UsersTable.id))
      .fullJoin(CoursesTable, eq(CoursesTable.code, enrolledIn.courseCode))
      .fullJoin(group, eq(group.id, CoursesTable.group_id))
      .fullJoin(message, eq(message.group_id, group.id))
      .fullJoin(submission, eq(submission.student_id, UsersTable.id))
      .where(and(eq(CoursesTable.code, courseCode), ...where))
      .groupBy(UsersTable.id, CoursesTable.code, group.id)
      .orderBy(...orderBy)
      // TODO: Remove hard coded page size
      .limit(psfOptions.pageSize ?? 1000)
      .offset((psfOptions.pageIndex ?? 0) * (psfOptions.pageSize ?? 0));

    const courseInstructors = await db.query.Teaches.findMany({
      where: (row, { eq }) => eq(row.courseCode, courseCode),
      with: {
        teacher: true,
      },
    });

    response.status(200).json({
      data: {
        students: courseStudents,
        instructors: courseInstructors.map((element) => element.teacher),
      },
      message: "Course members found successfully.",
      // TODO: I think that the meta is inconsistent since we return instructors and students
      // and filtering options don't apply to both
      meta: {
        pageIndex: psfOptions.pageIndex,
        pageSize: psfOptions.pageSize,
        total: courseStudents.length,
        totalPages: Math.ceil(
          courseStudents.length / (psfOptions.pageSize ?? 10)
        ),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getAllCourses: RequestHandler = async (
  request: APIRequest,
  response,
  next
) => {
  try {
    if (!request.user) throw new InternalServerError("User is not wired to request.");

    const psfOptions = psfSchema.parse(request.query);

    const instructors = alias(UsersTable, "instructors");
    const coursesHeads = alias(UsersTable, "coursesHeads");

    const filteringOptions: SQL[] = [];

    if (request.query.course_code) {
      filteringOptions.push(
        ilike(CoursesTable.code, `%${request.query.course_code}%`)
      );
    }

    const coursesList = await db
      .select({
        ...getTableColumns(CoursesTable),
        students_number: count(UsersTable.id),
      })
      .from(CoursesTable)
      .leftJoin(enrolledIn, eq(enrolledIn.courseCode, CoursesTable.code))
      .leftJoin(UsersTable, eq(UsersTable.id, enrolledIn.userId))
      // TODO: If pageSize is undefined, we'll return all courses data, which might be huge
      // I think we should set a default, however, I'll keep it like this because their are some pages in the front end
      // that don't have pagination yet
      .limit(psfOptions.pageSize ?? 1000)
      .offset((psfOptions.pageIndex ?? 0) * (psfOptions.pageSize ?? 0))
      .where(and(sql`TRUE`, ...filteringOptions))
      .groupBy(CoursesTable.code)
      .orderBy(
        !psfOptions.sortOrder || psfOptions.sortOrder === "asc"
          ? asc(count(UsersTable.id))
          : desc(count(UsersTable.id))
      );

    const coursesCount = await db.$count(CoursesTable);

    // Enrich with related data
    const courses = await Promise.all(
      coursesList.map(async (course) => {
        const [teachers, representatives] = await Promise.all([
          db
            .select()
            .from(instructors)
            .innerJoin(Teaches, eq(Teaches.userId, instructors.id))
            .where(eq(Teaches.courseCode, course.code)),

          db
            .select()
            .from(coursesHeads)
            .innerJoin(manages, eq(manages.userId, coursesHeads.id))
            .where(eq(manages.courseCode, course.code)),
        ]);

        return {
          ...course,
          teachers: teachers.map((t) => t.instructors),
          representatives: representatives.map((r) => r.coursesHeads),
        };
      })
    );

    if(request.user?.role !== "professor/ta" && request.user?.role !== "system_admin")
    {
      const blacklistCourseCodes  = await db.select({courseCode: blacklist.courseCode}).from(blacklist).where(eq(blacklist.userId, request.user?.userId));
      const blacklistCodes = blacklistCourseCodes.map(b => b.courseCode);
      const filteredCourses = courses.filter(
        course => !blacklistCodes.includes(course.code)
      );

      return response.status(200).json({
        message: "All courses found.",
        data: filteredCourses,
        meta: {
          // TODO: Replace the hardcoded value after ??
          pageSize: psfOptions.pageSize ?? 1000,
          pageIndex: psfOptions.pageIndex ?? 0,
          total: coursesCount,
          // TODO: Replace the hardcoded value after ??
          totalPages: Math.ceil(coursesCount / (psfOptions.pageSize ?? 1000)),
        },
      });
    }

    response.status(200).json({
      message: "All courses found.",
      data: courses,
      meta: {
        // TODO: Replace the hardcoded value after ??
        pageSize: psfOptions.pageSize ?? 1000,
        pageIndex: psfOptions.pageIndex ?? 0,
        total: coursesCount,
        // TODO: Replace the hardcoded value after ??
        totalPages: Math.ceil(coursesCount / (psfOptions.pageSize ?? 1000)),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const enrollInCourse: RequestHandler = async (
  request: APIRequest,
  response,
  next
) => {
  try {
    const courseCode = request.params.courseCode;
    // TODO: Try to replace this repetitive procedure with a better one
    const userId = request.user?.userId;
    if (!userId) throw new InternalServerError("User is not wired to request.");

    const [result] = await db
      .insert(enrolledIn)
      .values({
        courseCode,
        userId,
      })
      .onConflictDoNothing()
      .returning();

    response.status(200).json({
      message: "Student enrolled in course successfully.",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getCurrentInstructorCourses: RequestHandler = async (
  request: APIRequest,
  response,
  next
) => {
  try {
    const instructorId = request.user?.userId;
    if (!instructorId) throw new InternalServerError("userId is undefined");

    const instructorCourses = await db.query.Teaches.findMany({
      where: (row, { eq }) => eq(row.userId, instructorId),
      with: {
        course: {
          with: {
            teachers: {
              with: {
                teacher: true,
              },
            },
          },
        },
      },
    });

    const cleanInstructorCourses = instructorCourses.map((element) => ({
      ...element.course,
      teachers: element.course.teachers.map((element) => element.teacher),
    }));

    response.status(200).json({
      message: "Current instructor courses found.",
      data: cleanInstructorCourses,
    });
  } catch (error) {
    next(error);
  }
};

export const assignCurrentInstructorToCourse: RequestHandler = async (
  request: APIRequest,
  response,
  next
) => {
  try {
    const instructorId = request.user?.userId;
    const courseCode = request.params.courseCode;

    if (!instructorId)
      throw new InternalServerError("instructorId is undefined");

    await db.insert(Teaches).values({
      courseCode,
      userId: instructorId,
    });

    response.status(201).json({
      message: "Instructor assigned to course successfully.",
    });
  } catch (error) {
    next(error);
  }
};

// Admin Functions
export const deleteCourse: RequestHandler = async (
  req: APIRequest, 
  res
) => {
  try {
    const courseCode = req.params.courseCode;

    if (!courseCode)
      return res.status(400).json({ message: "Course code is required." });

    const course = await db.query.CoursesTable.findFirst({
      where: eq(CoursesTable.code, courseCode),
    });

    if (!course)
      return res
        .status(400)
        .json({ message: "Course Not Found." });

    // Collect announcement ids linked to this course so we can delete the announcement rows
    const courseAnnouncements = await db.query.coursesAnnouncements.findMany({
      where: eq(coursesAnnouncements.course_id, courseCode),
    });
    const announcementIds = courseAnnouncements.map(
      (courseAnnouncement) => courseAnnouncement.announcement_id
    );

    await db
      .delete(coursesAnnouncements)
      .where(eq(coursesAnnouncements.course_id, courseCode));

    if (announcementIds.length > 0) {
      await db
        .delete(announcement)
        .where(inArray(announcement.id, announcementIds));
    }

    if (course.image_url) {
      // delete image first if they exist
      const key = course.image_url.split("/f/")[1];
      await uploadThingApi.deleteFiles([key]);
    }

    // Delete course
    await db.delete(CoursesTable).where(eq(CoursesTable.code, courseCode));

    // Delete discussion group (if exists)
    if (course.group_id) {
      await db.delete(group).where(eq(group.id, course.group_id));
    }

    res.status(200).json({ message: "Course has been deleted successfully." });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Unexpected server error" });
  }
};

export const removeCourseUser: RequestHandler = async (req: APIRequest, res, next) => {
  const targetUserId = req.params.user_id;
  const courseId = req.params.courseCode;

  try {

    if (!req.user) return res.status(401).json({ message: "Unauthorized" });
    if (req.user.role !== "system_admin")
      return res.status(401).json({ message: "Unauthorized" });

    const foundUser = await db.query.UsersTable.findFirst({
      where: eq(UsersTable.id, targetUserId),
    });

    if (!foundUser) throw new NotFoundError("User not found.");

    // Check if user is enrolled or teaching
    const isEnrolled = await db.query.enrolledIn.findFirst({
      where: (and(eq(enrolledIn.courseCode, courseId), eq(enrolledIn.userId, targetUserId))),
    });

    const isTeaching = await db.query.Teaches.findFirst({
      where: (and(eq(Teaches.courseCode, courseId), eq(Teaches.userId, targetUserId))),
    });

    // Remove from enrolledIn if enrolled
    if (isEnrolled) {
      await db
        .delete(enrolledIn)
        .where(and(eq(enrolledIn.courseCode, courseId), eq(enrolledIn.userId, targetUserId)));

       // Add to blacklist (check if not already blacklisted) --> extra safety
      const isBlacklisted = await db.query.blacklist.findFirst({
        where: (and(eq(blacklist.courseCode, courseId), eq(blacklist.userId, targetUserId))),
      });

      if (!isBlacklisted) {
        await db.insert(blacklist).values({
          courseCode: courseId,
          userId: targetUserId,
        });
      }
    }

    // Remove from Teaches if teaching
    if (isTeaching) {
      await db
        .delete(Teaches)
        .where(and(eq(Teaches.courseCode, courseId), eq(Teaches.userId, targetUserId)));
    }

    res.status(200).json({
      message: "User removed from course successfully.",
    });
  } catch (error) {
    next(error);
  }
};

export const getPaginatedCourses: RequestHandler = async (
  request: APIRequest,
  response,
  next
) => {
  try {
    const page = parseInt(request.query.page as string) || 1;
    const perPage = parseInt(request.query.per_page as string) || 10;
    const search = request.query.search as string | undefined;
    const userId = request.user?.userId;

    const whereConditions = [];

    if (search && search.trim()) {
      const trimmed = search.trim();
      whereConditions.push(
        or(
          ilike(CoursesTable.code, `%${trimmed}%`),
          ilike(CoursesTable.name, `%${trimmed}%`)
        )
      );
    }

    const whereClause =
      whereConditions.length > 0 ? and(...(whereConditions as any)) : undefined;

    const allMatchingCourses = await db
      .select({ code: CoursesTable.code })
      .from(CoursesTable)
      .where(whereClause);

    const total = allMatchingCourses.length;
    const totalPages = Math.max(1, Math.ceil(total / perPage));
    const offset = (page - 1) * perPage;

    const courses = await db
      .select({
        ...getTableColumns(CoursesTable),
        students_number: sql<number>`COALESCE(COUNT(${enrolledIn.userId}), 0)::int`,
      })
      .from(CoursesTable)
      .leftJoin(enrolledIn, eq(enrolledIn.courseCode, CoursesTable.code))
      .where(whereClause)
      .groupBy(
        CoursesTable.code,
        CoursesTable.name,
        CoursesTable.year,
        CoursesTable.image_url,
        CoursesTable.group_id
      )
      .limit(perPage)
      .offset(offset);

    console.log(courses)

    response.status(200).json({
      message: "All courses found.",
      data: {
        courses,
        total,
        page,
        perPage,
        totalPages,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getAdminCourseMembers: RequestHandler = async (
  request,
  response,
  next
) => {
  const courseCode = request.params.courseCode;
  try {
    const courseStudents = await db.query.enrolledIn.findMany({
      where: (row, { eq }) => eq(row.courseCode, courseCode),
      with: {
        student: true,
      },
    });

    const courseInstructors = await db.query.Teaches.findMany({
      where: (row, { eq }) => eq(row.courseCode, courseCode),
      with: {
        teacher: true,
      },
    });

    response.status(200).json({
      data: {
        students: courseStudents.map((element) => element.student),
        instructors: courseInstructors.map((element) => element.teacher),
      },
      message: "Course members found successfully.",
    });
  } catch (error) {
    next(error);
  }
};
