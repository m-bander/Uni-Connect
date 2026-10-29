import api from "@/lib/axios";
import {
  basicFormSchema,
  type InferredFormSchema,
} from "@/validations/BasicFormSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const useCreateAdminForm = () => {
  const form = useForm<InferredFormSchema>({
    resolver: zodResolver(basicFormSchema),
    defaultValues: {
      firstName: "",
      parentName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onBlur",
  });

  const {
    control,
    formState: { isValid, isSubmitting },
    handleSubmit,
  } = form;

  const onSubmit = handleSubmit(async (data) => {
    const newAdmin = {
      first_name: data.firstName,
      parent_name: data.parentName,
      email: data.email,
      password: data.password,
      role: "system_admin",
    };

    try {
      await api.post("/api/users/register/admin", newAdmin);
      toast.success("Admin has been created successfully.");
    } catch (error) {
      console.log(error);
      toast.error(
        "An error occured while creating the admin, please try again."
      );
    }
  });

  return {
    control,
    isValid,
    isSubmitting,
    onSubmit,
  };
};

export default useCreateAdminForm;
