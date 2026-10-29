import api from "@/lib/axios";
import type { QueryingOptions } from "@/types/general/table";
import type { Submission } from "@/types/student/submission";
import appendQueryOptions from "@/utils/query/append-query-options";
import { useQuery, type QueryMeta } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAuth } from "@/providers/context/authContext";

type UseStudentSubmissionsArgs = {
  assignmentId: string | undefined;
  courseId: string | undefined;
} & QueryingOptions;

export const useStudentSubmissions = ({
  assignmentId,
  courseId,
  pageIndex,
  pageSize,
  sortingOptions,
  filteringOptions,
}: UseStudentSubmissionsArgs) => {
  const {auth}=useAuth();
  const { data: submissionsAndMetadata, isLoading } = useQuery<{
    data: Submission[];
    meta: QueryMeta;
  }>({
    enabled:!!assignmentId&&!!courseId&&["professor/ta","system_admin"].includes(auth.user?.role||""),
    queryKey: [
      "submissions",
      assignmentId,
      pageIndex,
      pageSize,
      sortingOptions,
      filteringOptions,
    ],
    queryFn: async () => {
      try {
        if (!assignmentId) throw new Error("assignmentId is undefined");
        if (!courseId) throw new Error("courseId is undefined");

        const query = `/api/courses/${courseId}/assignments/${assignmentId}/submissions?turned_in=true`;

        const result = await api.get(
          appendQueryOptions(query, {
            pageIndex,
            pageSize,
            sortingOptions,
            filteringOptions,
          })
        );
        return result.data;
      } catch (error) {
        console.error(error);
        toast.error(
          "An error occurred while loading the assignment submission, please try again."
        );
      }
    },
    initialData: {
      data: [],
      meta: {
        pageIndex: 0,
        pageSize: 0,
        total: 0,
        totalPages: 0,
      },
    },
  });

  return {
    submissionsAndMetadata,
    isLoading,
  };
};
