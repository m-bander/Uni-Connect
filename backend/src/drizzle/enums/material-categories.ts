import { pgEnum } from "drizzle-orm/pg-core";

const MATERIAL_CATEGORIES = [
  "lecture",
  "sheet",
  "quiz",
  "assignment",
  "tutorial",
  "textbook",
] as const;

export const materialCategories = pgEnum(
  "material_categories",
  MATERIAL_CATEGORIES
);
