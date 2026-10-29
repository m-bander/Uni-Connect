import z from "zod";

// Pagination Sorting Filtering Schema
// TODO: Find a better name
// TODO: Replace psfSchema in the project with the createPsfSchema
export const psfSchema = z.object({
  sortOrder: z.enum(["asc", "desc"]).default("asc").optional(),
  sortBy: z.literal("students_count").optional(),
  pageIndex: z.coerce.number().int().nonnegative().optional(),
  pageSize: z.coerce.number().int().positive().optional(),
});

export const createPsfSchema = <T extends z.ZodTypeAny>({
  sortBySchema,
}: {
  sortBySchema: T;
}) => {
  return z.object({
    sortOrder: z
      .string()
      .transform((val) => val.split(",").map((v) => v.trim()))
      .pipe(z.array(z.enum(["asc", "desc"])))
      .optional(),
    sortBy: sortBySchema.optional(),
    pageIndex: z.coerce.number().int().nonnegative().optional(),
    pageSize: z.coerce.number().int().positive().optional(),
  });
};
