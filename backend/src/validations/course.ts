import z from "zod";

export const assignCourseHeadSchema = z.object({
  userId: z.string().nonempty(),
  courseCode: z.string().nonempty(),
});

export type IAssignCourseHeadSchema = z.infer<typeof assignCourseHeadSchema>;
