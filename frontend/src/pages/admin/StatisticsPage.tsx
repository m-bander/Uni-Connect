import { Book, BookCheck, BookOpen, User } from "lucide-react";

import { SingleStatCard } from "@/components/admin/statistics/SingleStatCard";
import { AverageCoursesCard } from "@/components/admin/statistics/AverageCoursesCard";
import { MostActiveChatCard } from "@/components/admin/statistics/MostActiveChatCard";
import { YearStudentsCard } from "@/components/admin/statistics/YearStudentsCard";
import { AssignmentCompletionCard } from "@/components/admin/statistics/AssignmentCompletionCard";
import { DailyUsersCard } from "@/components/admin/statistics/DailyUsersCard";
import { SessionDurationCard } from "@/components/admin/statistics/SessionDurationCard";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import { toast } from "sonner";
import { type GeneralStats } from "@/types/admin/stats";

export const StatisticsPage = () => {
  const { data: generalStats, isLoading } = useQuery<GeneralStats>({
    queryKey: ["general-stats"],
    queryFn: async () => {
      try {
        const res = await api.get("/api/stats/general");
        return res.data;
      } catch {
        toast.error("Error occurred while fetching general statistics.");
      }
    },
  });

  if (isLoading || !generalStats) return <>Crying...</>;

  const getCourseStatsSubtitle = (studentCount: number, courseName: string) => {
    return `${studentCount} student${studentCount > 1 ? "s" : ""} are in ${courseName}`;
  };

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <SingleStatCard
          icon={BookCheck}
          title="Course with the most students"
          value={`${generalStats.max_course.course_code}: ${generalStats.max_course.course_name}`}
          subtitle={getCourseStatsSubtitle(
            generalStats.max_course.course_student_count,
            generalStats.max_course.course_name
          )}
        />
        <SingleStatCard
          icon={Book}
          title="Course with the least students"
          value={`${generalStats.min_course.course_code}: ${generalStats.min_course.course_name}`}
          subtitle={getCourseStatsSubtitle(
            generalStats.min_course.course_student_count,
            generalStats.min_course.course_name
          )}
        />
        <SingleStatCard
          icon={BookOpen}
          title="Courses Count"
          value={generalStats.course_count}
          subtitle="In the UniConnect system."
        />
        <SingleStatCard
          icon={User}
          title="System User Count"
          value={generalStats.student_count}
          subtitle="Across all Courses"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 ">
        <YearStudentsCard />
        <AverageCoursesCard />
        <MostActiveChatCard />
        <AssignmentCompletionCard />
        <DailyUsersCard />
        <SessionDurationCard />
      </div>
    </div>
  );
};
