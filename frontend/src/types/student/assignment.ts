import type { File } from "@/types/student/file";
import type { User } from "../user/user";

type Assignment = {
  id: string;
  title: string;
  description?: string;
  course_id: string;
  created_at: string;
  deadline_at: string;
  attached_files?: File[];
  max_grade?: number | null;
  assigner?: User;
};

export { type Assignment };
