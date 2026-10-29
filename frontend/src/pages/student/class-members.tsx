import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useClassMembers } from "@/hooks/student/use-class-members";

import Member from "@/components/common/course/members/CourseMember";
import Heading from "@/components/global/Heading";
import SubtleParagraph from "@/components/global/SubtleParagraph";
import { ClassMembersModal } from "@/components/student/members/class-members-modal";
import type { StudentUser } from "@/types/student/student-user";
import { useState } from "react";
import { useHasRole } from "@/hooks/use-has-role";

export const ClassMembers = () => {
  const { classMembers, isLoading } = useClassMembers();
  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<StudentUser | undefined>();

  const handleModalOpen = (user: StudentUser) => {
    setOpen(true);
    setSelectedUser(user);
  };

  const { hasRole } = useHasRole();

  const isClassRep = hasRole("class_representative");

  return (
    <div className="w-full h-full">
      <Heading>Class Members</Heading>
      <SubtleParagraph className="mb-8">
        {isClassRep
          ? "The following is a list of your class mates, you can assign them as heads to different courses"
          : "The following is a list of your class mates."}
      </SubtleParagraph>
      {isLoading || !classMembers ? (
        <div className="w-full h-full flex items-center justify-center">
          <Spinner className="size-8" />
        </div>
      ) : (
        classMembers.map((classMember) => (
          <Member
            key={classMember.code}
            member={classMember}
            extraActions={
              isClassRep ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleModalOpen(classMember)}
                >
                  Assign Course Head
                </Button>
              ) : undefined
            }
          ></Member>
        ))
      )}
      <ClassMembersModal open={open} setOpen={setOpen} user={selectedUser} />
    </div>
  );
};
