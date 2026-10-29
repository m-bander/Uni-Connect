import * as z from "zod";

const basicFormSchema = z
  .object({
    email: z.email("Please enter a valid email."),
    password: z
      .string()
      .min(8, "Password should be at least 8 characters long."),
    confirmPassword: z.string(),
    firstName: z
      .string()
      .min(2, "First name should be at least 2 characters long."),
    parentName: z
      .string()
      .min(2, "Second name should be at least 2 characters long."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    error: "Password and Confirm Password do not match.",
    path: ["confirmPassword"],
  });

type InferredFormSchema = z.infer<typeof basicFormSchema>;

export { basicFormSchema, type InferredFormSchema };
