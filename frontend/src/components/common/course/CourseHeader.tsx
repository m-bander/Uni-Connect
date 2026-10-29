import { UpdateCourseModal } from "@/components/instructor/UpdateCourseModal";
import Teachers from "@/components/student/dashboard/Teachers";
import { Badge } from "@/components/ui/badge";
import type { Course } from "@/types/student/course";
import { Users } from "lucide-react";

type CourseHeaderProps = {
  course: Course;
  showModifyCourseBtn: boolean;
};

export default function CourseHeader({
  course,
  showModifyCourseBtn,
}: CourseHeaderProps) {
  return (
    <div className="mb-8">
      <div className="container mx-auto h-16 flex items-center justify-between">
        <Badge variant="outline">{course.code}</Badge>
        <div className="flex items-center gap-3">
          {showModifyCourseBtn && <UpdateCourseModal courseData={course} />}
        </div>
      </div>
      <h1 className="text-4xl font-bold text-slate-800 mb-3">{course.name}</h1>
      <div className="flex items-center gap-6 text-slate-500 flex-wrap">
        {/* flex-wrap extra */}
        <Teachers teachers={course.teachers} showAll />
        <span>•</span>
        <span className="flex items-center gap-1">
          <Users className="w-4 h-4" />
          {course.students_number}
        </span>
      </div>
    </div>
  );
}
