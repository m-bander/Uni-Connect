import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Assignment } from "@/types/student/assignment";
import type { Submission } from "@/types/student/submission";
import SubmissionCard from "./SubmissionCard";
import { useModal } from "@/providers/context/modalContext";

type StudentSubmissionModalProps = {
  submission: Submission;
  assignment: Assignment;
};

const StudentSubmissionModal = ({
  submission,
  assignment,
}: StudentSubmissionModalProps) => {
  const { setClose, isOpen } = useModal();
  return (
    <Dialog open={isOpen} onOpenChange={setClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Student Submission</DialogTitle>
          <DialogDescription>
            Review and grade student submission for this assignment
          </DialogDescription>
        </DialogHeader>

        <SubmissionCard submission={submission} assignment={assignment} />
      </DialogContent>
    </Dialog>
  );
};

export default StudentSubmissionModal;
