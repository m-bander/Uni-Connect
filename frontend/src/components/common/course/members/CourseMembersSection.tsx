import { Card } from "@/components/ui/card";
import { Users } from "lucide-react";
import CourseMembersList from "./CourseMembersList";
import useCourseMembers from "@/hooks/shared/use-course-members";
import { useParams } from "react-router";
import handlePlural from "@/utils/text/handle-plural";

const CourseMembersSection = () => {
  // TODO: Put a loading skeleton
  const { id } = useParams();
  const { courseMembers } = useCourseMembers(id);

  return (
    <Card className="p-8 text-center gap-0">
      <Users className="w-12 h-12 text-gray-500 mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-gray-800 mb-2">
        Course Members
      </h3>
      <p className="text-gray-500">
        {handlePlural(courseMembers.students.length, "student", "students")} and{" "}
        {handlePlural(
          courseMembers.instructors.length,
          "instructor",
          "instructors"
        )}
      </p>

      <CourseMembersList
        students={courseMembers.students}
        instructors={courseMembers.instructors}
      />
    </Card>
  );
};

export default CourseMembersSection;
