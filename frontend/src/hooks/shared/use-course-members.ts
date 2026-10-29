import api from "@/lib/axios";
import type { QueryMeta } from "@/types/api/query";
import type { QueryingOptions } from "@/types/general/table";
import type { StudentUser } from "@/types/student/student-user";
import type { User } from "@/types/user/user";
import appendQueryOptions from "@/utils/query/append-query-options";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

const useCourseMembers = (
  courseCode: string | undefined,
  queryOptions?: QueryingOptions
) => {
  const { data, isLoading: isLoadingCourseMembers } = useQuery<{
    data: {
      students: (StudentUser & {
        total_messages: number;
        polls_voted: number;
        average_grade: number;
        assignments_submitted: number;
      })[];
      instructors: User[];
    };
    meta: QueryMeta;
  }>({
    queryKey: ["course-members", courseCode, queryOptions],
    queryFn: async () => {
      try {
        if (!courseCode) {
          throw new Error("courseCode is undefined.");
        }

        const query = `/api/courses/${courseCode}/members`;
        const result = await api.get(appendQueryOptions(query, queryOptions));
        return result.data;
      } catch (error) {
        console.error(error);
        toast.error("An error occurred while loading course members.");
      }
    },
    initialData: {
      data: {
        instructors: [],
        students: [],
      },
      meta: {
        pageIndex: 0,
        pageSize: 10,
        total: 0,
        totalPages: 1,
      },
    },
  });

  return {
    courseMembers: data.data,
    isLoadingCourseMembers,
    meta: data.meta,
  };
};

export default useCourseMembers;
