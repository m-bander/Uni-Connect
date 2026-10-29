import AnnouncementCard from "@/components/common/course/announcements/AnnouncementCard";
import Heading from "@/components/global/Heading";
import SubtleParagraph from "@/components/global/SubtleParagraph";
import CreateClassAnnouncementButton from "@/components/student/class/CreateClassAnnouncementButton";
import useStudentClassAnnouncements from "@/hooks/student/use-student-class-announcements";
import { useHasRole } from "@/hooks/use-has-role";

const ClassAnnouncementsPage = () => {
  const {
    classAnnouncements,
    userCanModifyAnnouncements,
    classStudents,
    announcementsQueryKey,
    getAnnouncementUri,
  } = useStudentClassAnnouncements();

  const { hasRole } = useHasRole();

  // TODO: Add loading skeletons and lottie files for empty states

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <Heading>Class Announcements</Heading>
          <SubtleParagraph className="mb-8">
            These are the announcements announced for your class.
          </SubtleParagraph>
        </div>
        {hasRole("class_representative") && (
          <CreateClassAnnouncementButton queryKey={announcementsQueryKey} />
        )}
      </div>
      {classAnnouncements.map((announcement) => (
        <AnnouncementCard
          key={announcement.id}
          announcement={announcement}
          allowModifyAnnouncements={userCanModifyAnnouncements}
          courseStudentsCount={classStudents?.length ?? 1}
          className="mb-3"
          queryKey={announcementsQueryKey}
          announcementUri={getAnnouncementUri(announcement.id)}
        />
      ))}
    </>
  );
};

export default ClassAnnouncementsPage;
