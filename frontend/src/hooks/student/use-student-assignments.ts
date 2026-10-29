import api from "@/lib/axios";
import type { Assignment } from "@/types/student/assignment";
import { useQuery } from "@tanstack/react-query";

export const useStudentAssignments = (courseCode: string | undefined) => {
  const { data: assignments, isLoading } = useQuery<Assignment[]>({
    queryKey: ["course-assignments", courseCode],
    queryFn: async () => {
      if (!courseCode) throw new Error("courseCode is undefined.");

      const result = await api.get(`/api/courses/${courseCode}/assignments`);
      return result.data.data;
    },
    initialData: [],
  });

  return {
    assignments,
    isLoading,
  };
};