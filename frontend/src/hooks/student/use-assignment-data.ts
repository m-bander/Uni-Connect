import api from "@/lib/axios";
import type { Assignment } from "@/types/student/assignment";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

export const useAssignmentData = (
  assignmentId: string | undefined,
  courseId: string | undefined
) => {
  const { data: assignment, isLoading } = useQuery<Assignment>({
    queryKey: ["student-assignments", assignmentId],
    queryFn: async () => {
      try {
        const result = await api.get(
          `/api/courses/${courseId}/assignments/${assignmentId}`
        );
        return result.data.data;
      } catch (error) {
        console.error(error);
        toast.error(
          "An error occurred while fetching the assignment, please try again."
        );
      }
    },

    enabled: !!assignmentId && !!courseId,
  });

  return {
    assignment,
    isLoading,
  };
};
