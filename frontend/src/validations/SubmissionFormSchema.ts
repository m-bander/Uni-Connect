import * as z from "zod";

const submissionFormSchema = z.object({
  file_ids: z.array(z.string()).nonempty("A file must be provided.")
});

type InferredSubmissionFormSchema = z.infer<typeof submissionFormSchema>;

export { submissionFormSchema, type InferredSubmissionFormSchema };
