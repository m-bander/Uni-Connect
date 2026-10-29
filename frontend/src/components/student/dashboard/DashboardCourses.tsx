import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import CourseCard from "./CourseCard";
import type { Course } from "@/types/student/course";

type DashboardCoursesProps = {
  courses: Course[];
  isLoading: boolean;
};

export default function DashboardCourses({
  courses,
  isLoading,
}: DashboardCoursesProps) {
  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-foreground">My Courses</h2>
        <Link to="/student/courses">
          <Button variant="ghost" size="sm" className="cursor-pointer">
            View All
          </Button>
        </Link>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {isLoading ? (
          <p className="text-sm text-slate-500">Loading courses...</p>
        ) : courses.length === 0 ? (
          <div className="rounded-xl border p-6 space-y-3 md:col-span-2"><h3 className="font-semibold">Start with your first course</h3><p className="text-sm text-muted-foreground">Browse subjects and join a course to see its resources, assignments, deadlines, and discussion group here.</p><Button asChild><Link to="/catalog">Browse courses</Link></Button></div>
        ) : (
          courses
            .slice(0, 2)
            .map((course) => (
              <CourseCard key={course.code + course.year} course={course} />
            ))
        )}
      </div>
    </section>
  );
}
