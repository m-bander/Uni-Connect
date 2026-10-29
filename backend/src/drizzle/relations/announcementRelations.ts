import { relations } from "drizzle-orm";
import {
  announcement,
  coursesAnnouncements,
  classesAnnouncements,
} from "../schemas/announcement";
import { pollItem } from "../schemas/poll-item";
import { CoursesTable } from "../schemas/course";
import { UsersTable } from "../schemas/user";

export const announcementRelations = relations(
  announcement,
  ({ many, one }) => ({
    pollItems: many(pollItem),
    announcer: one(UsersTable, {
      references: [UsersTable.id],
      fields: [announcement.announcer_id],
    }),
    coursesAnnouncement: one(coursesAnnouncements),
  })
);

export const coursesAnnouncementsRelations = relations(
  coursesAnnouncements,
  ({ one }) => ({
    announcement: one(announcement, {
      fields: [coursesAnnouncements.announcement_id],
      references: [announcement.id],
    }),
    course: one(CoursesTable, {
      fields: [coursesAnnouncements.course_id],
      references: [CoursesTable.code],
    }),
  })
);

export const classesAnnouncementsRelations = relations(
  classesAnnouncements,
  ({ one }) => ({
    announcement: one(announcement, {
      fields: [classesAnnouncements.announcement_id],
      references: [announcement.id],
    }),
  })
);
