import api from "@/lib/axios";
import { uploadFiles } from "@/lib/uploadthingFn";
import type { Course } from "@/types/student/course";
import {
  CourseFormSchema,
  type ICourseFormSchema,
} from "@/validations/CourseFormSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export const useCourseForm = (
  initialCourseData?: Course,
  onSuccess?: () => void
) => {
  const client = useQueryClient();
  const {
    handleSubmit,
    control,
    formState: { isValid, isSubmitting, dirtyFields },
    reset,
    trigger,
    setValue,
  } = useForm({
    resolver: zodResolver(CourseFormSchema),
    mode: "onChange",
    defaultValues: {
      image_url: initialCourseData?.image_url,
      name: initialCourseData?.name,
      code: initialCourseData?.code,
      year: initialCourseData?.year,
      department: initialCourseData?.department||"General Studies",
      description: initialCourseData?.description||"",
    },
  });
  const [imageFile, setChosenFile] = useState<File | undefined>();

  // TODO: Make sure course image is uploaded and stored in the DB

  const { mutate: createCourse, isPending } = useMutation({
    mutationKey: ["create-course"],
    mutationFn: async (data: ICourseFormSchema) => {
      const newImageUrl = imageFile && URL.createObjectURL(imageFile);
      let image_url = initialCourseData?.image_url;

      if (newImageUrl !== image_url && imageFile) {
        const res = await uploadFiles("imageUploader", {
          files: [imageFile],
        });

        if (!res.length || !res[0].serverData.image_url) {
          toast.error("Error occurred while uploading course image.");
          return;
        }

        image_url = res[0].serverData.image_url;
      }

      if (initialCourseData) {
        const updateData = {
          name: data.name,
          year: data.year,
          image_url,
          department:data.department,
          description:data.description,
        };

        return api.patch(`/api/courses/${initialCourseData.code}`, updateData);
      }

      return api.post("/api/courses", {
        ...data,
        image_url,
      });
    },
    onSuccess: () => {
      let message;
      if (initialCourseData) message = "Successfully updated the course";
      else message = "Successfully created the course";

      toast.success(message);

      if (!initialCourseData) {
        reset();
        client.invalidateQueries({ queryKey: ["instructor-courses"] });
      } else {
        client.invalidateQueries({
          queryKey: ["get-course", initialCourseData.code],
        });
      }

      // Refresh shared course listings
      client.invalidateQueries({ queryKey: ["all-courses"] });
      client.invalidateQueries({ queryKey: ["campus-catalog"] });
      onSuccess?.();
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.data && "message" in err.response.data) {
          const message = err.response.data.message;
          return toast.error(message);
        }
      }

      toast.error("Unexpected error has occurred");
    },
  });

  const onSubmit = handleSubmit((data) => {
    createCourse(data);
  });

  const handleImageChange = (file: File | undefined) => {
    setChosenFile(file);
    const imageUrl = !file ? "" : URL.createObjectURL(file);
    setValue("image_url", imageUrl);
    trigger("image_url");
  };

  return {
    onSubmit,
    isPending,
    control,
    isValid,
    reset,
    isSubmitting,
    dirtyFields,
    handleImageChange,
  };
};
