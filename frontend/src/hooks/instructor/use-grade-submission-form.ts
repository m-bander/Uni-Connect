import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import api from "@/lib/axios";
import { toast } from "sonner";

import {
  gradeFormSchema,
  type InferredGradeFormSchema,
} from "@/validations/GradeFormSchema";
import type { Submission } from "@/types/student/submission";
import type { Assignment } from "@/types/student/assignment";
import { useModal } from "@/providers/context/modalContext";

type UseGradeSubmissionFormArgs = {
  mode: "create" | "edit";
  submissionId: string;
  defaultValues?: Partial<InferredGradeFormSchema>;
  assignment: Assignment;
};

export const useGradeSubmissionForm = ({
  mode,
  submissionId,
  defaultValues,
  assignment,
}: UseGradeSubmissionFormArgs) => {
  const queryClient = useQueryClient();

  const form = useForm<InferredGradeFormSchema>({
    resolver: zodResolver(gradeFormSchema),
    defaultValues: {
      grade: defaultValues?.grade ?? undefined,
      feedback: defaultValues?.feedback ?? "",
    },
    mode: "onBlur",
  });

  const {
    control,
    formState: { isSubmitting },
    handleSubmit,
  } = form;

  const { setClose: closeModal } = useModal();

  const mutation = useMutation({
    mutationKey: ["submission-grade", mode, submissionId],
    mutationFn: async (values: InferredGradeFormSchema) => {
      const newSubmissionGrade = {
        grade: Number(values.grade),
        feedback: values.feedback,
      };

      return api.patch<Submission>(
        `/api/courses/${assignment.course_id}/assignments/${assignment.id}/submissions/${submissionId}`,
        newSubmissionGrade
      );
    },
    onSuccess: () => {
      toast.success(
        `Grade has been ${mode === "create" ? "added" : "updated"} successfully.`
      );

      queryClient.invalidateQueries({
        queryKey: ["submissions", assignment.id],
      });

      // if (mode === "create") {
      //   reset({ grade: undefined, feedback: undefined });
      // }

      closeModal();
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.data && "message" in err.response.data) {
          toast.error(err.response.data.message);
          return;
        }
      }
      toast.error(
        `An error occurred while ${mode === "create" ? "adding" : "updating"} the grade. Please try again.`
      );
    },
  });

  const onSubmit = handleSubmit((values) => mutation.mutate(values));

  return {
    control,
    isSubmitting: isSubmitting || mutation.isPending,
    onSubmit,
  };
};
