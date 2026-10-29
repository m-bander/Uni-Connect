import type { File } from "@/types/student/file";
import type { User } from "../user/user";

type Submission = {
  id: string;
  assignment_id: string;
  submitted_at: string;
  grade?: number;
  attached_files: File[];
  submitter: User;
  is_turned_in: boolean;
  turned_in_at?: string;
  feedback?: string;
};

export { type Submission };
