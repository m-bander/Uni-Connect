import { YEARS } from "@/constants/student/student";
import { SELECTABLE_ROLES } from "@/constants/user/role";
import * as z from "zod";
import { basicFormSchema } from "./BasicFormSchema";

const signupFormSchema = basicFormSchema
  .safeExtend({
    role: z.enum(
      SELECTABLE_ROLES.map((role) => role.toLowerCase()),
      {
        error: "Please select a role.",
      }
    ),
    year: z.enum(YEARS).optional(),
    studentCode: z.string().optional(),
  })
  .refine((data) => data.role !== "student" || data.year, {
    error: "Year is required for students.",
    path: ["year"],
  })
  .refine((data) => data.role !== "student" || data.studentCode, {
    error: "Code is required for students.",
    path: ["studentCode"],
  });

type InferredFormSchema = z.infer<typeof signupFormSchema>;

export { signupFormSchema, type InferredFormSchema };
