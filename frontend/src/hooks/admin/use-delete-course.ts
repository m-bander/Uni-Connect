import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import { AxiosError } from "axios";
import { toast } from "sonner";

export const useDeleteCourse = (course_code: string) => {
  const queryClient = useQueryClient();

  const { mutateAsync: deleteCourse, isPending: isDeleting } = useMutation({
    mutationKey: ["delete-course", course_code],
    mutationFn: async (courseCode: string) => {
      return api.delete(`/api/admin/${courseCode}`);
    },
    onSuccess: () => {
      toast.success("Course has been deleted successfully.");

      queryClient.invalidateQueries({ queryKey: ["all-courses"] });
      queryClient.invalidateQueries({ queryKey: ["courses"] });
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.data && "message" in err.response.data) {
          toast.error(err.response.data.message);
          return;
        }
      }
      toast.error(
        "An error occurred while deleting this course. Please try again."
      );
    },
  });

  const handleDeleteCourse = async (courseCode: string) => {
    try {
      await deleteCourse(courseCode);
    } catch (err) {
      console.log(err);
    }
  };

  return {
    handleDeleteCourse,
    isDeleting,
  };
};
