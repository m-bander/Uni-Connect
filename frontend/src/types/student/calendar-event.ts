type CalendarEvent = {
  id: string;
  deadline_at: number; // Time since epoch in ms
  notes: string; // HTML stored as text in the DB and will be parsed on the frontend, it's done like this to allow links along with text
  title: string;
  type: CalendarEventType;
  course_id?: string;
};

type CalendarEventType =
  | "quiz"
  | "exam"
  | "poll"
  | "project"
  | "assignment"
  | "lab_exam";

export { type CalendarEvent, type CalendarEventType };
