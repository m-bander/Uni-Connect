import api from "@/lib/axios";
import type { Announcement } from "@/types/student/announcement";
import { useQuery } from "@tanstack/react-query";

export const useStudentAnnouncements = () => {
  const { data: announcements, isLoading: isLoadingAnnouncements } = useQuery<
    Announcement[]
  >({
    queryKey: ["student-announcements"],
    queryFn: async () => {
      const result = await api.get(`/api/announcements`);
      return result.data.data;
    },
    initialData: [],
  });

  return {
    announcements,
    isLoadingAnnouncements,
  };
};
