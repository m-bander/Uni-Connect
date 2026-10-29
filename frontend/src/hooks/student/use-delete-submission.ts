import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import { AxiosError } from "axios";
import { toast } from "sonner";

type UseDeleteSubmissionArgs = {
  submissionId: string | undefined;
  courseId: string | undefined;
  assignmentId: string | undefined;
};

export const useDeleteSubmission = ({
  assignmentId,
  courseId,
  submissionId,
}: UseDeleteSubmissionArgs) => {
  const queryClient = useQueryClient();

  const { mutateAsync: deleteSubmission, isPending: isDeleting } = useMutation({
    mutationKey: ["delete-submission", submissionId],
    mutationFn: (submissionId: string) => {
      return api.delete(
        `/api/courses/${courseId}/assignments/${assignmentId}/submissions/${submissionId}`
      );
    },
    onSuccess: () => {
      toast.success("Submission has been deleted successfully.");
      queryClient.invalidateQueries({
        queryKey: ["student-submission", assignmentId],
      });
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.data && "message" in err.response.data) {
          toast.error(err.response.data.message);
          return;
        }
      }
      toast.error(
        "An error occurred while deleting this submission. Please try again."
      );
    },
  });

  const handleDeleteSubmission = async (submissionId: string) => {
    try {
      await deleteSubmission(submissionId);
    } catch (err) {
      console.log(err);
    }
  };

  return {
    handleDeleteSubmission,
    isDeleting,
  };
};
