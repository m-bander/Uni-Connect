import api from "@/lib/axios";
import { useAuth } from "@/providers/context/authContext";
import type { Course } from "@/types/student/course";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

const useCurrentUserCourses = () => {
  const { auth } = useAuth();

  const { data: currentUserCourses, isLoading: isLoadingCurrentUserCourses } =
    useQuery<Course[]>({
      queryKey: ["current-user-courses"],
      queryFn: async () => {
        try {
          if (!auth.user) throw new Error("Auth user is undefined");

          let query;
          if (auth.user.role === "professor/ta") {
            query = `/api/me/courses/teaching`;
          } else if (
            ["class_representative", "course_head", "student"].includes(
              auth.user?.role
            )
          ) {
            query = `/api/me/courses/enrolled`;
          } else {
            throw new Error(
              `Role unhandled, or there's no logical meaning for getting courses related to user with role: ${auth.user.role}`
            );
          }

          const result = await api.get(query);
          return result.data.data;
        } catch (error) {
          console.error(error);
          toast.error(
            "An error occurred while fetching your courses, please try again."
          );
        }
      },
      enabled: !!auth.user,
      initialData: [],
    });

  return {
    currentUserCourses,
    isLoadingCurrentUserCourses,
  };
};

export default useCurrentUserCourses;
