import api from "@/lib/axios";
import type { CalendarEvent } from "@/types/student/calendar-event";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

export const useStudentCalendar = () => {
  const [date, setDate] = useState<Date>(new Date());

  const { data: calendarEvents, isLoading } = useQuery<CalendarEvent[]>({
    queryKey: ["calendar-events"],
    queryFn: async () => {
      const result = await api.get("/api/me/events");
      const events = result.data.data;
      return events;
    },
    initialData: [],
  });

  return {
    date,
    setDate,
    calendarEvents,
    isLoading,
  };
};
