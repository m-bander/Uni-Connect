import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import api from "@/lib/axios";
import { toast } from "sonner";

import { editUserFormSchema, type InferredEditUserFormSchema } from "@/validations/EditUserFormSchema";
import type { User } from "@/types/user/user";

type UseEditUserArgs = {
  user: User;
  onSuccess?: () => void;
};

export const useEditUser = ({ user, onSuccess }: UseEditUserArgs) => {
  const queryClient = useQueryClient();

  // react-hook-form form setup
  const form = useForm<InferredEditUserFormSchema>({
    resolver: zodResolver(editUserFormSchema),
    mode: "onBlur",
    defaultValues: {
      firstName: user.first_name ?? "",
      parentName: user.parent_name ?? "",
      email: user.email ?? "",
    },
  });

  const {
    handleSubmit,
    control,
    formState: { isSubmitting, dirtyFields, errors, isValid },
    trigger,
  } = form;

  const { mutateAsync: editUser } = useMutation({
    mutationKey: ["edit-user", user.id],
    mutationFn: async (values: InferredEditUserFormSchema) => {
      const editUser: Record<string, any> = {
        first_name: values.firstName,
        parent_name: values.parentName,
        email: values.email,
      };

      return api.put(`/api/users/${user.id}`, editUser);
    },
    onSuccess: () => {
      toast.success("User updated successfully.");
      queryClient.invalidateQueries({ queryKey: ["get-users"] });
      queryClient.invalidateQueries({ queryKey: ["user", user.id] });
      onSuccess?.();
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.data && "message" in err.response.data) {
          toast.error(err.response.data.message);
          return;
        }
      }
      toast.error("An error occurred while updating the user. Please try again.");
    },
  });

  const onSubmit = handleSubmit((values) => editUser(values));

  return {
    form,
    onSubmit,
    trigger,
    control,
    dirtyFields,
    isSubmitting,
    formState: { errors, isValid },
  };
};

export default useEditUser;