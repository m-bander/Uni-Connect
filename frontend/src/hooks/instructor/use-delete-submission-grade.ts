import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import { AxiosError } from "axios";
import { toast } from "sonner";

export const useDeleteSubmissionGrade = (assignmentId?: string) => {
  const queryClient = useQueryClient();

  const { mutateAsync: deleteGrade, isPending: isDeleting } = useMutation({
    mutationKey: ["delete-submission-grade"],
    mutationFn: async (submissionId: string) => {
      return api.delete(`/api/submissions/${submissionId}/grade`);
    },
    onSuccess: () => {
      toast.success("Grade has been removed successfully.");
      
      if (assignmentId) {
        queryClient.invalidateQueries({ queryKey: ["student-submissions", assignmentId] });
      }
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.data && "message" in err.response.data) {
          toast.error(err.response.data.message);
          return;
        }
      }
      toast.error("An error occurred while removing the grade. Please try again.");
    },
  });

  const handleDeleteSubmissionGrade = async (submissionId: string) => {
    try {
      await deleteGrade(submissionId);
    } catch (err) {
      console.log(err);
    }
  };

  return {
    handleDeleteSubmissionGrade,
    isDeleting,
  };
};

export default useDeleteSubmissionGrade;