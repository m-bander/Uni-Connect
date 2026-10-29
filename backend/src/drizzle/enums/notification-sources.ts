import { pgEnum } from "drizzle-orm/pg-core";

const NOTIFICATION_SOURCES = ["calendar_event", "announcement"] as const;
export const notificaionSources = pgEnum(
  "notification_sources",
  NOTIFICATION_SOURCES
);
