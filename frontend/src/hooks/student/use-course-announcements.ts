import api from "@/lib/axios";
import type { Announcement } from "@/types/student/announcement";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo } from "react";
import openSocket from "socket.io-client";

export const useCourseAnnouncements = (courseCode: string | undefined) => {
  const courseAnnouncementsQueryKey = useMemo(
    () => ["course-announcements", courseCode],
    [courseCode]
  );

  const { data: announcements, isLoading } = useQuery<Announcement[]>({
    refetchInterval: import.meta.env.VITE_HOSTED === "1" ? 10000 : false,
    queryKey: courseAnnouncementsQueryKey,
    queryFn: async () => {
      // TODO: handle fetching errors
      if (!courseCode) throw new Error("courseCode is undefined.");
      const result = await api.get(`/api/courses/${courseCode}/announcements`);
      return result.data.data;
    },
    initialData: [],
    enabled: !!courseCode,
  });

  const queryClient = useQueryClient();

  useEffect(() => {
    // TODO: handle fetching errors
    if (!courseCode) throw new Error("courseCode is undefined.");
    const socket = openSocket(import.meta.env.VITE_SERVER_URL || undefined, { autoConnect: import.meta.env.VITE_HOSTED !== "1", transports: import.meta.env.VITE_HOSTED === "1" ? ["websocket"] : ["polling", "websocket"] });
    socket.on(`courses-${courseCode}-polls`, ({ data, action }) => {
      console.log(data, action);
      queryClient.setQueryData(
        courseAnnouncementsQueryKey,
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
      socket.off(`courses-${courseCode}-polls`);
    };
  }, [courseCode, queryClient, courseAnnouncementsQueryKey]);

  return {
    announcements,
    isLoading,
    courseAnnouncementsQueryKey,
  };
};
