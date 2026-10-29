import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Submission } from "@/types/student/submission";
import type { Assignment } from "@/types/student/assignment";
import { Users } from "lucide-react";
import SubmissionCard from "../../../instructor/SubmissionCard";

type GradeSubmissionModalProps = {
  submissions: Submission[];
  assignment: Assignment;
};

export default function GradeSubmissionModal({
  submissions,
  assignment,
}: GradeSubmissionModalProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Users className="w-4 h-4 mr-2" />
          View Submissions ({submissions.length})
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Student Submissions</DialogTitle>
          <DialogDescription>
            Review and grade student submissions for this assignment
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-[60vh] p-3">
          <div className="space-y-4">
            {submissions.map((submission) => (
              <SubmissionCard
                key={submission.id}
                submission={submission}
                assignment={assignment}
              />
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
