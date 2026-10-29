import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import { AxiosError } from "axios";
import { toast } from "sonner";

export const useDeleteUser = (user_id: string) => {
  const queryClient = useQueryClient();

  const { mutateAsync: deleteUser, isPending: isDeleting } = useMutation({
    mutationKey: ["delete-user"],
    mutationFn: async (userId: string) => {
      return api.delete(`/api/users/${userId}`);
    },
    onSuccess: () => {
      toast.success("User has been deleted successfully.");

      queryClient.invalidateQueries({
        queryKey: ["get-users"],
      });
      queryClient.invalidateQueries({
        queryKey: ["user", user_id],
      });
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.data && "message" in err.response.data) {
          toast.error(err.response.data.message);
          return;
        }
      }
      toast.error(
        "An error occurred while deleting this user. Please try again."
      );
    },
  });

  const handleDeleteUser = async (userId: string) => {
    try {
      await deleteUser(userId);
    } catch (err) {
      console.log(err);
    }
  };

  return {
    handleDeleteUser,
    isDeleting,
  };
};
