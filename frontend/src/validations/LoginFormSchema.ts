import * as z from "zod";

const loginFormSchema = z.object({
  email: z.email("Please enter a valid email."),
  password: z.string().min(8, "Incorrect password."),
});

type InferredFormSchema = z.infer<typeof loginFormSchema>;

export { loginFormSchema, type InferredFormSchema };
