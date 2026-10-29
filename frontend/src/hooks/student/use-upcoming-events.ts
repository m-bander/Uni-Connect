import api from "@/lib/axios";
import type { CalendarEvent } from "@/types/student/calendar-event";
import { useQuery } from "@tanstack/react-query";

const useUpcomingEvents = () => {
  const { isLoading: isLoadingUpcomingEvents, data: upcomingEvents } = useQuery<
    CalendarEvent[]
  >({
    queryKey: ["events-upcoming"],
    queryFn: async () => {
      const result = await api.get("/api/events?future=true");
      return result.data.data;
    },
    initialData: [],
  });

  return { isLoadingUpcomingEvents, upcomingEvents };
};

export default useUpcomingEvents;
