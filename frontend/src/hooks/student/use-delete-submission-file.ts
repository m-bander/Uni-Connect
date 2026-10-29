import api from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

type UseDeleteSubmissionFileArgs = {
  courseId: string;
  assignmentId: string;
  submissionId: string | undefined;
};

const useDeleteSubmissionFile = ({
  assignmentId,
  courseId,
  submissionId,
}: UseDeleteSubmissionFileArgs) => {
  const queryClient = useQueryClient();
  const { mutate: deleteSubmissionFile, isPending: isDeletingSubmissionFile } =
    useMutation({
      mutationFn: (fileId: string) => {
        return api.delete(
          `/api/courses/${courseId}/assignments/${assignmentId}/submissions/${submissionId}/files/${fileId}`
        );
      },
      onError: (error) => {
        toast.error(
          "An error occurred while deleting a submission file, please try again."
        );
        console.error(error);
      },
      onSuccess: () => {
        toast.success("Submission file deleted successfully");
        queryClient.invalidateQueries({
          queryKey: ["student-submission", assignmentId],
        });
      },
    });

  return {
    deleteSubmissionFile,
    isDeletingSubmissionFile,
  };
};

export default useDeleteSubmissionFile;
