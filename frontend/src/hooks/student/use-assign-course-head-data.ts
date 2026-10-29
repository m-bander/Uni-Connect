import api from "@/lib/axios";
import { type Course } from "@/types/student/course";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

export const useAssignCourseHeadData = (id: string | undefined) => {
  const { data: managedCourses, isLoading: isManagedLoading } = useQuery<
    Course[]
  >({
    queryKey: ["get-head-managed-courses", id],
    enabled: id !== undefined,
    queryFn: async () => {
      if (!id) throw Error("User id not avaliable");
      try {
        const res = await api.get(
          `/api/courses/course-head/managed-courses/${id}`
        );
        return res.data;
      } catch (err) {
        if (err instanceof AxiosError) {
          if (err.response?.data && "message" in err.response.data) {
            const message = err.response.data.message;
            throw new Error(message);
          }
        }

        throw new Error("Unexpected server error");
      }
    },
  });

  const { data: manageableCourses, isLoading: isManageableLoading } = useQuery<
    Course[]
  >({
    queryKey: ["get-head-manageable-courses", id],
    enabled: id !== undefined,
    queryFn: async () => {
      if (!id) throw Error("User id not avaliable");
      try {
        const res = await api.get(
          `/api/courses/course-head/manageable-courses/${id}`
        );
        return res.data;
      } catch (err) {
        if (err instanceof AxiosError) {
          if (err.response?.data && "message" in err.response.data) {
            const message = err.response.data.message;
            throw new Error(message);
          }
        }
        throw new Error("Unexpected server error");
      }
    },
  });

  return {
    managedCourses,
    manageableCourses,
    isLoading: isManageableLoading || isManagedLoading,
  };
};
