import api from "@/lib/axios";
import type { QueryMeta } from "@/types/api/query";
import type { QueryingOptions } from "@/types/general/table";
import type { Course } from "@/types/student/course";
import appendQueryOptions from "@/utils/query/append-query-options";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

const useAllCourses = (queryOptions?: QueryingOptions) => {
  const { data, isLoading: isLoadingAllCourses } = useQuery<{
    data: Course[];
    meta: QueryMeta;
  }>({
    queryKey: ["all-courses", queryOptions],
    queryFn: async () => {
      try {
        const query = "/api/courses";
        const result = await api.get(appendQueryOptions(query, queryOptions));
        return result.data;
      } catch (error) {
        console.error(error);
        toast.error("An error occurred while fetching courses.");
      }
    },
    initialData: {
      data: [],
      meta: {
        pageIndex: 0,
        pageSize: 10,
        total: 10,
        totalPages: 1,
      },
    },
  });

  return {
    allCourses: data.data,
    meta: data.meta,
    isLoadingAllCourses,
  };
};

export default useAllCourses;