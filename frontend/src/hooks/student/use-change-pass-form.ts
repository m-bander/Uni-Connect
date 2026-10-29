import api from "@/lib/axios";
import {
  changePassFormSchema,
  type IChangePassFormSchema,
} from "@/validations/ChangePassFormSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export const useChangePassForm = () => {
  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = useForm({
    resolver: zodResolver(changePassFormSchema),
    mode: "onBlur",
    defaultValues: {
      oldPassword: "",
      newPassword: "",
    },
  });

  const { mutate: changePassword, isPending } = useMutation({
    mutationKey: ["change-password"],
    mutationFn: (data: IChangePassFormSchema) => {
      return api.post("/api/auth/change-password", data);
    },
    onSuccess: () => {
      toast.success("Changed password successfully");
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.data && "message" in err.response.data) {
          const message = err.response.data.message;
          toast.error(message);
          return;
        }

        toast.error("Unexpected error occured");
      }
    },
  });

  const onSubmit = handleSubmit((data) => {
    changePassword(data);
  });

  return { control, onSubmit, isValid, isPending };
};
