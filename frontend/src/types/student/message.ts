import type { Group } from "./group";
import type { StudentUser } from "./student-user";

export type Message = {
  content: string;
  id: string;
  created_at: string;
  sender: StudentUser;
};

export type MessageResponse = {
  data: {
    group: Omit<Group, "messages">;
    messages: Message[];
  };
  message: string;
};
