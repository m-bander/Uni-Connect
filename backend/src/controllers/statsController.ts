import { type RequestHandler } from "express";
import { db } from "../drizzle/db";
import { and, desc, eq, sql } from "drizzle-orm";
import {
  assignment,
  CoursesTable,
  enrolledIn,
  group,
  message,
  sessionsTable,
  submission,
} from "../drizzle";
import { count } from "drizzle-orm";
import { APIRequest } from "../types/api";

export const getGeneralStats: RequestHandler = async (req, res) => {
  try {
    const countStats = await db.execute(
      sql`call find_count_stats(null, null);`
    );

    const { student_count, course_count } = countStats.rows[0] as {
      student_count: number;
      course_count: number;
    };

    const minCourseStudentsStats = await db.execute(
      sql`call find_course_by_student_course('min', null, null, null);`
    );

    type courseStudentStats = {
      course_code: string;
      course_name: string;
      course_student_count: number;
    };

    const min_course = minCourseStudentsStats.rows[0] as courseStudentStats;

    const maxCourseStudentsStats = await db.execute(
      sql`call find_course_by_student_course('max', null, null, null);`
    );
    const max_course = maxCourseStudentsStats.rows[0] as courseStudentStats;

    res.status(200).json({
      student_count,
      course_count,
      min_course,
      max_course,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Unexpected server error." });
  }
};

export const getStudentsByYear: RequestHandler = async (req, res) => {
  try {
    const studentsPerYear = await db.execute(
      sql`call student_per_year(null, null, null, null, null)`
    );

    const { year1, year2, year3, year4, year5 } = studentsPerYear.rows[0] as {
      year1: number;
      year2: number;
      year3: number;
      year4: number;
      year5: number;
    };

    res.status(200).json([
      { yearType: "year1", students: year1 },
      { yearType: "year2", students: year2 },
      { yearType: "year3", students: year3 },
      { yearType: "year4", students: year4 },
      { yearType: "year5", students: year5 },
    ]);
  } catch (err) {
    res.status(500).json({ message: "Unexpected server error" });
  }
};

export const getMostActiveGroups: RequestHandler = async (req, res) => {
  try {
    const messageCountExp = count(message.id);

    const data = await db
      .select({
        courseCode: CoursesTable.code,
        groupName: group.name,
        courseYear: CoursesTable.year,
        messageCount: messageCountExp,
      })
      .from(CoursesTable)
      .innerJoin(group, eq(group.id, CoursesTable.group_id))
      .leftJoin(message, eq(message.group_id, CoursesTable.group_id))
      .groupBy(CoursesTable.code, CoursesTable.name, group.name)
      .orderBy(desc(messageCountExp))
      .limit(5);

    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ message: "Unexpected server error" });
  }
};

export const getAverageCourseGrade: RequestHandler = async (req, res) => {
  try {
    const averageGrade = sql<number>`
        avg(${submission.grade}::float / ${assignment.max_grade}) * 100
    `;

    const data = await db
      .select({
        courseCode: CoursesTable.code,
        averageGrade,
      })
      .from(CoursesTable)
      .innerJoin(assignment, eq(CoursesTable.code, assignment.course_id))
      .leftJoin(submission, eq(assignment.id, submission.assignment_id))
      .where(eq(submission.is_turned_in, true))
      .groupBy(CoursesTable.code)
      .orderBy(desc(averageGrade))
      .limit(5);

    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ message: "Unexpected server error" });
  }
};

export const getAssignmentCompletionRate: RequestHandler = async (req, res) => {
  try {
    const data = await db
      .select({
        code: CoursesTable.code,
        name: CoursesTable.name,
        assigned: sql<number>`(
      SELECT COUNT(*) 
      FROM ${enrolledIn} 
      WHERE ${enrolledIn.courseCode} = ${CoursesTable.code}
    )`,
        late: sql<number>`COUNT(CASE WHEN ${submission.turned_in_at} > ${assignment.deadline_at} THEN 1 END)`,
        onTime: sql<number>`COUNT(CASE WHEN ${submission.turned_in_at} <= ${assignment.deadline_at} THEN 1 END)`,
        completionRate: sql<number>`COUNT(${submission.is_turned_in})::double precision * 100 / (
      SELECT COUNT(*) 
      FROM ${enrolledIn} 
      WHERE ${enrolledIn.courseCode} = ${CoursesTable.code}
    )`,
      })
      .from(CoursesTable)
      .leftJoin(assignment, eq(CoursesTable.code, assignment.course_id))
      .innerJoin(submission, eq(submission.assignment_id, assignment.id))
      .groupBy(CoursesTable.code, CoursesTable.name);

    res.status(200).json(
      data.map((item) => ({
        ...item,
        missing: item.assigned - item.onTime - item.late,
      }))
    );
  } catch (err) {
    res.status(500).json({ message: "Unexpected server error." });
  }
};

export const recordSessionDuration: RequestHandler = async (
  req: APIRequest<{ durationMs: number }>,
  res
) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    const durationMs = req.body.durationMs;
    const currDate = new Date().toLocaleDateString().split("T")[0];

    const oldData = await db.query.sessionsTable.findFirst({
      where: and(
        eq(sessionsTable.sessionDate, currDate),
        eq(sessionsTable.userId, req.user.userId)
      ),
    });
    console.log(oldData);

    if (!oldData) {
      await db.insert(sessionsTable).values({
        sessionDate: currDate,
        sessionDuration: durationMs,
        userId: req.user.userId,
      });
    } else {
      await db
        .update(sessionsTable)
        .set({
          sessionDuration: oldData.sessionDuration + durationMs,
        })
        .where(
          and(
            eq(sessionsTable.sessionDate, currDate),
            eq(sessionsTable.userId, req.user.userId)
          )
        );
    }

    res.sendStatus(201);
  } catch (err) {
    res.status(500).json({ message: "Unexpected server error." });
  }
};

export const getDailyUsersStats: RequestHandler = async (req, res) => {
  try {
    const dailyUsage = await db
      .select({
        sessionDate: sessionsTable.sessionDate,
        userCount: sql<number>`COUNT(DISTINCT ${sessionsTable.userId})`,
      })
      .from(sessionsTable)
      .groupBy(sessionsTable.sessionDate)
      .orderBy(sessionsTable.sessionDate)
      .limit(15);

    const averageDailyProc = await db.execute(
      `call find_daily_users_average(null, null)`
    );
    const { avg_30_days, avg_7_days } = averageDailyProc.rows[0] as {
      avg_30_days: number;
      avg_7_days: number;
    };

    res.status(200).json({
      avg_7_days,
      avg_30_days,
      dailyUsage,
    });
  } catch {
    res.status(500).json({ message: "Unexpected server error" });
  }
};

export const getSessionDurationStats: RequestHandler = async (req, res) => {
  try {
    const sessionStats = await db
      .select({
        sessionDate: sessionsTable.sessionDate,
        averageDuration: sql<number>`AVG(${sessionsTable.sessionDuration})::float`,
      })
      .from(sessionsTable)
      .groupBy(sessionsTable.sessionDate)
      .orderBy(sessionsTable.sessionDate)
      .limit(15);

    const [last] = await db
      .select({
        totalAverage: sql<number>`AVG(${sessionsTable.sessionDuration})::float`,
      })
      .from(sessionsTable);

    res.status(200).json({
      overallAverage: last.totalAverage,
      sessionStats,
    });
  } catch {
    res.status(500).json({ message: "Unexpected server error" });
  }
};
