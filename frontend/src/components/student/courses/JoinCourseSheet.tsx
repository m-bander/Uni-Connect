import CoursesSheet from "@/components/common/course/CoursesSheet";
import { Button } from "@/components/ui/button";
import useJoinCourseSheet from "@/hooks/student/use-join-course-sheet";
import type { Course } from "@/types/student/course";

type JoinCourseSheetProps = {
  studentCourses: Course[];
};

const JoinCourseSheet = ({ studentCourses }: JoinCourseSheetProps) => {
  const { nonJoinedCourses, enroll, isEnrolling } =
    useJoinCourseSheet(studentCourses);

  return (
    <CoursesSheet
      courses={nonJoinedCourses}
      sheetDescription="Enroll in a course to view its material, join its discussion group, and more."
      triggerText="Join Course"
      createCourseActionElement={(courseId) => (
        <Button onClick={() => enroll(courseId)} disabled={isEnrolling}>
          Enroll
        </Button>
      )}
    />
  );
};

export default JoinCourseSheet;
