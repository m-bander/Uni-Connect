import type { File } from "@/types/student/file";
import type { User } from "../user/user";

type Material = {
  id: number;
  title: string;
  category: MaterialCategory;
  uploaded_at: number;
  course_code: string;
  uploader: User;
  file: File;
};

type MaterialCategory =
  | "lecture"
  | "sheet"
  | "quiz"
  | "assignment"
  | "tutorial"
  | "textbook";

export { type Material, type MaterialCategory };
