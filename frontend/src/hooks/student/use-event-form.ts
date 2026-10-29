import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import api from "@/lib/axios";
import { toast } from "sonner";

import {
  eventFormSchema,
  type InferredEventFormSchema,
} from "@/validations/EventFormSchema";
import type { CalendarEvent } from "@/types/student/calendar-event";

type UseEventFormArgs = {
  mode: "create" | "edit";
  eventId?: string;
  defaultValues?: Partial<InferredEventFormSchema>;
  onClose?: () => void;
};

export const useEventForm = ({
  mode,
  eventId,
  defaultValues,
  onClose,
}: UseEventFormArgs) => {
  const queryClient = useQueryClient();

  const form = useForm<InferredEventFormSchema>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      title: defaultValues?.title ?? "",
      notes: defaultValues?.notes ?? "",
      dueDate: defaultValues?.dueDate ?? "",
      dueTime: defaultValues?.dueTime ?? "",
      type: defaultValues?.type ?? "quiz",
      courseCode: defaultValues?.courseCode ?? "",
    },
    mode: "onBlur",
  });

  const {
    control,
    formState: { isSubmitting, isValid },
    handleSubmit,
    reset,
  } = form;

  const mutation = useMutation({
    mutationKey: ["event", mode, eventId],
    mutationFn: async (values: InferredEventFormSchema) => {
      const newEvent: Partial<CalendarEvent> = {
        title: values.title,
        notes: values.notes,
        deadline_at: new Date(`${values.dueDate}T${values.dueTime}`).getTime(),
        type: values.type,
        course_id: values.courseCode,
      };

      if (mode === "create") {
        return api.post(`/api/courses/${values.courseCode}/events`, newEvent);
      } else {
        if (!eventId) throw new Error("Event ID is required for edit.");
        return api.patch(`/api/events/${eventId}`, newEvent);
      }
    },
    onSuccess: () => {
      toast.success(
        `Event has been ${mode === "create" ? "created" : "updated"} successfully.`
      );

      queryClient.invalidateQueries({ queryKey: ["calendar-events"] });

      if (mode === "create") {
        reset({
          title: "",
          notes: "",
          dueDate: "",
          dueTime: "",
          type: "quiz",
          courseCode: "",
        });
      } else {
        onClose?.();
      }
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.data && "message" in err.response.data) {
          toast.error(err.response.data.message);
          return;
        }
      }
      toast.error(
        `An error occurred while ${mode === "create" ? "creating" : "updating"} this event.`
      );
    },
  });

  const onSubmit = handleSubmit((values) => mutation.mutate(values));

  return {
    control,
    isSubmitting: isSubmitting || mutation.isPending,
    isValid,
    onSubmit,
  };
};
