import api from "@/lib/axios";
import type { Material } from "@/types/student/material";
import { useQuery } from "@tanstack/react-query";

export const useStudentMaterials = (courseCode: string | undefined) => {
  const { data: materials, isLoading } = useQuery<Material[]>({
    queryKey: ["student-materials", courseCode],
    queryFn: async () => {
      const res = await api.get<Material[]>(
        `/api/materials/course/${courseCode}`
      );
      console.log(res.data);
      return res.data;
    },
    initialData: [],
    enabled: courseCode !== undefined,
  });

  return {
    materials,
    isLoading,
  };
};
