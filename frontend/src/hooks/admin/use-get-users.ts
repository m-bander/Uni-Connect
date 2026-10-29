import { useQuery } from "@tanstack/react-query";
import type { User } from "@/types/user/user";
import type { serverRolesType } from "@/types/api/auth";
import api from "@/lib/axios";

interface GetUsersParams {
  page: number;
  perPage: number;
  search?: string;
  roleFilter?: serverRolesType | "all" | null;
  yearFilter?: string | null;
  pendingOnly?: boolean;
}

interface GetUsersResponse {
  users: User[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}

export const useGetUsers = (params: GetUsersParams) => {
  const { data, isLoading: isLoadingUsers } = useQuery<GetUsersResponse>({
    queryKey: ["get-users", params],
    queryFn: async () => {
      const result = await api.get("/api/users", {
        params: {
          page: params.page,
          per_page: params.perPage,
          search: params.search,
          role: params.roleFilter && params.roleFilter !== "all" ? params.roleFilter : undefined,
          year: params.yearFilter && params.yearFilter !== "all" ? params.yearFilter : undefined,
          pending_only: params.pendingOnly ? "true" : undefined,
        },
      });
      return result.data.data;
    },
  });

  return {
    users: data?.users || [],
    total: data?.total || 0,
    page: data?.page || 1,
    perPage: data?.perPage || 6,
    totalPages: data?.totalPages || 0,
    isLoadingUsers,
  };
};