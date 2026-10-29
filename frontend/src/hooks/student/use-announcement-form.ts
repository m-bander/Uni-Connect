import api from "@/lib/axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";

import {
  addAnnouncementSchema,
  type InferredAnnouncementFormSchema,
} from "@/validations/AddAnnouncementFormSchema";

import type { Announcement } from "@/types/student/announcement";
import { useQueryClient, type QueryKey } from "@tanstack/react-query";

type UseAnnouncementFormArgs = {
  defaultValues?: Partial<InferredAnnouncementFormSchema>;
  announcementId?: string;
  announcementUri: string;
  queryKey?: QueryKey;
};

export const useAnnouncementForm = ({
  defaultValues,
  announcementId,
  announcementUri,
  queryKey,
}: UseAnnouncementFormArgs) => {
  const form = useForm<InferredAnnouncementFormSchema>({
    resolver: zodResolver(addAnnouncementSchema),
    defaultValues: {
      title: defaultValues?.title ?? "",
      content: defaultValues?.content ?? "",
      type: defaultValues?.type ?? "announcement",
      pollItems:
        defaultValues?.type === "poll" && defaultValues.pollItems
          ? defaultValues.pollItems
          : [{ value: "" }, { value: "" }],
    },
    mode: "onSubmit",
    shouldUnregister: false,
  });

  const {
    control,
    formState: { isSubmitting },
    watch,
    handleSubmit,
    getValues,
  } = form;

  const {
    fields: pollFields,
    append: appendPollField,
    remove: removePollField,
  } = useFieldArray({
    control,
    rules: {
      minLength: 2,
    },
    name: "pollItems",
  });

  const selectedType = watch("type");

  const queryClient = useQueryClient();

  const onSubmit = handleSubmit(async (values) => {
    try {
      if (announcementId) {
        // Used getValues because values passed in the function doesn't have "type" field for some reason
        const values = getValues();
        await api.patch<Partial<Announcement>>(announcementUri, {
          title: values.title,
          content: values.content,
          pollItems:
            values.type === "poll"
              ? values.pollItems.map((pollItem) => ({
                  content: pollItem.value,
                  id: pollItem.id,
                }))
              : undefined,
        });

        toast.success("Announcement has been updated successfully.");
      } else {
        const newAnnouncement = {
          title: values.title,
          content: values.content,
          type: values.type,
          pollItems:
            values.type === "poll" &&
            values.pollItems.map((pollItem) => pollItem.value),
        };

        await api.post<Announcement>(announcementUri, newAnnouncement);

        toast.success("Announcement has been added successfully.");

        // TODO: Close the form instead and (refresh the page to fetch the new announcement or add it optimistically)
        form.reset({
          title: "",
          content: "",
          type: "announcement",
        });
      }

      queryClient.invalidateQueries({ queryKey });
    } catch (error) {
      console.log(error);
      toast.error(
        "An error occurred while adding this announcement. Please try again."
      );
    }
  });

  return {
    control,
    isSubmitting,
    onSubmit,
    selectedType,
    pollFields,
    appendPollField,
    removePollField,
  };
};
