import { UploadDropZone } from "@/components/global/UploadDropZone";
import api from "@/lib/axios";
import type { Submission } from "@/types/student/submission";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { type UploadFile } from "@/types/general/files";

type SubmissionFormProps = {
  assignmentId: string;
  submission: Submission | undefined | null;
  courseId: string;
};

export default function StudentSubmissionForm({
  assignmentId,
  submission,
  courseId,
}: SubmissionFormProps) {
  const queryClient = useQueryClient();

  return (
    <UploadDropZone
      config={{
        mode: "auto",
      }}
      endpoint="materialUploader"
      uploadProgressGranularity="fine"
      onClientUploadComplete={async (files) => {
        if (!files?.length) {
          toast.error("No files returned from upload.");
          return;
        }

        const uploadedFiles = files
          .map((f) => f.serverData?.file_data)
          .filter((file): file is UploadFile => Boolean(file));

        if (submission?.id) {
          await api.post(
            `/api/courses/${courseId}/assignments/${assignmentId}/submissions/${submission.id}/files`,
            {
              files_ids: uploadedFiles.map((file) => file.id),
            }
          );
        } else {
          await api.post(
            `/api/courses/${courseId}/assignments/${assignmentId}/submissions`,
            {
              file_ids: uploadedFiles.map((file) => file.id),
            }
          );
        }

        queryClient.invalidateQueries({
          queryKey: ["student-submission", assignmentId],
        });
      }}
      onUploadError={() => {
        toast.error("An error has occurred while uploading the file.");
      }}
    />
  );
}
