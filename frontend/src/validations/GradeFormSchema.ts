import * as z from "zod";

const gradeFormSchema = z.object({
  grade: z
    .string()
    .min(1, "Grade is required")
    .refine((val) => !isNaN(Number(val)), "Grade must be a number")
    .refine((val) => Number(val) >= 0, "Grade must be at least 0"),
  feedback: z.string().optional(),
});

type InferredGradeFormSchema = z.infer<typeof gradeFormSchema>;

export { gradeFormSchema, type InferredGradeFormSchema };