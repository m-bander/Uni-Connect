export type Notification = {
  created_at: string;
  content: string;
  marked_as_read: boolean;
  source: "calendar_event" | "announcement";
  title: string;
  //   is_global: boolean;
};
