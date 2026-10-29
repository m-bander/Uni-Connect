import api from "@/lib/axios";
import { useAuth } from "@/providers/context/authContext";
import type { Submission } from "@/types/student/submission";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

export const useSubmissionData = (
  assignmentId: string | undefined,
  courseId: string | undefined
) => {
  const { auth, loading: isLoadingAuth } = useAuth();

  const { data: submission, isLoading } = useQuery<Submission | undefined>({
    queryKey: ["student-submission", assignmentId],
    queryFn: async () => {
      try {
        if (!auth.user?.id) throw new Error("Auth user is undefined");

        const result = await api.get(
          `/api/courses/${courseId}/assignments/${assignmentId}/submissions?userId=${auth.user.id}`
        );

        return result.data.data ?? null;
      } catch (error) {
        console.error(error);
        toast.error("An error occurred while loading your submission.");
      }
    },
    enabled: !!assignmentId && !isLoadingAuth && !!auth.user,
  });

  return {
    submission,
    isLoading,
  };
};
