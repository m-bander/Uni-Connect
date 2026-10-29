import z from "zod";

const createSortBySchema = <T extends readonly [string, ...string[]]>(
  sortableColumns: T
) => {
  return z
    .string()
    .transform((val) => val.split(",").map((v) => v.trim()))
    .pipe(z.array(z.enum(sortableColumns)));
};

export default createSortBySchema;
