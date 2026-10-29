import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
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
import { Controller } from "react-hook-form";

import useCurrentUserCourses from "@/hooks/shared/use-current-user-courses";
import { useEventForm } from "@/hooks/student/use-event-form";
import { useAuth } from "@/providers/context/authContext";
import type { Course } from "@/types/student/course";
import type { InferredEventFormSchema } from "@/validations/EventFormSchema";

type EventFormProps = {
  mode?: "create" | "edit";
  eventId?: string;
  onClose: () => void;
  defaultValues?: Partial<InferredEventFormSchema>;
};

export default function EventForm({
  mode = "create",
  eventId,
  onClose,
  defaultValues,
}: EventFormProps) {
  const { control, isSubmitting, onSubmit, isValid } = useEventForm({
    mode,
    eventId,
    defaultValues,
    onClose,
  });
  const { auth } = useAuth();
  const { currentUserCourses } = useCurrentUserCourses();

  const isEditMode = mode === "edit";

  const userId = auth.user?.id;
  if (!userId) return null;

  let availableCourses: Course[] = [];
  if (auth.user?.role === "course_head") {
    availableCourses = currentUserCourses.filter((course) =>
      course.representatives_ids.includes(userId)
    );
  } else if (
    auth.user?.role === "professor/ta" ||
    auth.user?.role === "class_representative"
  ) {
    // TODO: Based on the project requirements class reps should be able to add deadlines (post, poll, quiz, and exam) to any course
    // in their class, but we didn't create table that maps a course to a class
    availableCourses = currentUserCourses;
  }

  return (
    <form className="flex flex-col gap-4" onSubmit={onSubmit}>
      <FieldGroup>
        {/* Course Select */}
        <Controller
          name="courseCode"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="event-course">Course</FieldLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger id="event-course">
                  <SelectValue placeholder="Select a course" />
                </SelectTrigger>
                <SelectContent>
                  {availableCourses.map((c) => (
                    <SelectItem key={c.code} value={c.code}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {fieldState.error && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* Title */}
        <Controller
          name="title"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="event-title">Title</FieldLabel>
              <Input
                {...field}
                id="event-title"
                placeholder="e.g., Quiz 2"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.error && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* Notes */}
        <Controller
          name="notes"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="event-notes">Notes</FieldLabel>
              <Textarea
                {...field}
                id="event-notes"
                placeholder="Event details..."
                rows={3}
                aria-invalid={fieldState.invalid}
              />
              {fieldState.error && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* Due Date + Due Time */}
        <div className="grid grid-cols-2 gap-4">
          {/* Due Date */}
          <Controller
            name="dueDate"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="event-date">Date</FieldLabel>
                <Input
                  {...field}
                  id="event-date"
                  type="date"
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.error && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          {/* Due Time */}
          <Controller
            name="dueTime"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="event-time">Time</FieldLabel>
                <Input
                  {...field}
                  id="event-time"
                  type="time"
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.error && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        </div>

        {/* Type */}
        <Controller
          name="type"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="event-type">Type</FieldLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger id="event-type">
                  <SelectValue placeholder="Select event type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="quiz">Quiz</SelectItem>
                  <SelectItem value="exam">Exam</SelectItem>
                  <SelectItem value="project">Project</SelectItem>
                  {/* <SelectItem value="assignment">Assignment</SelectItem> */}
                  <SelectItem value="lab_exam">Lab Exam</SelectItem>
                  <SelectItem value="poll">Poll</SelectItem>
                </SelectContent>
              </Select>
              {fieldState.error && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* Buttons */}
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
                  {isEditMode ? "Updating..." : "Creating..."}
                  <Spinner />
                </>
              ) : (
                <>{isEditMode ? "Update Event" : "Create Event"}</>
              )}
            </Button>
          </div>
        </Field>
      </FieldGroup>
    </form>
  );
}
