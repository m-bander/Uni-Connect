import * as z from "zod";

const assignmentFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  dueDate: z.iso.date(),
  dueTime: z.iso.time(),
  max_grade: z
    .number()
    .min(1, "Max grade should be greater than or equal to 1."),
});

type InferredAssignmentFormSchema = z.infer<typeof assignmentFormSchema>;

export { assignmentFormSchema, type InferredAssignmentFormSchema };
