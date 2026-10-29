import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import { AxiosError } from "axios";
import { toast } from "sonner";

export const useDeleteMaterial = (course_code: string) => {
  const queryClient = useQueryClient();

  const { mutateAsync: deleteMaterial, isPending: isDeleting } = useMutation({
    mutationKey: ["delete-material"],
    mutationFn: async (materialId: number) => {
      return api.delete(`/api/materials/${materialId}`);
    },
    onSuccess: () => {
      toast.success("Material has been deleted successfully.");

      queryClient.invalidateQueries({
        queryKey: ["student-materials", course_code],
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
        "An error occurred while deleting this material. Please try again."
      );
    },
  });

  const handleDeleteMaterial = async (materialId: number) => {
    try {
      await deleteMaterial(materialId);
    } catch (err) {
      console.log(err);
    }
  };

  return {
    handleDeleteMaterial,
    isDeleting,
  };
};
