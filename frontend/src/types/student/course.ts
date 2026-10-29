import type { YEARS } from "@/constants/student/student";
import type { User } from "../user/user";
import type { StudentUser } from "./student-user";

type Course = {
  code: string;
  name: string;
  department?: string;
  description?: string;
  image_url: string;
  year: (typeof YEARS)[number];
  teachers: User[];
  // class: string; // semester/year --> e.g "Fall 2024"

  students_number: number;
  representatives_ids: string[];
  representatives: StudentUser[];
};

export { type Course };
