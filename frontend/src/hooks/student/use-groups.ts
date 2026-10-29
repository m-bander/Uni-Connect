import api from "@/lib/axios";
import type { Group } from "@/types/student/group";
import { useQuery } from "@tanstack/react-query";

const useGroups = () => {
  const { data: groups, isLoading: isLoadingGroups } = useQuery<
    Omit<Group, "messages">[]
  >({
    queryKey: ["groups"],
    queryFn: async () => {
      const result = await api.get("/api/groups");

      return result.data.data;
    },
  });

  return { groups, isLoadingGroups };
};

export default useGroups;
