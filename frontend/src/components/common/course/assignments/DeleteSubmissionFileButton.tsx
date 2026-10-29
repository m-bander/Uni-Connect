import { Button } from "@/components/ui/button";
import useDeleteSubmissionFile from "@/hooks/student/use-delete-submission-file";
import { Trash } from "lucide-react";

type DeleteSubmissionFileButtonProps = {
  courseId: string;
  assignmentId: string;
  submissionId: string;
  fileId: string;
};

const DeleteSubmissionFileButton = ({
  assignmentId,
  courseId,
  fileId,
  submissionId,
}: DeleteSubmissionFileButtonProps) => {
  const { deleteSubmissionFile, isDeletingSubmissionFile } =
    useDeleteSubmissionFile({
      assignmentId,
      courseId,
      submissionId,
    });

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => deleteSubmissionFile(fileId)}
      disabled={isDeletingSubmissionFile}
    >
      <Trash className="size-4" aria-label="Delete file" />
    </Button>
  );
};

export default DeleteSubmissionFileButton;
