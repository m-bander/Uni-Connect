import type { CalendarEvent } from "@/types/student/calendar-event";

const deadlineUtils = () => {
  const formatDeadlineDate = (timestamp: number): string => {
    const date = new Date(timestamp);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const deadlineDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Tomorrow";
    if (diffDays <= 7) return `In ${diffDays} days`;

    return date.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric", });
  };

  // Return 5 soonest deadlines within 7 days
  const getUpcomingDeadlines = (calendarEvents: CalendarEvent[] | undefined): CalendarEvent[] => {
    if (!calendarEvents) return [];

    const now = Date.now();
    const sevenDaysFromNow = now + 7 * 24 * 60 * 60 * 1000;

    return calendarEvents.filter((event) => event.deadline_at >= now && event.deadline_at <= sevenDaysFromNow)
                         .sort((a, b) => a.deadline_at - b.deadline_at).slice(0, 5); // get top 5 deadlines
};

  return {
    getUpcomingDeadlines,
    formatDeadlineDate,
  };
};

export default deadlineUtils;

