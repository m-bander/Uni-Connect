import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import { AxiosError } from "axios";
import { toast } from "sonner";

export const useDeleteEvent = () => {
  const queryClient = useQueryClient();

  const { mutateAsync: deleteEvent, isPending: isDeleting } = useMutation({
    mutationKey: ["delete-event"],
    mutationFn: (eventId: string) => {
      return api.delete(`/api/events/${eventId}`);
    },
    onSuccess: () => {
      toast.success("Event has been deleted successfully.");
      queryClient.invalidateQueries({ queryKey: ["calendar-events"] });
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
        "An error occurred while deleting this event. Please try again."
      );
    },
  });

  const handleDeleteEvent = async (eventId: string) => {
    try {
      await deleteEvent(eventId);
    } catch (err) {
      console.log(err);
    }
  };

  return {
    handleDeleteEvent,
    isDeleting,
  };
};
