import type { Course } from "@/types/student/course";
import useAllCourses from "../shared/use-all-courses";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import { toast } from "sonner";

const useJoinCourseSheet = (studentCourses: Course[]) => {
  const { allCourses } = useAllCourses();
  const nonJoinedCourses = allCourses.filter(
    (course) =>
      !studentCourses.some(
        (studentCourse) => studentCourse.code === course.code
      )
  );

  const queryClient = useQueryClient();

  const { mutate: enroll, isPending: isEnrolling } = useMutation({
    mutationFn: async (courseId: string) => {
      try {
        await api.post(`/api/courses/${courseId}/enrollments`);
        queryClient.invalidateQueries({ queryKey: ["student-courses"] });

        toast.success("Enrollment successful");
      } catch (error) {
        console.log(error);
        toast.error(
          "An error occurred while enrolling in course. Please try again."
        );
      }
    },
  });

  return {
    nonJoinedCourses,
    enroll,
    isEnrolling,
  };
};

export default useJoinCourseSheet;
