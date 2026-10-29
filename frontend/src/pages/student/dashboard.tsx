// Hooks
import { useStudentAnnouncements } from "@/hooks/student/use-student-announcements";
import { useStudentCourses } from "@/hooks/student/use-student-courses";
import { useProfileData } from "@/hooks/use-profile-data";
import deadlineUtils from "@/utils/time/deadline-utils";

// Components
import DashboardAnnouncements from "@/components/student/dashboard/DashboardAnnouncements";
import DashboardCourses from "@/components/student/dashboard/DashboardCourses";
import DashboardDeadlines from "@/components/student/dashboard/DashboardDeadlines";
import DashboardStats from "@/components/student/dashboard/DashboardStats";
import useUpcomingEvents from "@/hooks/student/use-upcoming-events";

export default function Dashboard() {
  // TODO: Why not use useAuth instead?
  const { profileData, isLoading: isLoadingProfile } = useProfileData();
  const { courses, isLoading: isLoadingCourses } = useStudentCourses();
  const { announcements, isLoadingAnnouncements } = useStudentAnnouncements();
  const { isLoadingUpcomingEvents, upcomingEvents } = useUpcomingEvents();
  const { formatDeadlineDate } = deadlineUtils();

  const studentName = profileData?.first_name ?? "Student";

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          {isLoadingProfile ? "Welcome back!" : `Welcome back, ${studentName}!`}
        </h1>
        <p className="text-slate-500">
          Here's what's happening with your courses today.
        </p>
      </div>

      <DashboardStats
        dueAssignmentsCount={
          upcomingEvents.filter((event) => event.type === "assignment").length
        }
        isLoadingDueAssignments={isLoadingUpcomingEvents}
        upcomingEventsCount={upcomingEvents.length}
        activeCoursesCount={courses.length}
        isLoadingUpcomingEvents={isLoadingUpcomingEvents}
      />

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Courses Section */}
          <DashboardCourses courses={courses} isLoading={isLoadingCourses} />

          {/* Recent Announcements */}
          <DashboardAnnouncements
            announcements={announcements.slice(0, 5)}
            isLoading={isLoadingAnnouncements}
          />
        </div>

        {/* Right Section */}
        <div className="space-y-6">
          <DashboardDeadlines formatDeadlineDate={formatDeadlineDate} />
        </div>
      </div>
    </div>
  );
}
