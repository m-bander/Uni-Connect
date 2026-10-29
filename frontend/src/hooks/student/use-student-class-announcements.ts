import api from "@/lib/axios";
import { useAuth } from "@/providers/context/authContext";
import type { Announcement } from "@/types/student/announcement";
import type { StudentUser } from "@/types/student/student-user";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import openSocket from "socket.io-client";
import { toast } from "sonner";

const useStudentClassAnnouncements = () => {
  const { auth, loading: isLoadingAuth } = useAuth();

  // TODO: Merge this and useCourseAnnouncements into one clean reusable hook

  const studentClass = auth.user?.year;

  const announcementsQueryKey = ["class-announcements", studentClass];

  const { data: classAnnouncements, isLoading: isLoadingClassAnnouncements } =
    useQuery<Announcement[]>({
      refetchInterval: import.meta.env.VITE_HOSTED === "1" ? 10000 : false,
    queryKey: announcementsQueryKey,
      initialData: [],
      enabled: !isLoadingAuth && !!studentClass,
      queryFn: async () => {
        try {
          const result = await api.get(
            `/api/years/${studentClass}/announcements`
          );
          return result.data.data;
        } catch (error) {
          toast.error(
            "An unexpected error occurred while loading class announcements, please try again later."
          );
          console.error(error);
        }
      },
    });

  const userCanModifyAnnouncements = auth.user?.role === "class_representative";

  const queryClient = useQueryClient();

  useEffect(() => {
    // TODO: handle fetching errors
    if (!studentClass) throw new Error("studentClass is undefined.");
    const socket = openSocket(import.meta.env.VITE_SERVER_URL || undefined, { autoConnect: import.meta.env.VITE_HOSTED !== "1", transports: import.meta.env.VITE_HOSTED === "1" ? ["websocket"] : ["polling", "websocket"] });
    socket.on(`years-${studentClass}-polls`, ({ data, action }) => {
      queryClient.setQueryData(
        ["class-announcements", studentClass],
        (announcements: Announcement[]) => {
          return announcements.map((announcement) => {
            if (announcement.type !== "poll") return announcement;

            const pollHasPollItemToBeToggled = announcement.pollItems.some(
              (pollItem) => pollItem.id === data.poll_item_id
            );

            if (!pollHasPollItemToBeToggled) return announcement;

            const toggledPollItemId = data.poll_item_id;

            // Change the votes count of the voted poll item
            const updatedPollItems = announcement.pollItems.map((pollItem) => {
              if (pollItem.id !== toggledPollItemId) return pollItem;

              let newVotersIds: string[] = [];

              if (action === "vote") {
                newVotersIds.push(data.voter_id);
              } else {
                newVotersIds = newVotersIds.filter(
                  (voterId) => voterId !== data.voter_id
                );
              }

              return {
                ...pollItem,
                votersIds: newVotersIds,
              };
            });

            return {
              ...announcement,
              pollItems: updatedPollItems,
            };
          });
        }
      );
    });

    return () => {
      socket.off(`years-${studentClass}-polls`);
    };
  }, [studentClass, queryClient]);

  const { data: classStudents, isLoading: isLoadingClassStudents } = useQuery<
    StudentUser[]
  >({
    queryKey: [`class-students`, studentClass],
    queryFn: async () => {
      try {
        const result = await api.get(`/api/years/${studentClass}/students`);
        return result.data.data;
      } catch (error) {
        toast.error("An unexpected error occurred, polls may seem incorrect.");
        console.error(error);
      }
    },
    enabled: !!studentClass,
  });

  const getAnnouncementUri = (announcementId: string) =>
    `/api/announcements/${announcementId}`;

  return {
    classAnnouncements,
    isLoadingClassAnnouncements,
    userCanModifyAnnouncements,
    classStudents,
    isLoadingClassStudents,
    announcementsQueryKey,
    getAnnouncementUri,
  };
};

export default useStudentClassAnnouncements;
