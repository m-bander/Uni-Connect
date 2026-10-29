import { useQuery } from "@tanstack/react-query";
import type { User } from "@/types/user/user";
import api from "@/lib/axios";

// Update the response type to match backend structure
type CourseMembersResponse = {
  students: User[];
  instructors: User[];
};

export const useGetCourseUsers = (courseCode: string | undefined) => {
  
  const { data, isLoading } = useQuery<CourseMembersResponse>({
    queryKey: ["course-users", courseCode],
    queryFn: async () => {
      if (!courseCode) return { students: [], instructors: [] };
      
      const result = await api.get(`/api/admin/${courseCode}/members`);
      return result.data.data;
    },
    enabled: !!courseCode,
    initialData: { students: [], instructors: [] },
  });

  return {
    students: data?.students ?? [],
    instructors: data?.instructors ?? [],
    isLoading,
  };
};

