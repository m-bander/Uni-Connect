import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";
import { useCourseForm } from "@/hooks/instructor/use-course-form";
import { CourseFieldGroup } from "./CourseFieldGroup";
import { Edit } from "lucide-react";
import type { Course } from "@/types/student/course";
import { useState } from "react";

type UpdateCourseModalProps = {
  trigger?: React.ReactNode;
  courseData: Course;
};

export const UpdateCourseModal = ({
  trigger,
  courseData,
}: UpdateCourseModalProps) => {
  const [open, setOpen] = useState(false);
  const {
    control,
    isValid,
    onSubmit,
    isPending,
    isSubmitting,
    handleImageChange,
  } = useCourseForm(courseData, () => setOpen(false));

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ? (
          trigger
        ) : (
          <Button variant="outline" size="sm" className="cursor-pointer">
            <Edit className="w-4 h-4 mr-2" />
            Modify Course
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={onSubmit}>
          <DialogHeader>
            <DialogTitle>Update the course</DialogTitle>
            <DialogDescription>
              Update the course info below. Click "Update course" to update the
              course.
            </DialogDescription>
          </DialogHeader>
            {courseData && (
              <CourseFieldGroup
                control={control}
                disableCode={true}
                handleImageChange={handleImageChange}
              />
            )}
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              type="submit"
              disabled={!isValid || isPending || isSubmitting}
            >
              {isPending ? "Updating Course" : "Update Course"}
              {isPending && <Spinner />}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
