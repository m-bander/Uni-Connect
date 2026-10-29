import api from "@/lib/axios";
import type { Course } from "@/types/student/course";
import { useQuery } from "@tanstack/react-query";

export const useStudentCourses = () => {
  const { data: courses, isLoading } = useQuery<Course[]>({
    queryKey: ["student-courses"],
    queryFn: async () => {
      const result = await api.get("/api/users/courses");

      return result.data.data;
    },
    initialData: [],
  });

  return {
    courses,
    isLoading,
  };
};
