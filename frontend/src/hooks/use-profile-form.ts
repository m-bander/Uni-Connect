import api from "@/lib/axios";
import type { User } from "@/types/user/user";
import {
  type InferredStudentProfileSchema,
  StudentProfileFormSchema,
} from "@/validations/StudentProfileFormSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useAuth } from "@/providers/context/authContext";

export const useProfileForm = (userData: User) => {
  const client = useQueryClient();
  const {setAuth}=useAuth();
  const {
    handleSubmit,
    control,
    formState: { isValid },
  } = useForm<InferredStudentProfileSchema>({
    resolver: zodResolver(StudentProfileFormSchema),
    mode: "onBlur",
    defaultValues: userData,
  });

  const { mutateAsync: updateProfile, isPending } = useMutation({
    mutationKey: ["profileUpdate"],
    mutationFn: (data: InferredStudentProfileSchema) => {
      return api.patch("/api/users/me", data);
    },
    onSuccess: (_response,data) => {
      client.invalidateQueries({ queryKey: ["profile-data"] });
      setAuth(auth=>({...auth,user:auth.user?{...auth.user,first_name:data.first_name,parent_name:data.parent_name,grandparent_name:data.grandparent_name,family_name:data.family_name,email:data.email}:null}));
      toast.success("Successfully updated profile data.");
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.data && "message" in err.response.data) {
          const message = err.response.data.message;
          toast.error(message);
        }
      }

      toast.error("An unkown error occurred!");
    },
  });

  const onSubmit = handleSubmit(async (data) => {
    await updateProfile(data);
  });

  return {
    control,
    onSubmit,
    isSubmiting: isPending,
    isValid,
  };
};
