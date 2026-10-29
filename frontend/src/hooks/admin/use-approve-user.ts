import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import { AxiosError } from "axios";
import { toast } from "sonner";

export const useApproveUser = (userId: string) => {
  const queryClient = useQueryClient();

  const { mutateAsync: approveUser, isPending: isApproving } = useMutation({
    mutationKey: ["approve-user"],
    mutationFn: async (userId: string) => {
      return api.put(`/api/users/${userId}/approve`);
    },
    onSuccess: () => {
      toast.success("User has been approved successfully.");

      queryClient.invalidateQueries({
        queryKey: ["get-users"],
      });
      queryClient.invalidateQueries({
        queryKey: ["user", userId],
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
        "An error occurred while approving this user. Please try again."
      );
    },
  });

  const handleApproveUser = async (userId: string) => {
    try {
      await approveUser(userId);
    } catch (err) {
      console.log(err);
    }
  };

  return {
    handleApproveUser,
    isApproving,
  };
};
