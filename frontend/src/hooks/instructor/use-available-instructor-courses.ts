import useAllCourses from "@/hooks/shared/use-all-courses";
import api from "@/lib/axios";
import { useAuth } from "@/providers/context/authContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const useAvailableInstructorCourses = () => {
  const { allCourses } = useAllCourses();
  const { auth } = useAuth();
  const queryClient = useQueryClient();

  const currentUserId = auth.user?.id;

  const availableCourses = allCourses.filter(
    (course) => !course.teachers.some((teacher) => teacher.id === currentUserId)
  );

  const {
    mutate: assignInstructorToCourse,
    isPending: isAssigningInstructorToCourse,
  } = useMutation({
    mutationFn: (courseId: string) => {
      return api.post(`/api/courses/${courseId}/instructors/me`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-courses"] });
      queryClient.invalidateQueries({ queryKey: ["instructor-courses"] });
      toast.success("You've been successfully assigned to the course.");
    },
    onError: (error) => {
      console.error(error);
      toast.error(
        "An error occurred while assigning you to the course, please try again later."
      );
    },
  });

  return {
    availableCourses,
    assignInstructorToCourse,
    isAssigningInstructorToCourse,
  };
};

export default useAvailableInstructorCourses;
