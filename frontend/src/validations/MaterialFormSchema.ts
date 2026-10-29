import * as z from "zod";

const materialFormSchema = z.object({
  title: z.string().nonempty("Title is required"),
  folder: z.enum([
    "lecture",
    "sheet",
    "quiz",
    "assignment",
    "tutorial",
    "textbook",
  ]),
  file_id: z.string().nonempty("A file must be provided."),
});

type InferredMaterialFormSchema = z.infer<typeof materialFormSchema>;

export { materialFormSchema, type InferredMaterialFormSchema };
