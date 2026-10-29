import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import { AxiosError } from "axios";
import { toast } from "sonner";

export const useRemoveCourseUser = (courseCode?: string) => {
  const queryClient = useQueryClient();

  const { mutateAsync: removeCourseUser, isPending: isRemoving } = useMutation({
    mutationKey: ["remove-course-user", courseCode],
    mutationFn: async (userId: string) => {
      if (!courseCode) throw new Error("Course Code is required to remove a user.");
      return api.delete(`/api/admin/${courseCode}/users/${userId}`);
    },
    onSuccess: () => {
      toast.success("User has been removed from the course successfully.");
      
      // Invalidate the courses list to refresh students_number
      queryClient.invalidateQueries({ queryKey: ["all-courses"] });
      // Invalidate the course users list
      queryClient.invalidateQueries({ queryKey: ["course-users", courseCode] });
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.data && "message" in err.response.data) {
          toast.error(err.response.data.message);
          return;
        }
      }
      toast.error("An error occurred while removing this user from the course. Please try again.");
    },
  });

  const handleRemoveCourseUser = async (userId: string) => {
    try {
      await removeCourseUser(userId);
    } catch (err) {
      console.log(err);
    }
  };

  return {
    handleRemoveCourseUser,
    isRemoving,
  };
};