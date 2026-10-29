import { pgEnum } from "drizzle-orm/pg-core";

export const EVENT_SOURCES = [
  "quiz",
  "exam",
  "poll",
  "project",
  "assignment",
  "lab_exam",
] as const;

export const eventSources = pgEnum("event_sources", EVENT_SOURCES);
