import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import type { StudentUser } from "@/types/student/student-user";
import type { User } from "@/types/user/user";
import CourseMember from "./CourseMember";

type CourseMembersProps = {
  instructors: User[];
  students: StudentUser[];
};

const CourseMembersList = ({ instructors, students }: CourseMembersProps) => {
  return (
    <ScrollArea>
      <h3 className="font-bold text-xl mt-3 text-start">Instructors</h3>
      <Separator className="mt-1 mb-4" />
      {instructors.map((instructor) => (
        <CourseMember member={instructor} />
      ))}
      <h3 className="font-bold text-xl mt-6 text-start">Students</h3>
      <Separator className="mt-1 mb-4" />
      {students.map((student) => (
        <CourseMember member={student} />
      ))}
    </ScrollArea>
  );
};

export default CourseMembersList;
