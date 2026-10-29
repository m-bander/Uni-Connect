import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import api from "@/lib/axios";
import { toast } from "sonner";

import {
  assignmentFormSchema,
  type InferredAssignmentFormSchema,
} from "@/validations/AssignmentFormSchema";
import { useState } from "react";
import type { UploadFile } from "@/types/general/files";

type UseAssignmentFormArgs = {
  mode: "create" | "edit";
  courseCode?: string;
  assignmentId?: string;
  onClose: () => void;
  defaultValues?: Partial<InferredAssignmentFormSchema>;
  attached_files?: UploadFile[];
};

export const useAssignmentForm = ({
  mode,
  courseCode,
  assignmentId,
  defaultValues,
  onClose,
  attached_files,
}: UseAssignmentFormArgs) => {
  const queryClient = useQueryClient();

  const [attachedFiles, setAttachedFiles] = useState<UploadFile[]>(
    () => attached_files ?? []
  );
  const [isUploading, setIsUploading] = useState(false);

  const form = useForm<InferredAssignmentFormSchema>({
    resolver: zodResolver(assignmentFormSchema),
    defaultValues: {
      title: defaultValues?.title ?? "",
      description: defaultValues?.description ?? "",
      dueDate: defaultValues?.dueDate ?? "",
      dueTime: defaultValues?.dueTime ?? "",
      max_grade: defaultValues?.max_grade ?? 1,
    },
    mode: "onBlur",
  });

  const {
    control,
    formState: { isSubmitting, isValid },
    handleSubmit,
    reset,
  } = form;

  // TODO: handle attaching multiple files
  const { mutate: upsertAssignment } = useMutation({
    mutationKey: ["assignment", mode, assignmentId],
    mutationFn: async (values: InferredAssignmentFormSchema) => {
      const newAssignment = {
        title: values.title,
        description: values.description,
        deadline_at: new Date(`${values.dueDate}T${values.dueTime}`),
        attached_files_ids: attachedFiles.map((file) => file.id),
        max_grade: values.max_grade,
      };

      if (mode === "create") {
        return api.post(
          `/api/courses/${courseCode}/assignments`,
          newAssignment
        );
      } else {
        if (!assignmentId)
          throw new Error("Assignment ID is required for edit.");

        return api.patch(
          `/api/courses/${courseCode}/assignments/${assignmentId}`,
          newAssignment
        );
      }
    },
    onSuccess: () => {
      toast.success(
        `Assignment has been ${mode === "create" ? "created" : "updated"} successfully.`
      );

      // queryClient.invalidateQueries({ queryKey: ["assignments", courseCode] });
      queryClient.invalidateQueries({
        queryKey: ["course-assignments", courseCode],
      });

      if (mode === "create") {
        reset({
          title: "",
          description: "",
          dueDate: "",
          dueTime: "",
        });
        setAttachedFiles([]);
      } else {
        onClose();
      }
    },
    onError: (err) => {
      console.error(err);

      if (err instanceof AxiosError) {
        if (err.response?.data && "message" in err.response.data) {
          toast.error(err.response.data.message);
          return;
        }
      }
      toast.error(
        `An error occurred while ${mode === "create" ? "adding" : "updating"} this assignment. Please try again.`
      );
    },
  });

  const onSubmit = handleSubmit((values) => upsertAssignment(values));

  return {
    control,
    isSubmitting,
    onSubmit,
    attachedFiles,
    setAttachedFiles,
    isUploading,
    setIsUploading,
    isValid,
  };
};
