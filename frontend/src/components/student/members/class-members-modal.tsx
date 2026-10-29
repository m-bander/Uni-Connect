import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { useAssignCourseActions } from "@/hooks/student/use-assign-course-actions";
import { useAssignCourseHeadData } from "@/hooks/student/use-assign-course-head-data";
import type { StudentUser } from "@/types/student/student-user";
import { DialogClose } from "@radix-ui/react-dialog";
import { CirclePlus, Trash2 } from "lucide-react";
import { type Dispatch, type SetStateAction } from "react";

type ClassMembersModalProps = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  user: StudentUser | undefined;
};

export const ClassMembersModal = ({
  open,
  setOpen,
  user,
}: ClassMembersModalProps) => {
  const { manageableCourses, managedCourses, isLoading } =
    useAssignCourseHeadData(user?.id);
  const {
    chosenCourse,
    setChosenCourse,
    handleAssignCourseHead,
    handleRemoveCourseHead,
    isAdding,
  } = useAssignCourseActions(manageableCourses, user);

  const handleModalOpenChange = (open: boolean) => {
    setOpen(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleModalOpenChange}>
      {user && (
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              Assign courses to {user.first_name} {user.parent_name}
            </DialogTitle>
            <DialogDescription>
              Review the courses this member currently leads and assign
              additional courses as needed.
            </DialogDescription>
          </DialogHeader>

          {isLoading || !managedCourses || !manageableCourses ? (
            <div className="w-full h-full flex items-center justify-center">
              <Spinner className="size-8" />
            </div>
          ) : (
            <>
              <div>
                {managedCourses &&
                  managedCourses.map((managedCourse) => (
                    <Item
                      key={managedCourse.code}
                      variant="muted"
                      className="my-3"
                    >
                      <ItemContent>
                        <ItemTitle>{managedCourse.code}</ItemTitle>
                        <ItemDescription>{managedCourse.name}</ItemDescription>
                      </ItemContent>
                      <ItemActions>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            handleRemoveCourseHead(managedCourse.code)
                          }
                        >
                          <Trash2 />
                        </Button>
                      </ItemActions>
                    </Item>
                  ))}
              </div>
              <div className="flex items-center justify-between">
                {manageableCourses.length > 0 ? (
                  <>
                    <Select
                      value={chosenCourse}
                      onValueChange={(value) => setChosenCourse(value)}
                    >
                      <SelectTrigger className="w-17/20">
                        <SelectValue placeholder="Select a course" />
                      </SelectTrigger>
                      <SelectContent>
                        {manageableCourses &&
                          manageableCourses.map((manageableCourse) => (
                            <SelectItem
                              key={manageableCourse.code}
                              value={manageableCourse.code}
                            >
                              {manageableCourse.code}: {manageableCourse.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                    <Button
                      onClick={handleAssignCourseHead}
                      disabled={isAdding}
                    >
                      {!isAdding ? <CirclePlus /> : <Spinner />}
                    </Button>
                  </>
                ) : (
                  <p className="text-red-500">
                    No courses are available to choose
                  </p>
                )}
              </div>
            </>
          )}
          <DialogFooter className="mt-2">
            <DialogClose asChild>
              <Button variant="outline">Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      )}
    </Dialog>
  );
};
