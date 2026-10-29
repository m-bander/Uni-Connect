import JoinCourseSheet from "@/components/student/courses/JoinCourseSheet";
import CourseCard from "@/components/student/dashboard/CourseCard";
import { useStudentCourses } from "@/hooks/student/use-student-courses";

export default function MyStudentCourses() {
  const { courses, isLoading } = useStudentCourses();

  // TODO: Add loading skeleton

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-blue-600 mb-2">All Courses</h1>
          <p className="text-slate-500">Browse all your enrolled courses</p>
        </div>

        <JoinCourseSheet studentCourses={courses} />
      </div>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading courses...</p>
      ) : courses.length === 0 ? (
        // TODO: Place lottie file
        <p className="text-sm text-muted-foreground">No courses found</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <CourseCard key={course.code} course={course} />
          ))}
        </div>
      )}
    </div>
  );
}
