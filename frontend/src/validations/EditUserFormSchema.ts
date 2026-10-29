import * as z from "zod";

const editUserFormSchema = z.object({
  email: z.email("Please enter a valid email."),
  firstName: z
    .string()
    .min(2, "First name should be at least 2 characters long."),
  parentName: z
    .string()
    .min(2, "Second name should be at least 2 characters long."),
});

type InferredEditUserFormSchema = z.infer<typeof editUserFormSchema>;

export { editUserFormSchema, type InferredEditUserFormSchema };

