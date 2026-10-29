import * as z from "zod";

const eventFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  notes: z.string().optional(),
  dueDate: z.string().min(1, "Due date is required"),
  dueTime: z.string().min(1, "Due time is required"),
  type: z.enum(["quiz", "exam", "poll", "project", "assignment", "lab_exam"]),
  courseCode: z.string().min(1, "Course is required"),
});

type InferredEventFormSchema = z.infer<typeof eventFormSchema>;

export { eventFormSchema, type InferredEventFormSchema };

