import z from "zod";
import { usersInsertSchema } from "../drizzle/schemas/user";

export const changePasswordSchema = z.object({
  oldPassword: usersInsertSchema.shape.password,
  newPassword: usersInsertSchema.shape.password,
});

export type IChangePasswordSchema = z.infer<typeof changePasswordSchema>;
