import FileCard from "@/components/common/course/assignments/FileCard";
import { UploadDropZone } from "@/components/global/UploadDropZone";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import useDeleteAssignmentFile from "@/hooks/instructor/use-delete-assignment-file";
import { useAssignmentForm } from "@/hooks/student/use-assignment-form";
import type { UploadFile } from "@/types/general/files";
import type { InferredAssignmentFormSchema } from "@/validations/AssignmentFormSchema";
import { Controller } from "react-hook-form";
import { toast } from "sonner";

type AssignmentFormProps = {
  mode?: "create" | "edit";
  assignmentId?: string;
  courseCode: string;
  onClose: () => void;
  defaultValues?: Partial<InferredAssignmentFormSchema>;
  attached_files?: UploadFile[];
};

// TODO: Clean this file

export default function AddAssignmentForm({
  mode = "create",
  assignmentId,
  courseCode,
  onClose,
  defaultValues,
  attached_files,
}: AssignmentFormProps) {
  const {
    control,
    isSubmitting,
    onSubmit,
    attachedFiles,
    setAttachedFiles,
    isValid,
    isUploading,
    setIsUploading,
  } = useAssignmentForm({
    mode,
    assignmentId,
    courseCode,
    defaultValues,
    onClose,
    attached_files,
  });

  const { deleteAssignmentFile, isDeletingAssignmentFile } =
    useDeleteAssignmentFile(setAttachedFiles);

  const isEditMode = mode === "edit";

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={onSubmit}
      aria-busy={isSubmitting}
    >
      <FieldGroup>
        {/* Title */}
        <Controller
          name="title"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="assignment-title">Title</FieldLabel>
              <Input
                {...field}
                id="assignment-title"
                placeholder="e.g., Midterm Project"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.error && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* Description */}
        <Controller
          name="description"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="assignment-description">
                Description
              </FieldLabel>
              <Textarea
                {...field}
                id="assignment-description"
                placeholder="Assignment requirements and instructions..."
                rows={4}
                aria-invalid={fieldState.invalid}
              />
              {fieldState.error && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* Due Date and Time */}
        <div className="grid grid-cols-2 gap-4">
          <Controller
            name="dueDate"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="assignment-due-date">Due Date</FieldLabel>
                <Input
                  {...field}
                  id="assignment-due-date"
                  type="date"
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.error && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <Controller
            name="dueTime"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="assignment-due-time">Due Time</FieldLabel>
                <Input
                  {...field}
                  id="assignment-due-time"
                  type="time"
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.error && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        </div>

        <Controller
          name="max_grade"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="max-grade">Maximum Grade</FieldLabel>
              <Input
                id="max-grade"
                type="number"
                min={0}
                placeholder="Ex: 10"
                aria-invalid={fieldState.invalid}
                value={field.value ?? 1}
                onChange={(e) =>
                  field.onChange(
                    e.target.value === "" ? undefined : Number(e.target.value)
                  )
                }
                onBlur={field.onBlur}
                ref={field.ref}
                name={field.name}
              />
              {fieldState.error && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <UploadDropZone
          config={{
            mode: "auto",
          }}
          endpoint="assignmentUploader"
          uploadProgressGranularity="fine"
          onUploadBegin={() => setIsUploading(true)}
          onClientUploadComplete={async (files) => {
            setIsUploading(false);

            if (!files.length) {
              toast.error("No files returned from upload.");
              return;
            }

            const uploadedFiles = files
              .map((f) => f.serverData?.file_data)
              .filter((file): file is UploadFile => Boolean(file));

            setAttachedFiles((prev) => [...prev, ...uploadedFiles]);

            // TODO: Handle the case where the user leaves the form without submitting, either delete the files from upload thing or persist it in local storage (maybe)
          }}
          onUploadError={(error) => {
            setIsUploading(false);
            console.error(error);
            toast.error("An error has occurred while uploading the file.");
          }}
        />

        {attachedFiles.map((file) => (
          <FileCard
            file={file}
            key={file.id}
            onDelete={() => deleteAssignmentFile(file.id)}
            deleteButtonDisabled={isDeletingAssignmentFile}
          />
        ))}

        {/* Action Buttons */}
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

            <Button
              type="submit"
              disabled={isSubmitting || !isValid || isUploading}
            >
              {isSubmitting ? (
                <>
                  {isEditMode ? "Updating..." : "Adding..."}
                  <Spinner />
                </>
              ) : (
                <>{isEditMode ? "Update Assignment" : "Add Assignment"}</>
              )}
            </Button>
          </div>
        </Field>
      </FieldGroup>
    </form>
  );
}
