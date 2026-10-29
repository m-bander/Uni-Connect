import api from "@/lib/axios";
import { useAuth } from "@/providers/context/authContext";
import type { MessageResponse } from "@/types/student/message";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import openSocket from "socket.io-client";

const useGroup = () => {
  const [message, setMessage] = useState("");
  const queryClient = useQueryClient();
  const { auth, loading: authLoading } = useAuth();
  const { id } = useParams();

  const { data: messagesWithGroup, isLoading: isLoadingMessages } = useQuery<
    MessageResponse["data"]
  >({
    refetchInterval: import.meta.env.VITE_HOSTED === "1" ? 10000 : false,
    queryKey: ["group", id],
    queryFn: async () => {
      // TODO: Fetch only last n messages and fetch more as the user scroll
      const response = await api.get<MessageResponse>(
        `/api/groups/${id}/messages`
      );

      return response.data.data;
    },
  });

  useEffect(() => {
    const socket = openSocket(import.meta.env.VITE_SERVER_URL || undefined, { autoConnect: import.meta.env.VITE_HOSTED !== "1", transports: import.meta.env.VITE_HOSTED === "1" ? ["websocket"] : ["polling", "websocket"] });
    socket.on(`messages-group-${id}`, (data) => {
      switch (data.action) {
        case "create":
          queryClient.setQueryData(
            ["group", id],
            (currentGroupData: MessageResponse["data"]) => {
              return {
                ...currentGroupData,
                messages: [...currentGroupData.messages, data.message],
              };
            }
          );
          break;
        case "delete":
          queryClient.setQueryData(
            ["group", id],
            (currentGroupData: MessageResponse["data"]) => {
              return {
                ...currentGroupData,
                messages: currentGroupData.messages.filter(
                  (message) => message.id !== data.message.id
                ),
              };
            }
          );
          break;
        case "update":
          queryClient.setQueryData(
            ["group", id],
            (currentGroupData: MessageResponse["data"]) => {
              const indexOfMessageToBeUpdated =
                currentGroupData.messages.findIndex(
                  (message) => message.id === data.message.id
                );

              return {
                ...currentGroupData,
                messages: currentGroupData.messages
                  .slice(0, indexOfMessageToBeUpdated)
                  .concat([data.message])
                  .concat(
                    currentGroupData.messages.slice(
                      indexOfMessageToBeUpdated + 1
                    )
                  ),
              };
            }
          );
          break;
      }
    });

    return () => {
      socket.off(`messages-group-${id}`);
    };
  }, [id, queryClient]);

  const sendMessage = async () => {
    if (!message || !auth.user?.id) return;

    const newMessage = {
      content: message,
      sender_id: auth.user.id,
    };

    await api.post(`/api/groups/${id}/messages`, newMessage);
    setMessage("");
    await queryClient.invalidateQueries({queryKey:["group",id]});
  };

  return {
    message,
    setMessage,
    group: messagesWithGroup?.group,
    messages: messagesWithGroup?.messages ?? [],
    isLoadingMessages,
    sendMessage,
    userId: auth.user?.id,
    authLoading,
  };
};

export default useGroup;
