import api from "@/lib/axios";
import type { CalendarEvent } from "@/types/student/calendar-event";
import { useQuery } from "@tanstack/react-query";

const useDashboardDeadlines = () => {
  const { data: dashboardDeadlines, isLoading: isLoadingDashboardDeadlines } =
    useQuery<CalendarEvent[]>({
      queryKey: ["dashboard-deadlines"],
      queryFn: async () => {
        // Logically, deadline is a project or an assignment
        const result = await api.get(
          "/api/events?eventsTypes=project,assignment&future=true"
        );
        return result.data.data;
      },
      initialData: [],
    });

  return {
    dashboardDeadlines,
    isLoadingDashboardDeadlines,
  };
};

export default useDashboardDeadlines;
