import { Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@/components/ui/spinner";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";

import { useGradeSubmissionForm } from "@/hooks/instructor/use-grade-submission-form";
import type { InferredGradeFormSchema } from "@/validations/GradeFormSchema";
import type { Assignment } from "@/types/student/assignment";

type GradeSubmissionFormProps = {
  mode?: "create" | "edit";
  submissionId: string;
  onClose?: () => void;
  defaultValues?: Partial<InferredGradeFormSchema>;
  assignment: Assignment;
};

export default function GradeSubmissionForm({
  mode = "create",
  submissionId,
  onClose,
  defaultValues,
  assignment,
}: GradeSubmissionFormProps) {
  const { control, isSubmitting, onSubmit } = useGradeSubmissionForm({
    mode,
    submissionId,
    defaultValues,
    assignment,
  });

  return (
    <form
      className="flex flex-col gap-3"
      onSubmit={onSubmit}
      aria-busy={isSubmitting}
    >
      <FieldGroup>
        <Controller
          name="grade"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={`grade-${submissionId}`}>Grade</FieldLabel>
              <Input
                {...field}
                id={`grade-${submissionId}`}
                type="number"
                step="any"
                placeholder="e.g., 95"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.error && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="feedback"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={`feedback-${submissionId}`}>
                Feedback (optional)
              </FieldLabel>
              <Textarea
                {...field}
                id={`feedback-${submissionId}`}
                placeholder="Provide feedback to the student..."
                rows={3}
                aria-invalid={fieldState.invalid}
              />
              {fieldState.error && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Field>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  {mode === "edit" ? "Updating..." : "Submitting..."}{" "}
                  <Spinner />
                </>
              ) : (
                <>{mode === "edit" ? "Update Grade" : "Submit Grade"}</>
              )}
            </Button>
          </div>
        </Field>
      </FieldGroup>
    </form>
  );
}
