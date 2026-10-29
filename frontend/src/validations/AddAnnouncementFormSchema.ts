import { z } from "zod";

const addAnnouncementSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("poll"),
    // The pollItems is in this format instead of a regular string array, because this
    // is the type that react hook form expects.
    pollItems: z
      .array(
        z.object({
          value: z.string().nonempty({ error: "This field can't be empty." }),
          id: z.uuid().optional(),
        })
      )
      .min(2, { error: "There should be at least 2 poll items." }),
    title: z
      .string()
      .min(2, { error: "The title should be at least 2 characters long." }),
    content: z.string().optional(),
  }),
  z.object({
    type: z.literal("announcement"),
    title: z.string().optional(),
    content: z
      .string()
      .min(2, { error: "The content should be at least 2 characters long." }),
  }),
]);

type InferredAnnouncementFormSchema = z.infer<typeof addAnnouncementSchema>;

export { addAnnouncementSchema, type InferredAnnouncementFormSchema };
