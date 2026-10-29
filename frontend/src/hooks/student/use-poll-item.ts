import api from "@/lib/axios";
import { useAuth } from "@/providers/context/authContext";
import type { PollItem } from "@/types/student/announcement";
import { useMutation } from "@tanstack/react-query";

const usePollItem = (pollItem: PollItem) => {
  const { auth } = useAuth();
  const pollItemChecked = pollItem.votersIds.some(
    (voteId) => voteId === auth.user?.id
  );

  // TODO: Handle the case where the user votes and un-votes immediately, maybe use AbortController

  const { mutate: toggleVote } = useMutation({
    mutationFn: async () => {
      if (pollItemChecked) {
        await api.delete(`/api/poll_items/${pollItem.id}/votes`);
      } else {
        await api.post(`/api/poll_items/${pollItem.id}/votes`);
      }
    },
  });

  return {
    pollItemChecked,
    toggleVote,
  };
};

export default usePollItem;
