import { relations } from "drizzle-orm";
import { MaterialTable } from "../schemas/materials";
import { CoursesTable } from "../schemas/course";
import { UsersTable } from "../schemas/user";
import { FileTable } from "../schemas/file";

export const materialRelations = relations(MaterialTable, ({ one }) => ({
  course: one(CoursesTable, {
    fields: [MaterialTable.course_code],
    references: [CoursesTable.code],
  }),
  uploader: one(UsersTable, {
    fields: [MaterialTable.uploader_id],
    references: [UsersTable.id],
  }),
  file: one(FileTable, {
    fields: [MaterialTable.file_id],
    references: [FileTable.id],
  }),
}));
