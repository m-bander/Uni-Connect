import api from "@/lib/axios";
import type { UploadFile } from "@/types/general/files";
import { useMutation } from "@tanstack/react-query";
import type { Dispatch, SetStateAction } from "react";
import { toast } from "sonner";

const useDeleteAssignmentFile = (
  setAttachedFiles: Dispatch<SetStateAction<UploadFile[]>>
) => {
  const { mutate: deleteAssignmentFile, isPending: isDeletingAssignmentFile } =
    useMutation({
      mutationFn: (fileId: string) => {
        return api.delete(`/api/files/${fileId}`);
      },
      onError: (error) => {
        console.error(error);
        toast.error(
          "An error occurred while deleting the file, please try again."
        );
      },
      onSuccess: (_, deletedFileId) => {
        setAttachedFiles((prev) =>
          prev.filter((file) => file.id !== deletedFileId)
        );
        toast.success("File deleted successfully");
      },
    });

  return {
    deleteAssignmentFile,
    isDeletingAssignmentFile,
  };
};

export default useDeleteAssignmentFile;
