import { relations } from "drizzle-orm";
import { announcement, coursesAnnouncements } from "../schemas/announcement";
import { CoursesTable, enrolledIn, manages, Teaches, blacklist } from "../schemas/course";
import { event } from "../schemas/event";
import { MaterialTable } from "../schemas/materials";
import { group } from "../schemas/group";
import { UsersTable } from "../schemas/user";
import { assignment } from "../schemas/assignment";

export const courseRelations = relations(CoursesTable, ({ many, one }) => ({
  teachers: many(Teaches),
  students: many(UsersTable, { relationName: "student_enrolled_courses" }),
  group: one(group, {
    references: [group.id],
    fields: [CoursesTable.group_id],
  }),
  events: many(event),
  courseHeads: many(manages),
  materials: many(MaterialTable),
  courseAnnouncements: many(coursesAnnouncements),
  assignments: many(assignment),
  blacklistedUsers: many(blacklist),
}));

export const teachingRelations = relations(Teaches, ({ one }) => ({
  teacher: one(UsersTable, {
    fields: [Teaches.userId],
    references: [UsersTable.id],
  }),
  course: one(CoursesTable, {
    fields: [Teaches.courseCode],
    references: [CoursesTable.code],
  }),
}));

export const enrolledInRelations = relations(enrolledIn, ({ one }) => ({
  student: one(UsersTable, {
    fields: [enrolledIn.userId],
    references: [UsersTable.id],
  }),
  course: one(CoursesTable, {
    fields: [enrolledIn.courseCode],
    references: [CoursesTable.code],
  }),
}));

export const managesRelations = relations(manages, ({ one }) => ({
  student: one(UsersTable, {
    fields: [manages.userId],
    references: [UsersTable.id],
  }),
  course: one(CoursesTable, {
    fields: [manages.courseCode],
    references: [CoursesTable.code],
  }),
}));

export const blacklistRelations = relations(blacklist, ({ one }) => ({
  user: one(UsersTable, {
    fields: [blacklist.userId],
    references: [UsersTable.id],
  }),
  course: one(CoursesTable, {
    fields: [blacklist.courseCode],
    references: [CoursesTable.code],
  }),
}));
