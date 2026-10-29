import { Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { UploadButton } from "@/components/global/UploadButton";
import { toast } from "sonner";
import { useMaterialForm } from "@/hooks/student/use-material-form";
import { FileText, Trash2 } from "lucide-react";
import type { Material } from "@/types/student/material";

type MaterialFormProps = {
  mode?: "create" | "edit";
  materialId?: number;
  courseCode: string;
  onClose: () => void;
  materialData?: Material;
};

export default function MaterialForm({
  mode = "create",
  materialId,
  courseCode,
  onClose,
  materialData,
}: MaterialFormProps) {
  const {
    control,
    isSubmitting,
    onSubmit,
    chooseFile,
    chosenFile,
    isValid,
    handleDeleteFile,
    isDeletingFile,
  } = useMaterialForm({
    mode,
    materialId,
    courseCode,
    materialData,
  });

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
              <FieldLabel htmlFor="material-title">Title</FieldLabel>
              <Input
                {...field}
                id="material-title"
                placeholder="e.g., Lecture 11 - Laplace Transform"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.error && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* Folder */}
        <Controller
          name="folder"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="material-folder">Folder</FieldLabel>

              <Select
                value={field.value ?? "lecture"}
                onValueChange={field.onChange}
              >
                <SelectTrigger
                  id="material-folder"
                  aria-invalid={fieldState.invalid}
                >
                  <SelectValue placeholder="Select a folder" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lecture">Lecture Slides</SelectItem>
                  <SelectItem value="sheet">Problem Sheets</SelectItem>
                  <SelectItem value="quiz">Past Quizzes</SelectItem>
                  <SelectItem value="tutorial">Tutorials</SelectItem>
                  <SelectItem value="textbook">Textbook</SelectItem>
                  <SelectItem value="assignment">Assignments</SelectItem>
                </SelectContent>
              </Select>

              {fieldState.error && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* File Upload */}

        {!chosenFile ? (
          <UploadButton
            endpoint="materialUploader"
            onClientUploadComplete={(res) => {
              console.log(res);
              const [file] = res;

              if (!file.serverData.file_data) {
                toast.error("Server couldn't upload the file properly.");
                return;
              }

              chooseFile({ ...file.serverData.file_data, url: file.ufsUrl });
            }}
            onUploadError={() => {
              toast.error("An error has occurred while uploading the file.");
            }}
          />
        ) : (
          <div className="space-y-2 mb-4">
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-primary" />
                <span className="text-sm text-foreground">
                  {chosenFile.name}
                </span>
              </div>
              <Button
                hidden={mode === "edit"}
                type="button"
                variant="ghost"
                size="icon"
                onClick={handleDeleteFile}
                disabled={isDeletingFile}
              >
                {!isDeletingFile ? <Trash2 className="w-4 h-4" /> : <Spinner />}
              </Button>
            </div>
          </div>
        )}

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

            <Button type="submit" disabled={isSubmitting || !isValid}>
              {isSubmitting ? (
                <>
                  {isEditMode ? "Updating..." : "Adding..."}
                  <Spinner />
                </>
              ) : (
                <>{isEditMode ? "Update Material" : "Add Material"}</>
              )}
            </Button>
          </div>
        </Field>
      </FieldGroup>
    </form>
  );
}
