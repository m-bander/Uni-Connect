import * as z from "zod";
import { YEARS } from "@/constants/student/student";

const StudentProfileFormSchema = z.object({
  image_url: z.string().nullable(),
  code: z.string().nullable(),
  first_name: z.string().nonempty("You must enter a first name"),
  parent_name: z.string().nonempty("You must enter a parent name"),
  grandparent_name: z.string().optional(),
  family_name: z.string().optional(),
  email: z.email().nonempty("Your must enter an email."),
  year: z.enum(YEARS).nullable(),
});

type InferredStudentProfileSchema = z.infer<typeof StudentProfileFormSchema>;

export { StudentProfileFormSchema, type InferredStudentProfileSchema };
