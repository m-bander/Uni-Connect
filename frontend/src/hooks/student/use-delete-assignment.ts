import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import { AxiosError } from "axios";
import { toast } from "sonner";

export const useDeleteAssignment = (courseId: string, assignmentId: string) => {
  const queryClient = useQueryClient();

  const { mutateAsync: deleteAssignment, isPending: isDeleting } = useMutation({
    mutationKey: ["delete-assignment"],
    mutationFn: async () => {
      return api.delete(`/api/courses/${courseId}/assignments/${assignmentId}`);
    },
    onSuccess: () => {
      toast.success("Assignment has been deleted successfully.");

      queryClient.invalidateQueries({
        queryKey: ["course-assignments", courseId],
      });
    },
    onError: (err) => {
      console.error(err);
      if (err instanceof AxiosError) {
        if (err.response?.data && "message" in err.response.data) {
          toast.error(err.response.data.message);
          return;
        }
      }
      toast.error(
        "An error occurred while deleting this assignment. Please try again."
      );
    },
  });

  return {
    deleteAssignment,
    isDeleting,
  };
};
