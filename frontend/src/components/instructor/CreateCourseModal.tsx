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
import { Plus } from "lucide-react";
import { useState } from "react";

type CreateCourseModalProps = {
  trigger?: React.ReactNode;
};

export const CreateCourseModal = ({ trigger }: CreateCourseModalProps) => {
  const [open, setOpen] = useState(false);
  const { control, isValid, onSubmit, reset, isPending, handleImageChange } =
    useCourseForm(undefined, () => setOpen(false));

  const handleOpenChange = (open: boolean) => {
    setOpen(open);
    if (open) reset();
  };
  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger ? (
          trigger
        ) : (
          <Button variant="outline" className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            Create New Course
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={onSubmit}>
          <DialogHeader>
            <DialogTitle>Create a new course</DialogTitle>
            <DialogDescription>
              Enter the course details below. Click "Create course" to finalize
              and add the course.
            </DialogDescription>
          </DialogHeader>
          <CourseFieldGroup
            control={control}
            disableCode={false}
            handleImageChange={handleImageChange}
          />
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" disabled={!isValid}>
              {isPending ? "Creating Course" : "Create Course"}
              {isPending && <Spinner />}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
