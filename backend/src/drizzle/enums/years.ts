import { pgEnum } from "drizzle-orm/pg-core";

export const STUDENT_YEARS = ["1", "2", "3", "4", "5"] as const;
export const years = pgEnum("years", STUDENT_YEARS);
