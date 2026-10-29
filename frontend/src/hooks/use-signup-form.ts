import api from "@/lib/axios";
import {
  signupFormSchema,
  type InferredFormSchema,
} from "@/validations/SignupFormSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { toast } from "sonner";

const useSignupForm = () => {
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

  const navigate = useNavigate();

  const {
    handleSubmit,
    control,
    formState: { isValid, isSubmitting },
    trigger,
    watch,
  } = form;

  const selectedRole = watch("role");

  const { mutateAsync: signup } = useMutation<void, Error, InferredFormSchema>({
    mutationKey: ["signup"],
    mutationFn: (data) => {
      if (selectedRole === "student") {
        const newUser = {
          first_name: data.firstName,
          parent_name: data.parentName,
          email: data.email,
          password: data.password,
          role: data.role,
          code: data.studentCode,
          year: data.year,
        };

        return api.post("/api/users/register", newUser);
      } else if (selectedRole === "professor/ta") {
        const newUser = {
          first_name: data.firstName,
          parent_name: data.parentName,
          email: data.email,
          password: data.password,
          role: data.role,
        };
        return api.post("/api/users/register", newUser);
      }

      return new Promise((_, reject) => reject("Invalid Role."));
    },
  });

  const onSubmit = handleSubmit(async (data) => {
    try {
      await signup(data);

      let toastMessage;
      if (selectedRole === "student") {
        toastMessage =
          "Your account has been successfully created, to customize it visit your profile page in the dashboard.";
      } else if (selectedRole === "professor/ta") {
        toastMessage =
          "Your request has been sent. Please wait for admins approval.";
      }

      toast.success(toastMessage);
      navigate("/login", { replace: true });
    } catch (err) {
      if (err instanceof AxiosError) {
        if (err.response?.data && "message" in err.response.data) {
          const message = err.response.data.message;
          toast.error(message);
          return;
        }
      }

      toast.error("An error occured, please try again.");
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

export default useSignupForm;
