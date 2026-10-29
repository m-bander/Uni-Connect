import api from "@/lib/axios";
import type { Course } from "@/types/student/course";
import { useQuery } from "@tanstack/react-query";

interface UseGetAllCoursesParams {
  page?: number;
  perPage?: number;
  search?: string;
}

type GetAllCoursesRawResponse =
  | Course[]
  | {
      courses: Course[];
      total: number;
      page: number;
      perPage: number;
      totalPages: number;
    };

const useGetAllCourses = (params?: UseGetAllCoursesParams) => {
  const { data, isLoading } = useQuery<GetAllCoursesRawResponse>({
    queryKey: ["all-courses", params],
    queryFn: async () => {
      const result = await api.get("/api/admin/", {
        params: {
          page: params?.page,
          per_page: params?.perPage,
          search: params?.search,
        },
      });
      console.log(result.data.data)
      return result.data.data as GetAllCoursesRawResponse;
    },
  });

  let courses: Course[] = [];
  let total = 0;
  let page = params?.page ?? 1;
  let perPage = params?.perPage ?? 10;
  let totalPages = 1;

  if (Array.isArray(data)) {
    courses = data;
    total = data.length;
    totalPages = 1;
  } else if (data) {
    courses = data.courses;
    total = data.total;
    page = data.page;
    perPage = data.perPage;
    totalPages = data.totalPages;
  }

  return {
    courses,
    total,
    page,
    perPage,
    totalPages,
    isLoading,
    // used by other hooks
    allCourses: courses,
    isLoadingAllCourses: isLoading,
  };
};

export default useGetAllCourses;

