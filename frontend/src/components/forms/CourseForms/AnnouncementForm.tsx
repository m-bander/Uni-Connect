import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { useAnnouncementForm } from "@/hooks/student/use-announcement-form";
import type { InferredAnnouncementFormSchema } from "@/validations/AddAnnouncementFormSchema";
import type { QueryKey } from "@tanstack/react-query";
import { Plus, Trash } from "lucide-react";
import { Controller } from "react-hook-form";

type AnnouncementFormProps = {
  onClose: () => void;
  defaultValues?: Partial<InferredAnnouncementFormSchema>;
  announcementId?: string;
  announcementUri: string;
  queryKey?: QueryKey;
};

export default function AnnouncementForm({
  onClose,
  defaultValues,
  announcementId,
  announcementUri,
  queryKey,
}: AnnouncementFormProps) {
  const {
    control,
    isSubmitting,
    onSubmit,
    selectedType,
    appendPollField,
    pollFields,
    removePollField,
  } = useAnnouncementForm({
    defaultValues,
    announcementId,
    announcementUri,
    queryKey,
  });

  return (
    <form className="flex flex-col gap-4" onSubmit={onSubmit}>
      <FieldGroup>
        {/* Title */}
        <Controller
          name="title"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="announcement-title">Title</FieldLabel>
              <Input
                {...field}
                id="announcement-title"
                placeholder="e.g., Exam Schedule Updated"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.error && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* Content */}
        <Controller
          name="content"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="announcement-content">Content</FieldLabel>
              <Textarea
                {...field}
                id="announcement-content"
                placeholder="Announcement details..."
                rows={5}
                aria-invalid={fieldState.invalid}
              />
              {fieldState.error && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* Type */}
        <Controller
          name="type"
          control={control}
          disabled={!!announcementId}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="announcement-type">Type</FieldLabel>
              <Select
                value={field.value}
                onValueChange={field.onChange}
                disabled={!!announcementId}
              >
                <SelectTrigger aria-invalid={fieldState.invalid}>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="announcement">Announcement</SelectItem>
                  <SelectItem value="poll">Poll</SelectItem>
                </SelectContent>
              </Select>
              {fieldState.error && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {selectedType === "poll" && (
          <>
            <FieldSeparator />
            <FieldSet>
              <FieldLegend>Poll Items</FieldLegend>
              <FieldDescription>
                Add poll items so students can vote, make sure you have at least
                2.
              </FieldDescription>
              <FieldGroup>
                {pollFields.map((field, index) => (
                  <Controller
                    name={`pollItems.${index}.value`}
                    key={field.id}
                    control={control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor={`poll-item-${index}`}>
                          Poll item {index + 1}
                        </FieldLabel>

                        <div className="flex items-center gap-1">
                          <Input
                            {...field}
                            id={`poll-item-${index}`}
                            placeholder={`Item ${index + 1}`}
                            aria-invalid={fieldState.invalid}
                          />
                          {pollFields.length > 2 && (
                            <Button
                              size="icon"
                              variant="outline"
                              onClick={() => removePollField(index)}
                            >
                              <Trash aria-label="Delete poll item." />
                            </Button>
                          )}
                        </div>
                        {fieldState.error && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                ))}

                <Button
                  variant="outline"
                  onClick={() => appendPollField({ value: "" })}
                >
                  <Plus />
                  Add Poll Item
                </Button>
              </FieldGroup>
            </FieldSet>
          </>
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

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && announcementId && "Updating"}
              {isSubmitting && !announcementId && "Posting"}
              {isSubmitting && <Spinner />}

              {!isSubmitting && announcementId && "Update Announcement"}
              {!isSubmitting && !announcementId && "Post Announcement"}
            </Button>
          </div>
        </Field>
      </FieldGroup>
    </form>
  );
}
