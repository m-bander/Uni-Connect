import type { YEARS } from "@/constants/student/student";
import type { User } from "../user/user";

export type PollItem = {
  id: string;
  content: string;
  votersIds: string[];
};

type PrimitiveAnnouncement = {
  id: string;
  created_at: string;
  announcer: User;
};

type PollAnnouncement = PrimitiveAnnouncement & {
  title: string;
  content?: string;
  type: "poll";
  pollItems: PollItem[];
};

type RegularAnnouncement = PrimitiveAnnouncement & {
  type: "announcement";
  title?: string;
  content: string;
};

type CourseAnnouncement = (PollAnnouncement | RegularAnnouncement) & {
  course_id: string;
};

type ClassAnnouncement = (PollAnnouncement | RegularAnnouncement) & {
  class: (typeof YEARS)[number];
};

type Announcement = CourseAnnouncement | ClassAnnouncement;

type AnnouncementType = "announcement" | "poll";

export { type Announcement, type AnnouncementType };
