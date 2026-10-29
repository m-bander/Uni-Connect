import { BookOpen, Calendar, Clock } from "lucide-react";
import StatCard from "./StatCard";

type DashboardStatsProps = {
  activeCoursesCount: number;
  upcomingEventsCount: number;
  isLoadingUpcomingEvents: boolean;
  dueAssignmentsCount: number;
  isLoadingDueAssignments: boolean;
};

export default function DashboardStats({
  activeCoursesCount,
  upcomingEventsCount,
  isLoadingUpcomingEvents,
  dueAssignmentsCount,
  isLoadingDueAssignments,
}: DashboardStatsProps) {
  return (
    <div className="grid md:grid-cols-3 gap-6 mb-8">
      <StatCard
        icon={BookOpen}
        label="Active Courses"
        value={activeCoursesCount}
        color="from-blue-600 to-blue-600"
        isLoading={false}
      />
      <StatCard
        icon={Calendar}
        label="Upcoming Events"
        value={upcomingEventsCount}
        color="from-yellow-400 to-yellow-400"
        isLoading={isLoadingUpcomingEvents}
      />
      <StatCard
        icon={Clock}
        label="Due assignments"
        value={dueAssignmentsCount}
        color="from-red-600 to-red-600"
        isLoading={isLoadingDueAssignments}
      />
    </div>
  );
}
