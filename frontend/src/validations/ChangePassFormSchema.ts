import z from "zod";
import { signupFormSchema } from "./SignupFormSchema";

export const changePassFormSchema = z
  .object({
    oldPassword: signupFormSchema.shape.password,
    newPassword: signupFormSchema.shape.password,
  })
  .refine((data) => data.oldPassword !== data.newPassword, {
    message: "New password must be different from the old password.",
    path: ["newPassword"],
  });

export type IChangePassFormSchema = z.infer<typeof changePassFormSchema>;
