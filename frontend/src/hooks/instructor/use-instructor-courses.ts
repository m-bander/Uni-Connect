import api from "@/lib/axios";
import type { Course } from "@/types/student/course";
import { useQuery } from "@tanstack/react-query";

export const useInstructorCourses = () => {
  const { data: courses, isLoading } = useQuery<Course[]>({
    queryKey: ["instructor-courses"],
    queryFn: async () => {
      const res = await api.get("/api/me/courses/teaching");
      return res.data.data;
    },
    initialData: [],
  });

  return {
    courses,
    isLoading,
  };
};
