import AssignmentForm from "@/components/forms/CourseForms/AssignmentForm";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { useState } from "react";

type AddAssignmentModalProps = {
  courseCode: string;
};

export default function AddAssignmentModal({
  courseCode,
}: AddAssignmentModalProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Assignment
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create Assignment</DialogTitle>
          <DialogDescription>
            Create a new assignment for your course.
          </DialogDescription>
        </DialogHeader>
        <AssignmentForm
          mode="create"
          courseCode={courseCode}
          onClose={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
