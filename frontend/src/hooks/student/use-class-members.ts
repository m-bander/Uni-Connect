import api from "@/lib/axios";
import { type StudentUser } from "@/types/student/student-user";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

export const useClassMembers = () => {
  const { data: classMembers, isLoading } = useQuery<StudentUser[]>({
    queryKey: ["get-class-members"],
    queryFn: async () => {
      try {
        const res = await api.get<StudentUser[]>("/api/users/class-members");
        return res.data;
      } catch (err) {
        if (err instanceof AxiosError) {
          if (err.response?.data && "message" in err.response.data) {
            const message = err.response.data.message;
            throw new Error(message);
          }
        }

        throw new Error("Unexpected server error");
      }
    },
  });

  return {
    classMembers,
    isLoading,
  };
};
