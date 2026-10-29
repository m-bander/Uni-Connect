import api from "@/lib/axios";
import type { Course } from "@/types/student/course";
import type { StudentUser } from "@/types/student/student-user";
import type { User } from "@/types/user/user";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

const useProfile = (id: string | undefined) => {
  const { data: profile, isLoading: isLoadingProfile } = useQuery<
    (User | StudentUser) & {
      courses: Course[];
    }
  >({
    queryKey: ["profile", id],
    queryFn: async () => {
      try {
        const res = await api.get(`/api/users/${id}?include=courses`);

        return res.data.data;
      } catch (err) {
        if (err instanceof AxiosError) {
          if (err.response?.data && "message" in err.response.data) {
            const message = err.response.data.message;
            toast.error(message);
            return;
          }

          toast.error("Unexpected error occurred.");
        }
      }
    },
  });

  return {
    profile,
    isLoadingProfile,
  };
};

export default useProfile;
