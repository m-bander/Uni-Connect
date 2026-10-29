import api from "@/lib/axios";
import type { Course } from "@/types/student/course";
import type { StudentUser } from "@/types/student/student-user";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export const useAssignCourseActions = (
  manageableCourses: Course[] | undefined,
  user: StudentUser | undefined
) => {
  const client = useQueryClient();
  const [chosenCourse, setChosenCourse] = useState<string>("");

  useEffect(() => {
    if (manageableCourses && manageableCourses.length > 0)
      setChosenCourse(manageableCourses[0].code);
  }, [manageableCourses]);

  const { mutate: assignCourseHead, isPending: isAdding } = useMutation({
    mutationKey: ["assign-course-head"],
    mutationFn: (userId: string) => {
      return api.post(`/api/courses/course-head/assign`, {
        userId,
        courseCode: chosenCourse,
      });
    },
    onSuccess: () => {
      if (!user) return;

      client.invalidateQueries({
        queryKey: ["get-head-manageable-courses", user.id],
      });
      client.invalidateQueries({
        queryKey: ["get-head-managed-courses", user.id],
      });

      toast.success(
        `${user.first_name} ${user.parent_name} is now a course head for ${chosenCourse}`
      );
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.data && "message" in err.response.data) {
          const message = err.response.data.message;
          toast.error(message);
          return;
        }
      }

      toast.error("Unexpected Server error.");
    },
  });

  const { mutate: removeCouresHead } = useMutation({
    mutationKey: ["remove-course-head"],
    mutationFn: ({
      courseCode,
      userId,
    }: {
      courseCode: string;
      userId: string;
    }) => {
      return api.post(`/api/courses/course-head/remove`, {
        userId,
        courseCode,
      });
    },
    onSuccess: () => {
      if (!user) return;

      client.invalidateQueries({
        queryKey: ["get-head-manageable-courses", user.id],
      });
      client.invalidateQueries({
        queryKey: ["get-head-managed-courses", user.id],
      });

      toast.success(`Course head was successfully removed.`);
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.data && "message" in err.response.data) {
          const message = err.response.data.message;
          toast.error(message);
          return;
        }
      }

      toast.error("Unexpected Server error.");
    },
  });
  const handleAssignCourseHead = () => {
    if (user) {
      assignCourseHead(user.id);
    }
  };
  const handleRemoveCourseHead = (courseCode: string) => {
    if (user) {
      removeCouresHead({ userId: user.id, courseCode });
    }
  };

  return {
    chosenCourse,
    setChosenCourse,
    handleAssignCourseHead,
    handleRemoveCourseHead,
    isAdding,
  };
};
