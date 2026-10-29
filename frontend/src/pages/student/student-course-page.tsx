import type { FeatureFlags } from "@/constants/user/feature-flags";
import { useParams } from "react-router";

// Hooks
import { useAuth } from "@/providers/context/authContext";

// Components
import CoursePage from "@/components/common/course/CoursePage";
import { useCourseData } from "@/hooks/instructor/use-course-data";
import notFoundAnimation from "@/assets/lottie/Error 404.json";
import CustomLottie from "@/components/global/CustomLottie";

export const StudentCoursePage = () => {
  const { auth } = useAuth();
  const { id } = useParams<{ id: string }>();
  const { courseData, isLoading } = useCourseData(id);

  if (isLoading) return <></>;

  if (!courseData) {
    return (
      <CustomLottie
        message="Oops, this course doesn't exist."
        animationData={notFoundAnimation}
      />
    );
  }

  const studentRole = auth.user?.role;

  const featureFlags: FeatureFlags = {
    showModifyCourseBtn: false,
    showAddMaterialBtn: false,
    showAddAnnouncementBtn: false,
    showAddAssignmentBtn: false,
    showAddCalendarEventBtn: false,
  };

  if (studentRole === "class_representative") {
    featureFlags.showAddMaterialBtn = true;
    featureFlags.showAddAnnouncementBtn = true;
    featureFlags.showAddCalendarEventBtn = true;
  } else if (studentRole === "course_head") {
    const isTeamHeadForThisCourse =
      auth.user?.id && courseData.representatives_ids.includes(auth.user?.id);

    if (isTeamHeadForThisCourse) {
      featureFlags.showAddMaterialBtn = true;
      featureFlags.showAddAnnouncementBtn = true;
      featureFlags.showAddCalendarEventBtn = true;
    }
  }

  return <CoursePage course={courseData} featureFlags={featureFlags} />;
};
