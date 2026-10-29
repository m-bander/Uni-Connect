import AssignmentForm from "@/components/forms/CourseForms/AssignmentForm";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { Assignment } from "@/types/student/assignment";
import { Edit } from "lucide-react";
import { useState } from "react";

type EditAssignmentModalProps = {
  assignment: Assignment;
};

const toInputDate = (timestamp: string) =>
  new Date(timestamp).toISOString().slice(0, 10);

const toInputTime = (timestamp: string) =>
  new Date(timestamp).toISOString().slice(11, 16);

export default function EditAssignmentModal({
  assignment,
}: EditAssignmentModalProps) {
  const [open, setOpen] = useState(false);

  console.log(assignment);

  const defaultValues = {
    title: assignment.title,
    description: assignment.description,
    dueDate: toInputDate(assignment.deadline_at),
    dueTime: toInputTime(assignment.deadline_at),
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-muted">
          <Edit className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Assignment</DialogTitle>
        </DialogHeader>
        <AssignmentForm
          mode="edit"
          courseCode={assignment.course_id}
          defaultValues={defaultValues}
          onClose={() => setOpen(false)}
          assignmentId={assignment.id}
          attached_files={assignment.attached_files}
        />
      </DialogContent>
    </Dialog>
  );
}
