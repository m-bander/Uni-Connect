// Components
import AnnouncementsSection from "@/components/common/course/announcements/AnnouncementsSection";
import AssignmentsSection from "@/components/common/course/assignments/AssignmentsSection";
import CourseHeader from "@/components/common/course/CourseHeader";
import MaterialsSection from "@/components/common/course/materials/MaterialsSection";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CourseMembersSection from "./members/CourseMembersSection";

// Hooks
import { useStudentAssignments } from "@/hooks/student/use-student-assignments";
import { useStudentMaterials } from "@/hooks/student/use-student-materials";

// Types
import type { FeatureFlags } from "@/constants/user/feature-flags";
import type { Course } from "@/types/student/course";
import { useCourseAnnouncements } from "@/hooks/student/use-course-announcements";
import { useHasRole } from "@/hooks/use-has-role";
import CourseStudentsDetailsTable from "@/components/instructor/CourseStudentsDetailsTable";

type CoursePageProps = {
  course: Course;
  featureFlags: FeatureFlags;
};

export default function CoursePage({ course, featureFlags }: CoursePageProps) {
  const { announcements, courseAnnouncementsQueryKey } = useCourseAnnouncements(
    course.code
  );
  const { assignments } = useStudentAssignments(course.code);

  // TODO: backend route returns only 3-4 recent materials + returns an array with the material count for each category ??
  const { materials } = useStudentMaterials(course.code);
  const { hasRole } = useHasRole();

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-6 py-8">
        {/* Course Header */}
        <CourseHeader
          course={course}
          showModifyCourseBtn={featureFlags.showModifyCourseBtn}
        />

        {/* Course Content Tabs */}
        <Tabs defaultValue="materials" className="space-y-6">
          <TabsList className="bg-slate-100">
            <TabsTrigger value="materials">Materials</TabsTrigger>
            <TabsTrigger value="announcements">Announcements</TabsTrigger>
            <TabsTrigger value="assignments">Assignments</TabsTrigger>
            <TabsTrigger value="members">Members</TabsTrigger>
            {hasRole("professor/ta") && (
              <TabsTrigger value="students_details">
                Students Details
              </TabsTrigger>
            )}
          </TabsList>

          {/* TODO: Remove courseCode Props in all sections if backend route handles them */}
          <TabsContent value="materials">
            <MaterialsSection
              materials={materials}
              courseCode={course.code}
              allowModifyMaterials={featureFlags.showAddMaterialBtn}
            />
          </TabsContent>

          <TabsContent value="announcements">
            <AnnouncementsSection
              announcements={announcements}
              courseCode={course.code}
              courseStudentsCount={course.students_number}
              allowModifyAnnouncements={featureFlags.showAddAnnouncementBtn}
              courseAnnouncementsQueryKey={courseAnnouncementsQueryKey}
            />
          </TabsContent>

          <TabsContent value="assignments">
            <AssignmentsSection
              assignments={assignments}
              courseCode={course.code}
              allowModifyAssignments={featureFlags.showAddAssignmentBtn}
            />
          </TabsContent>

          <TabsContent value="members">
            <CourseMembersSection />
          </TabsContent>

          {hasRole("professor/ta") && (
            <TabsContent value="students_details">
              <CourseStudentsDetailsTable />
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
}
