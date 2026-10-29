import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import api from "@/lib/axios";
import { toast } from "sonner";

import {
  materialFormSchema,
  type InferredMaterialFormSchema,
} from "@/validations/MaterialFormSchema";
import { useEffect, useState } from "react";
import type { Material } from "@/types/student/material";
import type { UploadFile } from "@/types/general/files";

type UseMaterialFormArgs = {
  mode: "create" | "edit";
  courseCode: string;
  materialId?: number;
  materialData?: Material;
};

export const useMaterialForm = ({
  mode,
  courseCode,
  materialId,
  materialData,
}: UseMaterialFormArgs) => {
  const queryClient = useQueryClient();

  const [chosenFile, setChosenFile] = useState<UploadFile | undefined>();

  useEffect(() => {
    if (materialData) {
      setChosenFile({
        id: materialData.file.id,
        key: materialData.file.key,
        name: materialData.file.name,
        size: materialData.file.size,
        url: materialData.file.url,
      });
    }
  }, [materialData]);

  const form = useForm<InferredMaterialFormSchema>({
    resolver: zodResolver(materialFormSchema),
    defaultValues: {
      title: materialData?.title ?? "",
      folder: materialData?.category ?? "lecture",
      file_id: materialData?.file.id ?? undefined,
    },
    mode: "onBlur",
  });

  const {
    control,
    formState: { isSubmitting, isValid },
    handleSubmit,
    reset,
    trigger,
    setValue,
  } = form;

  const mutation = useMutation({
    mutationKey: ["material", mode, materialId],
    mutationFn: async (values: InferredMaterialFormSchema) => {
      const newMaterial = {
        title: values.title,
        category: values.folder,
        course_code: courseCode,
        file_id: values.file_id,
      };

      if (mode === "create") {
        return api.post("/api/materials", newMaterial);
      } else {
        if (!materialId) throw new Error("Material ID is required for edit.");
        return api.patch(`/api/materials/${materialId}`, {
          title: newMaterial.title,
          category: newMaterial.category,
        });
      }
    },
    onSuccess: () => {
      toast.success(
        `Material has been ${mode === "create" ? "created" : "updated"} successfully.`
      );

      queryClient.invalidateQueries({
        queryKey: ["student-materials", courseCode],
      });

      if (mode === "create") {
        reset({
          title: "",
          folder: "lecture",
          file_id: undefined,
        });
        setChosenFile(undefined);
      }
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.data && "message" in err.response.data) {
          toast.error(err.response.data.message);
          return;
        }
      }
      toast.error(
        `An error occurred while ${mode === "create" ? "adding" : "updating"} this material. Please try again.`
      );
    },
  });

  const { mutateAsync: deleteFile, isPending: isDeletingFile } = useMutation({
    mutationKey: ["delete-file"],
    mutationFn: (fileId: string) => {
      return api.delete(`/api/files/${fileId}`);
    },
    onSuccess: () => {
      if (!chosenFile) return;

      toast.success(`${chosenFile.name} has been deleted successfully`);
      toast.success(`You can now upload a different file for the material`);
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.data && "message" in err.response.data) {
          toast.error(err.response.data.message);
          return;
        }
      }
      toast.error(
        `An error occurred while deleting the file. Please try again.`
      );
    },
  });

  const onSubmit = handleSubmit((values) => mutation.mutate(values));

  const chooseFile = (file: UploadFile) => {
    setValue("file_id", file.id);
    setChosenFile(file);
    trigger("file_id");
  };

  const handleDeleteFile = async () => {
    if (isDeletingFile || !chosenFile) return;

    await deleteFile(chosenFile.id);

    setChosenFile(undefined);
  };

  return {
    control,
    isSubmitting: isSubmitting || mutation.isPending,
    onSubmit,
    chooseFile,
    chosenFile,
    isValid,
    handleDeleteFile,
    isDeletingFile,
  };
};
