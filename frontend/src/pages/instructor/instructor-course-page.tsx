import { useParams } from "react-router-dom";

// Hooks
import { useCourseData } from "@/hooks/instructor/use-course-data";

// Components
import CoursePage from "@/components/common/course/CoursePage";
import type { FeatureFlags } from "@/constants/user/feature-flags";
import notFoundAnimation from "@/assets/lottie/Error 404.json";
import CustomLottie from "@/components/global/CustomLottie";

export const InstructorCoursePage = () => {
  const { id } = useParams<{ id: string }>();

  const { courseData, isLoading: isLoadingCourseData } = useCourseData(id);

  if (isLoadingCourseData) {
    // TODO: Add skeleton or lottie
    return <></>;
  }

  if (!courseData) {
    return (
      <CustomLottie
        message="Oops, this course doesn't exist."
        animationData={notFoundAnimation}
      />
    );
  }

  const featureFlags: FeatureFlags = {
    showModifyCourseBtn: true,
    showAddMaterialBtn: true,
    showAddAnnouncementBtn: true,
    showAddAssignmentBtn: true,
    showAddCalendarEventBtn: true,
  };

  return <CoursePage course={courseData} featureFlags={featureFlags} />;
};
