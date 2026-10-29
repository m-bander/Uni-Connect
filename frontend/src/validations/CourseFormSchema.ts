import { YEARS } from "@/constants/student/student";
import z from "zod";

const CourseFormSchema = z.object({
  image_url: z.string().optional(),
  code: z.string().nonempty("Course code is required."),
  name: z.string().nonempty("Course name is required."),
  year: z.enum(YEARS),
  department: z.string().min(1).max(255).optional(),
  description: z.string().max(2000).optional(),
});

type ICourseFormSchema = z.infer<typeof CourseFormSchema>;

export { CourseFormSchema, type ICourseFormSchema };
