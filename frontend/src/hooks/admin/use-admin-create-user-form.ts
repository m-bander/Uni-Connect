import api from "@/lib/axios";
import {
  signupFormSchema,
  type InferredFormSchema,
} from "@/validations/SignupFormSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

type UseAdminCreateUserFormArgs = {
  onSuccess?: () => void;
};

export const useAdminCreateUserForm = ({ onSuccess }: UseAdminCreateUserFormArgs = {}) => {
  const queryClient = useQueryClient();

  const form = useForm<InferredFormSchema>({
    resolver: zodResolver(signupFormSchema),
    mode: "onBlur",
    defaultValues: {
      email: "",
      firstName: "",
      parentName: "",
      password: "",
      confirmPassword: "",
    },
  });

  const {
    handleSubmit,
    control,
    formState: { isValid, isSubmitting },
    trigger,
    watch,
    reset,
  } = form;

  const selectedRole = watch("role");

  const { mutateAsync: signup } = useMutation<void, Error, InferredFormSchema>({
    mutationKey: ["admin-signup"],
    mutationFn: (data) => {
      if (data.role === "student") {
        const newUser = {
          first_name: data.firstName,
          parent_name: data.parentName,
          email: data.email,
          password: data.password,
          role: data.role,
          code: data.studentCode,
          year: data.year,
        };

        return api.post("/api/users/create", newUser);
      } else if (data.role === "professor/ta") {
        const newUser = {
          first_name: data.firstName,
          parent_name: data.parentName,
          email: data.email,
          password: data.password,
          role: data.role,
        };
        return api.post("/api/users/create", newUser);
      }

      return new Promise((_, reject) => reject("Invalid Role."));
    },
    onSuccess: () => {
      toast.success("User has been created successfully.");
      queryClient.invalidateQueries({ queryKey: ["get-users"] });
      reset();
      onSuccess?.();
    },
  });

  const onSubmit = handleSubmit(async (data) => {
    try {
      await signup(data);
    } catch (err) {
      if (err instanceof AxiosError) {
        if (err.response?.data && "message" in err.response.data) {
          const message = err.response.data.message;
          toast.error(message);
          return;
        }
      }

      toast.error("An error occurred, please try again.");
      console.log(err);
    }
  });

  return {
    form,
    onSubmit,
    trigger,
    control,
    isValid,
    selectedRole,
    isSubmitting,
  };
};

export default useAdminCreateUserForm;

