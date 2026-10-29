import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { type Notification } from "@/types/student/notification";
import api from "@/lib/axios";
import { useAuth } from "@/providers/context/authContext";
import type { Course } from "@/types/student/course";
import { useEffect } from "react";
import { socket } from "@/lib/socket";

const useNotifications = (enrolledCourses: Course[]) => {
  const { auth, loading: isAuthLoading } = useAuth();
  const queryClient = useQueryClient();

  const { data: notifications } = useQuery<Notification[]>({
    refetchInterval: import.meta.env.VITE_HOSTED === "1" ? 10000 : false,
    queryKey: ["notifications"],
    queryFn: async () => {
      if (!auth.user?.id) {
        throw new Error("You must be signed in to perform this operation.");
      }

      const result = await api.get(`/api/notifications`);
      return result.data.data;
    },
    initialData: [],
    enabled: !isAuthLoading,
  });

  useEffect(() => {
    enrolledCourses.forEach((course) => {
      socket.on(`notifications-course-${course.code}`, (data: Notification) => {
        queryClient.setQueryData(
          ["notifications"],
          (notifications: Notification[]) => [data, ...notifications]
        );
      });
    });

    return () => {
      enrolledCourses.forEach((course) => {
        socket.off(`notifications-course-${course.code}`);
      });
    };
  }, [enrolledCourses, queryClient]);

  useEffect(() => {
    if (!auth.user) return;

    const year = auth.user.year;

    socket.on(`notifications-year-${year}`, (data: Notification) => {
      queryClient.setQueryData(
        ["notifications"],
        (notifications: Notification[]) => [data, ...notifications]
      );
    });

    return () => {
      socket.off(`notifications-year-${year}`);
    };
  }, [queryClient, auth.user]);

  const { mutate: markAllAsRead } = useMutation({
    mutationFn: () => {
      if (!auth.user?.id) {
        throw new Error("You must be signed in to perform this operation.");
      }

      queryClient.setQueryData(
        ["notifications"],
        (notifications: Notification[]) =>
          notifications.map((notification) => ({
            ...notification,
            marked_as_read: true,
          }))
      );

      return api.patch(`/api/notifications`);
    },
  });

  const unreadNotificationsCount = notifications.reduce(
    (total, notification) => total + Number(!notification.marked_as_read),
    0
  );

  return {
    unreadNotificationsCount,
    markAllAsRead: () => markAllAsRead(),
    notifications,
  };
};

export default useNotifications;
