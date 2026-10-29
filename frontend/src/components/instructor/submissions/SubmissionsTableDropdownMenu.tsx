import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Assignment } from "@/types/student/assignment";
import type { Submission } from "@/types/student/submission";
import { MoreHorizontal } from "lucide-react";
import { Link } from "react-router";
import StudentSubmissionModal from "../StudentSubmissionModal";
import { useModal } from "@/providers/context/modalContext";

type SubmissionsTableDropdownMenuProps = {
  submission: Submission;
  assignment: Assignment;
};

const SubmissionsTableDropdownMenu = ({
  submission,
  assignment,
}: SubmissionsTableDropdownMenuProps) => {
  const { setOpen } = useModal();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="size-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>

        <DropdownMenuItem
          onSelect={(e) => e.preventDefault()}
          onClick={(e) => {
            e.preventDefault();
            setOpen(
              <StudentSubmissionModal
                submission={submission}
                assignment={assignment}
              />
            );
          }}
        >
          View submission
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild><Link to={`/profiles/${submission.submitter.id}?back=${window.location.href}`}>View student profile</Link></DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default SubmissionsTableDropdownMenu;
